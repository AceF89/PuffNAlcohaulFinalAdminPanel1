import { APICore } from "./apiCore";

const api = new APICore();
const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };


function saveFile(params: any) {
    const baseUrl = "/api/File/Save";
    return api.createWithFile(`${baseUrl}`, params);
}

function saveFileMulti(formData: FormData) {
  const baseUrl = "/api/File/SaveMultiple";
  return api.createMultiFile(`${baseUrl}`, formData);
}


function getAllFiles(params: {
    pageNumber: number;
    pageSize: number;
     query: string;
     fileids : string;

}) {
    const baseUrl = "/api/File/GetAll";
    return api.get(`${baseUrl}`, params);
}

function getFile(params: { id: number | string }) {
    const baseUrl = "/api/File/Get";
    return api.get(`${baseUrl}`, params);
}

const deleteFile = (id: any) => {
    const baseUrl = "/api/File/Delete";
    return api.delete(`${baseUrl}?id=${id}`);
  }

export { saveFile, getFile, getAllFiles, deleteFile , saveFileMulti}