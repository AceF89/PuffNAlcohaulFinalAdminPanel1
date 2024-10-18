import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";
import FeatherIcon from "feather-icons-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { logoutUser } from "../redux/actions";

interface ProfileMenuItem {
  label: string;
  icon: string;
  redirectTo: string;
}

interface ProfileDropdownProps {
  // menuItems: Array<ProfileMenuItem>;
  profilePic?: string;
  username: string;
  userRoleName?: string;

}

const ProfileDropdown = (props: ProfileDropdownProps) => {
  const profilePic = props.profilePic || null;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  /*
   * toggle profile-dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const HandleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-profile"
        as="a"
        onClick={toggleDropdown}
        className={classNames(
          "nav-link",
          "nav-user",
          "me-0",
          "cursor-pointer",
          { show: dropdownOpen }
        )}
      >
        <img src={profilePic!} className="rounded-circle" alt="" />
        <span className="pro-user-name ms-2">
          {props.username} 
          <pre className="pro-user-name position-absolute mb-4 overflow-hidden mt-1" style={{ top:"15px",color:"#0C94EA", marginLeft:"40px"}}>
         {props.userRoleName}
        
          <i className="uil uil-angle-down"></i>
          </pre>
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end profile-dropdown">
        <div onClick={toggleDropdown}>
          <div className="dropdown-header noti-title">
            <h6 className="text-overflow m-0">Welcome !</h6>
          </div>
          {/* {(props.menuItems || []).map((item, i) => {
            return (
              <React.Fragment key={i}>
                {i === props.menuItems.length - 1 && (
                  <div className="dropdown-divider"></div>
                )}
                <Link
                 to={item.redirectTo}
                  className="dropdown-item notify-item"
                  key={i + "-profile-menu"}
                >
                  <FeatherIcon
                    icon={item.icon}
                    className="icon-dual icon-xs me-1"
                  />
                  <span>{item.label}</span>
                </Link>
              </React.Fragment>
            );
          })} */}
          <React.Fragment>
            <span
              className="dropdown-item notify-item hand"
              onClick={HandleLogout}
            >
              <FeatherIcon
                icon="log-out"
                className="icon-dual icon-xs me-1"
              />
              <span>Logout</span>
            </span>
          </React.Fragment>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
