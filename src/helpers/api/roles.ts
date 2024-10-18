import { APICore } from "./apiCore";

const api = new APICore();


function getAllRoles(params: {
    pageNumber: number;
    pageSize: number;
    // query: string;
   
  }){
    const baseUrl = "/api/Roles/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getRolesDetail(params: {id: number | string}) {
    const baseUrl = "/api/Roles/Get";
    return api.get(`${baseUrl}`, params);
}


export {  getAllRoles, getRolesDetail }