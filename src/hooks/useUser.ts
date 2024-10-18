import { useEffect, useState, useMemo } from "react";

import { APICore } from "../helpers/api/apiCore";
import { IUser } from "../interfaces";

const useUser = (): { user: IUser | void, updateUser: (user: Partial<IUser>) => void } => {
  const api = useMemo(() => new APICore(), []);

  const [user, setuser] = useState<IUser>();

  const updateUser = (user: Partial<IUser>) => { 
    api.updateLoggedInUser(user)
  }

  useEffect(() => {
    if (api.isUserAuthenticated()) {
      setuser(api.getLoggedInUser());
    }
  }, [api]);

  return { user, updateUser };
};

export default useUser;
