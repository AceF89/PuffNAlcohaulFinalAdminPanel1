import { APICore } from "./apiCore";

const api = new APICore();

function saveDriver(params: any) {
    const baseUrl = "/api/Driver/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllDriver(params: {
    pageNumber: number;
    pageSize: number;
    query: string;

}) {
    const baseUrl = "/api/Driver/GetAll";
    return api.get(`${baseUrl}`, params);
}


function getDriver(params: { id: number | string }) {
    const baseUrl = "/api/Driver/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteDriver = (id: any) => {
    const baseUrl = "/api/Driver/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }




export { deleteDriver, getDriver, getAllDriver, saveDriver}