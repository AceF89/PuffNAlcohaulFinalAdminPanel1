import { APICore } from "./apiCore";

const api = new APICore();

function saveEvent(params: any) {
    const baseUrl = "/api/Event/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllEvent(params: {
    pageNumber: number;
    pageSize: number;
    query: string;

}) {
    const baseUrl = "/api/Event/GetAll";
    return api.get(`${baseUrl}`, params);
}



function getEvent(params: { id: number | string }) {
    const baseUrl = "/api/Event/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteEvent = (id: any) => {
    const baseUrl = "/api/Event/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }


export { saveEvent, getAllEvent, getEvent, deleteEvent}