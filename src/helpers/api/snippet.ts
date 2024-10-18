import { APICore } from "./apiCore";

const api = new APICore();

function saveSnippet(params: any) {
    const baseUrl = "/api/Snippet/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllSnippet(params: {
    pageNumber: number;
    pageSize: number;
    query: string;

}) {
    const baseUrl = "/api/Snippet/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getSnippet(params: { id: number | string }) {
    const baseUrl = "/api/Snippet/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteSnippet = (id: any) => {
    const baseUrl = "/api/Snippet/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }

export { saveSnippet, getSnippet, getAllSnippet, deleteSnippet }