import { APICore } from "./apiCore";

const api = new APICore();

function saveOrder(params: any) {
    const baseUrl = "/api/Order/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllOrder(params: {
    pageNumber: number;
    pageSize: number;
    query: string;
    customerId:number;

}) {
    const baseUrl = "/api/Order/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getOrder(params: { id: number | string }) {
    const baseUrl = "/api/Order/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteOrder = (id: any) => {
    const baseUrl = "/api/Order/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }

  function orderStatus(params: {orderId: number | string; status:string ;  reason: any}) {
    const baseUrl = "/api/Order/SetStatus";
    const url = `${baseUrl}?orderId=${params.orderId}&status=${params.status}&reason=${params.reason}`;
    return api.create(url, {}); 
}



export { getAllOrder,  saveOrder, deleteOrder, getOrder,orderStatus }