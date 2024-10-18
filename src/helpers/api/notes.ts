import { APICore } from "./apiCore";

const api = new APICore();



function getNotes(params: { id: number | string }) {
    const baseUrl = "/api/Notes/Get";
    return api.get(`${baseUrl}`, params);
}

function getComments(params: { id: number | string }) {
    const baseUrl = "/api/Comments/Get";
    return api.get(`${baseUrl}`, params);
}






export {  getNotes ,getComments}