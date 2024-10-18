import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Form, InputGroup } from "react-bootstrap";

import { IInputProps } from "../interfaces";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const InputCtrl = ({
  control,
  showError,
  placeholder,
  name,
  required,
  disabled,
  id,
  type,
  startAdornment,
  endAdornment,
  startAdornmentIcon,
  endAdornmentIcon,
  label,
  defaultValue,
  max,
  min,
  componentName,
  rules: customRoles,
  maxLength,
  minLength,
  edit,
  className = "mb-3",
}: IInputProps) => {
  const [inputType, setInputType] = useState("password");
  const rules: any = {
    required: required,
    pattern: {
      value: /[A-Za-z0-9]{1,20}/,
      message: "Field is invalid",
    },
    ...customRoles,
  };

  const addMinLength = (val: number) => {
    rules["minLength"] = {
      value: val,
      message: `Should be min ${val} char long`,
    };
  };

  const addMaxLength = (val: number) => {
    rules["maxLength"] = {
      value: val,
      message: `Should be max ${val} char long`,
    };
  };

  const addPattern = (value: any, messasge: string) => {
    rules["pattern"] = {
      value: value,
      message: messasge,
    };
  };

  if (maxLength) {
    addMaxLength(maxLength);
  }
  if (minLength) {
    addMinLength(minLength);
  }

  const containsOnlyNumbers = (str: string) => {
    const numberPattern = /^[0-9]+$/;
    return numberPattern.test(str);
  };
  const containsLetters = (str: string) => {
    const letterPattern = /[A-Za-z]/;
    return letterPattern.test(str);
  };

  const addressValid = (str: string) => {
    const addressPattern = /^[A-Za-z0-9\s.,#\-']+$/;
    return addressPattern.test(str);
  };

  if (componentName) {
    if (componentName === "Address") {
      addMinLength(3);
      addMaxLength(100);
      rules["validate"] = (val: any) => {
        if (containsOnlyNumbers(val)) {
          return "Address must contain letters, ex: '123 Main St'";
        } else if (!containsLetters(val) || !addressValid(val)) {
          return `Please enter a valid address with letters, numbers, spaces, commas, periods, hash, hyphens, and single quotes only.`;
        }
        return true;
      };
    } else if (componentName === "FullName") {
      addMinLength(3);
      addMaxLength(50);
      const namePattern = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
      addPattern(
        namePattern,
        "Please enter a valid name with letters and spaces only."
      );
    } else if (componentName === "Name") {
      addMinLength(3);
      addMaxLength(50);
      // const namePattern =
      // //  /^[a-zA-Z\s]*$/;
      //  /(?: [A-Za-z]+)?/;
      const namePattern = /^[A-Za-z]+(\s[A-Za-z]+)*$/;

      addPattern(namePattern, "Please enter a valid name with letters only.");
    } else if (componentName === "Number") {
      const numberPattern = /^[0-9]*\.?[0-9]+$/; // Allow positive real numbers including 0
      addPattern(numberPattern, "Please enter a valid number.");
    } else if (componentName === "Email") {
      addMinLength(6);
      addMaxLength(40);
      // Regular expression for basic email validation
      // const emailPattern =
      // 	/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      const emailPattern =
        // /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
        /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
      addPattern(emailPattern, `Invalid email address.`);
    } else if (componentName === "Website") {
      // Regular expression for basic website URL validation
      // const urlPattern =
      // /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?$/;
      const urlPattern =
        /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
      addPattern(urlPattern, `Invalid website url`);
    } else if (componentName === "PhoneNumber") {
      // Example of valid phone number
      // 1. +919876543210
      // 2. +1(555)654-3210
      // 3. +1 (555) 654-3210
      // 4. +91 9876543210

      // Regular expression for phone number validation
      const phonePattern = /^\+\d{1,3} \d{3}-\d{3}-\d{4}$/;
      addPattern(phonePattern, `Invalid phone number.`);
    }
  }

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field }) => (
        <>
          {startAdornment || endAdornment ? (
            <>
              <Form.Label htmlFor={id}>
                {label} {required && <span className="text-danger">*</span>}
              </Form.Label>
              <InputGroup className={`${className}`}>
                {startAdornment ? (
                  <InputGroup.Text id={`${id}-addon1`}>
                    {startAdornment}
                  </InputGroup.Text>
                ) : null}
                <Form.Control
                  {...field}
                  id={id}
                  disabled={disabled}
                  type={type}
                  placeholder={placeholder}
                  isInvalid={showError && showError(name) ? true : false}
                  defaultValue={defaultValue}
                  max={max}
                  min={min}
                  step="any"
                />
                {endAdornment ? (
                  <InputGroup.Text id={`${id}-addon1`}>
                    {endAdornment}
                  </InputGroup.Text>
                ) : null}
                {showError && showError(name) ? (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {showError(name)}
                  </Form.Control.Feedback>
                ) : null}
              </InputGroup>
            </>
          ) : (
            <>
              {type === "password" ? (
                <Form.Group className={`${className}`}>
                  <Form.Label
                    htmlFor={id}
                    className={`${label === "" ? "d-none" : ""}`}
                  >
                    {label} {required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control
                    {...field}
                    id={id}
                    disabled={disabled}
                    type={inputType}
                    placeholder={placeholder}
                    isInvalid={showError && showError(name) ? true : false}
                    defaultValue={defaultValue}
                    max={max}
                    min={min}
                    step="any"
                    maxLength={maxLength}
                    className={"cutome"}
                    autoComplete="off"
                  />

                  {edit && (
                    <div className="sug-text">
                      leave field empty to keep same password
                    </div>
                  )}

                  {/* leave field empty to keep same password */}

                  {inputType === "password" ? (
                    <div
                      className={"eye-icon"}
                      onClick={() => setInputType("text")}
                    >
                      <FaRegEyeSlash />
                    </div>
                  ) : (
                    <div
                      className={"eye-icon"}
                      onClick={() => setInputType("password")}
                    >
                      <FaRegEye />
                    </div>
                  )}
                  {showError && showError(name) ? (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {showError(name)}
                    </Form.Control.Feedback>
                  ) : null}
                </Form.Group>
              ) : (
                <Form.Group className={`${className}`}>
                  <Form.Label
                    htmlFor={id}
                    className={`${label === "" ? "d-none" : ""}`}
                  >
                    {label} {required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control
                    {...field}
                    id={id}
                    disabled={disabled}
                    type={type}
                    placeholder={placeholder}
                    isInvalid={showError && showError(name) ? true : false}
                    defaultValue={defaultValue}
                    max={max}
                    min={min}
                    step="any"
                    maxLength={maxLength}
                    className={"cutome"}
                  />
                  {showError && showError(name) ? (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {showError(name)}
                    </Form.Control.Feedback>
                  ) : null}
                </Form.Group>
              )}
            </>
          )}
        </>
      )}
    ></Controller>
  );
};

export default InputCtrl;
