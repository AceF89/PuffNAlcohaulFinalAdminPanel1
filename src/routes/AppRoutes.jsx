import { Routes, Route } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Login from "../pages/login/Login";
import UserList from "../pages/users/UserList";
import UserDetails from "../pages/users/UserDetails";

const AppRoutes = () => {
  console.log(location.pathname === "/login");
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {location.pathname !== "/login" ? (
            <div className="col-lg-2 bg_primary">
              <Sidebar />
            </div>
          ) : (
            ""
          )}
          <div
            className={`mt-5 ${
              location.pathname === "/login" ? "col-lg-12" : "col-lg-10"
            }`}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<UserList />} />
              <Route path="/userdetails" element={<UserDetails />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppRoutes;
