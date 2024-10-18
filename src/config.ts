import { API_BASE_URL, DEV_API_BASE_URL_KEY, ReadLocalStorage } from "common/utility";

;


const config = {
  API_URL: ReadLocalStorage(DEV_API_BASE_URL_KEY) || process.env.REACT_APP_API_URL || "https://alcohol-apis.npit.pro",
  // API_URL: process.env.REACT_APP_API_URL || "https://alcohol-apis.npit.pro",
};


export default config;
