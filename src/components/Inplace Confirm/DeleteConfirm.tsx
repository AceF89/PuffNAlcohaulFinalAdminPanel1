import React, { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

const DeleteConfirm = ({
  confirm = () => {},
  disabled = false,
  isHide = false,
  iconColor = "text-danger",
  iconMargin = "me-2",
  iconSize = "fs-24",
  iconClass = "uil uil-trash-alt",
  message = undefined || "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return !isHide ? (
    <>
      <OverlayTrigger
        trigger="click"
        show={isOpen}
        key={"Delete"}
		placement="left"
        overlay={
          <Popover popper id={`delete`} >
            <Popover.Body className="h5 font-bold">
              {message || "Are you sure ?"}
            </Popover.Body>
            <div className="d-flex justify-content-between">
              <i
                className="uil uil-check fs-24 cursor-pointer text-success mx-2"
                onClick={() => {
                  handleToggle();
                  confirm();
                }}
              ></i>
              <i
                className="uil uil-times fs-24 cursor-pointer text-danger mx-2"
                onClick={handleToggle}
              ></i>
            </div>
          </Popover>
        }
      >
        <i
          className={`${iconClass} cursor-pointer ${iconColor} ${iconMargin} ${iconSize}`}
          onClick={() => {
            if (!disabled) {
              handleToggle();
            }
          }}
        ></i>
      </OverlayTrigger>
    </>
  ) : null;
};

export default DeleteConfirm;
