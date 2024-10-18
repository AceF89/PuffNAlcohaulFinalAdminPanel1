import { APICore } from "./apiCore";

const api = new APICore();

function saveCategories(params: any) {
    const baseUrl = "/api/Categories/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllCategories(params: {
    pageNumber: number;
    pageSize: number;
    filters:string;
    query: string;

}) {
    const baseUrl = "/api/Categories/GetAll";
    return api.get(`${baseUrl}`, params);
}



function getCategories(params: { id: number | string }) {
    const baseUrl = "/api/Categories/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteCategories = (id: any) => {
    const baseUrl = "/api/Categories/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }
  function setOrderCategories(params: any) {
    const baseUrl = "/api/Categories/SetSortOrder";
    return api.create(`${baseUrl}?ids=${params.ids}`, {});
  }


export { saveCategories, getAllCategories, getCategories, deleteCategories,setOrderCategories}