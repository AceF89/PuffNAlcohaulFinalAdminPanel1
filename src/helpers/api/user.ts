import { APICore } from "./apiCore";

const api = new APICore();

function saveUser(params: any) {
    const baseUrl = "/api/User/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllUser(params: {
    pageNumber: number;
    pageSize: number;
    filters?:string;
    query: string;

}) {
    const baseUrl = "/api/User/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getAllWorker(params: {
    pageNumber: number;
    pageSize: number;
    filters:string;
    query: string;

}) {
    const baseUrl = "/api/User/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getUser(params: { id: number | string }) {
    const baseUrl = "/api/User/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteUser = (id: any) => {
    const baseUrl = "/api/User/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }

  const blockUser = (params: any) => {
    const baseUrl = "/api/User/Blocked";
    return api.create(`${baseUrl}?id=${params.id}&isActive=${params.isActive}`,params);
  }


export { saveUser, getUser, getAllUser, deleteUser, getAllWorker, blockUser}