import { APICore } from "./apiCore";

const api = new APICore();

function saveLocation(params: any) {
    const baseUrl = "/api/Location/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllLocation(params: {
    pageNumber: number;
    pageSize: number;
     query: string;

}) {
    const baseUrl = "/api/Location/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getLocation(params: { id: number | string }) {
    const baseUrl = "/api/Location/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteLocation = (id: any) => {
    const baseUrl = "/api/Location/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }

export { saveLocation, getLocation, getAllLocation, deleteLocation }