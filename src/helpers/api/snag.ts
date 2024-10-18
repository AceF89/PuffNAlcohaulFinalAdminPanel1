import { APICore } from "./apiCore";

const api = new APICore();

function saveSnag(params: any) {
    const baseUrl = "/api/Task/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllSnag(params: {
    pageNumber: number;
    pageSize: number;
     query: string;
     assignedTo:number;
     propertyId:number;

}) {
    const baseUrl = "/api/Task/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getSnag(params: { id: number | string }) {
    const baseUrl = "/api/Task/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteSnag = (id: any) => {
    const baseUrl = "/api/Task/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }

  const deleteSubTask = (id: any) => {
    const baseUrl = "/api/Task/DeleteSubTask";
    return api.delete(`${baseUrl}?id=${id}`);
  }


export { saveSnag, getSnag, getAllSnag, deleteSnag,deleteSubTask }