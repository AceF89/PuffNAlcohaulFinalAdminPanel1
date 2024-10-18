import { APICore } from "./apiCore";

const api = new APICore();

function saveSnag(params: any) {
    const baseUrl = "/api/Task/Save";
    return api.create(`${baseUrl}`, params);
}

function getMyDashboard() {
    const baseUrl = "/api/Utilities/GetMyDashboard";
    return api.get(`${baseUrl}`, {});
}

function getAdminDashboard() {
    const baseUrl = "/api/Utilities/GetAdminDashboard";
    return api.get(`${baseUrl}`, {});
}



export { saveSnag,  getMyDashboard, getAdminDashboard }