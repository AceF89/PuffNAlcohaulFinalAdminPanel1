import { APICore } from "./apiCore";

const api = new APICore();

function saveStores(params: any) {
    const baseUrl = "/api/Stores/Save";
    return api.create(`${baseUrl}`, params);
}


function saveCategoryStore(params: {storeId: number; categoryId:number}) {
    const baseUrl = "/api/Stores/LinkCategory";
    const url = `${baseUrl}?storeId=${params.storeId}&categoryId=${params.categoryId}`;
    return api.create(url, {}); 
}


function saveUserStore(params: {userId: number; storeId:number}) {
    const baseUrl = "/api/Stores/LinkUser";
    const url = `${baseUrl}?userId=${params.userId}&storeId=${params.storeId}`;
    return api.create(url, {}); 
}



const deleteStorecategory = (params :  {id:number ;storeId: number; categoryId:number}) => {
    const baseUrl = "/api/Stores/UnlinkCategory";
    return api.delete(`${baseUrl}?id=${params.id}&storeId=${params.storeId}&categoryId=${params.categoryId}`);
  }

  const deleteUserStore = (params :  {id:number ;storeId: number; userId:number}) => {
    const baseUrl = "/api/Stores/UnlinkUser";
    return api.delete(`${baseUrl}?id=${params.id}&storeId=${params.storeId}&userId=${params.userId}`);
  }

function getAllStores(params: {
    pageNumber: number;
    pageSize: number;
    query?: string;

}) {
    const baseUrl = "/api/Stores/GetAll";
    return api.get(`${baseUrl}`, params);
}



function getStores(params: { id: number | string }) {
    const baseUrl = "/api/Stores/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteStores = (id: any) => {
    const baseUrl = "/api/Stores/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }

 


export { saveStores, getAllStores, getStores, deleteStores,saveCategoryStore,deleteStorecategory,deleteUserStore,saveUserStore}