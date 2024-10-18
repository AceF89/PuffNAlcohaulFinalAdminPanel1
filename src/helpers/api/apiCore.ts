import jwtDecode from "jwt-decode";
import axios from "axios";

import config from "../../config";

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = config.API_URL;

// intercepting to capture errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;

    if (error && error.response && error.response.status === 404) {
      // window.location.href = '/not-found';
    } else if (error && error.response && error.response.status === 403) {
      window.location.href = "/access-denied";
    } else {
      switch (error.response.status) {
        case 401:
          message = "Invalid credentials";
          break;
        case 403:
          message = "Access Forbidden";
          break;
        case 404:
          message = "Sorry! the data you are looking for could not be found";
          break;
        default: {
          message =
            error.response && error.response.data
              ? error.response.data["message"]
              : error.message || error;
        }
      }
      return Promise.reject(message);
    }
  }
);

const AUTH_SESSION_KEY = "orderReadyWebApplication";

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: string | null) => {
  if (token) axios.defaults.headers.common["Authorization"] = "" + token;
  else delete axios.defaults.headers.common["Authorization"];
};

const getUserFromCookie = () => {
  const user = sessionStorage.getItem(AUTH_SESSION_KEY);
  return user ? (typeof user == "object" ? user : JSON.parse(user)) : null;
};

export const responseHandler = (response: any) => {
    return { data: response?.data?.data, message: response?.data?.message, error: response?.data?.errors || response?.data?.message || "Something went wrong, please try again", statusCode: response?.data?.statusCode };
}

class APICore {
  /**
   * Fetches data from given url
   */
  get = async (url: string, params: any) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = await axios.get(`${url}?${queryString}`, params);
    } else {
      response = await axios.get(`${url}`, params);
    }
    return responseHandler(response);
  };

  getFile = (url: string, params: any) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, { responseType: "blob" });
    } else {
      response = axios.get(`${url}`, { responseType: "blob" });
    }
    return response;
  };

  getMultiple = (urls: string, params: any) => {
    const reqs = [];
    let queryString = "";
    if (params) {
      queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
    }

    for (const url of urls) {
      reqs.push(axios.get(`${url}?${queryString}`));
    }
    return axios.all(reqs);
  };

  /**
   * post given data to url
   */
  create = async (url: string, data: any) => {
    return responseHandler(await axios.post(url, data))
  };

  /**
   * Updates patch data
   */
  updatePatch = async (url: string, data: any) => {
    return responseHandler(await axios.patch(url, data));
  };

  /**
   * Updates data
   */
  update = async (url: string, data: any) => {
    return responseHandler(await axios.put(url, data));
  };

  /**
   * Deletes data
   */
  delete = async (url: string) => {
    return responseHandler(await axios.delete(url));
  };

  /**
   * post given data to url with file
   */
  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

   createMultiFile = (url: string, data: any,) => {
    const config = {
      headers: {
        ...axios.defaults.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
  
    return axios.post(url, data, config);
  };
// POST REQUEST for file upload
fileUpload = async (url: string, body: any, config?: any) => {
    const response = await axios.post<any>(url, body, config)
	return responseHandler(response);
};

  /**
   * post given data to url with file
   */
  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.patch(url, formData, config);
  };

  isUserAuthenticated = () => {
    const user = this.getLoggedInUser();

    if (!user) {
      return false;
    }
    const decoded: any = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    } else {
      return true;
    }
  };

  setLoggedInUser = (session: any) => {
    if (session)
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    else {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  };
  /**
   * Returns the logged in user
   */
  getLoggedInUser = () => {
    return getUserFromCookie();
  };

  updateLoggedInUser = (data: Record<string, any>) => { 
    const user = getUserFromCookie();
    if (user) {
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({...user, ...data}));
    }
  };

  setUserInSession = (modifiedUser: any) => {
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (userInfo) {
      const { token, user } = JSON.parse(userInfo);
      this.setLoggedInUser({ token, ...user, ...modifiedUser });
    }
  };
}

/*
Check if token available in session
*/
let user = getUserFromCookie();
if (user) {
  const { token } = user;
  if (token) {
    setAuthorization(token);
  }
}

export { APICore, setAuthorization };
