import { APICore } from "./apiCore";

const api = new APICore();

// account
function login(params: { email: string; password: string }) {
  const baseUrl = "/api/User/Login";
  return api.create(`${baseUrl}`, params);
}

function logout() {
  const baseUrl = "/logout/";
  return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
  const baseUrl = "/api/User/SignUp";
  return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { email: string }) {
  const baseUrl = "/api/User/ForgotPassword";
  return api.create(`${baseUrl}`, params);
}

function me() {
  const baseUrl = "/api/User/Me"
  return api.get(`${baseUrl}`, {});
}

export { login, logout, signup, forgotPassword, me };
