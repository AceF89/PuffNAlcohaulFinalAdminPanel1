import { APICore } from "./apiCore";

const api = new APICore();

function saveProducts(params: any) {
    const baseUrl = "/api/Products/Save";
    return api.create(`${baseUrl}`, params);
}

function saveStoreProducts(params: any) {
    const baseUrl = "/api/Stores/SaveStoreProduct";
    return api.create(`${baseUrl}`, params);
}

function getAllProducts(params: {
    pageNumber: number;
    pageSize: number;
    query?: string;
    storeId:number;

}) {
    const baseUrl = "/api/Products/GetAll";
    return api.get(`${baseUrl}`, params);
}


function getProducts(params: { id: number | string }) {
    const baseUrl = "/api/Products/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteProducts = (id: any) => {
    const baseUrl = "/api/Products/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }



  const deleteStoreProducts = (params :  {storeId: number; productId:number}) => {
    const baseUrl = "/api/Stores/RemoveStoreProduct";
    return api.delete(`${baseUrl}?storeId=${params.storeId}&productId=${params.productId}`);
  }




export { deleteProducts, getProducts, getAllProducts, saveProducts,saveStoreProducts,deleteStoreProducts}