import { APICore } from "./apiCore";

const api = new APICore();


function getCountry(params: { 
    pageNumber: number;
    pageSize: number;
   }) {
    const baseUrl = "/api/Country/GetCountries";
    return api.get(`${baseUrl}`, params);
}

function getState(params: {
    pageNumber: number;
    pageSize: number;
    countryId:number | string;
}) {
    const baseUrl = "/api/Country/GetStates";
    return api.get(`${baseUrl}`, params);
}



function getCity(params: {
    pageNumber: number;
    pageSize: number;
    stateId:number | string;
}) {
    const baseUrl = "/api/Country/GetCities";
    return api.get(`${baseUrl}`, params);
}



export { getCity, getState, getCountry }