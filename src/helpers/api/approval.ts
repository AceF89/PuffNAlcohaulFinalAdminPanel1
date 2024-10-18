import { APICore } from "./apiCore";

const api = new APICore();


function getAllDriverApproval(params: {
    pageNumber: number;
    pageSize: number;
    filter:string;
    //  query: string;

}) {
    const baseUrl = "/api/User/GetAll";
    return api.get(`${baseUrl}`, {...params,   filter:"DRIVER_PENDING_APPROVAL"});
}

export { getAllDriverApproval }