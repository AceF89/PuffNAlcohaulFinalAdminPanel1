import { APICore } from "./apiCore";

const api = new APICore();

function saveCoupon(params: any) {
    const baseUrl = "/api/Coupon/Save";
    return api.create(`${baseUrl}`, params);
}

function getAllCoupon(params: {
    pageNumber: number;
    pageSize: number;
    query: string;

}) {
    const baseUrl = "/api/Coupon/GetAll";
    return api.get(`${baseUrl}`, params);
}


function getCoupon(params: { id: number | string }) {
    const baseUrl = "/api/Coupon/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteCoupon = (id: any) => {
    const baseUrl = "/api/Coupon/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }




export { saveCoupon, getAllCoupon, getCoupon, deleteCoupon}