import React from "react";
import { Navigate } from "react-router-dom";

import { APICore } from "../helpers/api/apiCore";
import { USER_ROLE } from "../constants";

const Root = () => {
  const api = new APICore();

  const getRootUrl = () => {
    let url: string = "landing";
    const loggedInUser = api.getLoggedInUser();
    // check if user logged in or not and return url accordingly
    if (api.isUserAuthenticated() === false) {
      url = "auth/login";
    } else if (loggedInUser.roleName === USER_ROLE.ADMIN) {
      url = "user";
    } else if (loggedInUser.roleName === USER_ROLE.STOREUSER) {
        url = "upcoming";
    } 
    return url;
  };

  const url = getRootUrl();

  return <Navigate to={`/${url}`} />;
};

export default Root;
