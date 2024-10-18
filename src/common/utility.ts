import moment from "moment";

declare global {
  interface Window {
    runConfig: any;
    OneSignal: any;
  }
}

export const FormatDate = (date: any, format: string = "lll") => {
  const localDate = moment.utc(date);
  return localDate.format(format);
};

export const DEV_API_BASE_URL_KEY = "dev-api-base-url";

export const IsJSON = (data: any) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

export const ReadLocalStorage = (key: string) => {
  try {
    let data = localStorage.getItem(key);
    if (data && IsJSON(data)) {
      data = JSON.parse(data);
    }
    return data;
  } catch (error) {
    console.log(error, "");
    return "";
  }
};

export const { APIBaseURL: API_BASE_URL = "https://alcohol-apis.npit.pro" } =
  window.runConfig || {};
  

export const reduceString = (text: string) => {
  return text.trim().toLowerCase().replace(/ /g, "");
}