import React from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import { ISelectProps } from "../interfaces";
import DatePicker from "react-datepicker";

const Datectrl = ({
  control,
  showError,
  name,
  required,
  id,
  label,
  onChange,
  className = "",
  
  selectedDate
}: any) => {
  const rules: any = {
    required: required,
    pattern: {
      value: /[A-Za-z0-9]{1,20}/,
      message: "Field is invalid",
    },
  };


  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <Form.Group className={`mb-3 ${className}`}>
            <Form.Label
              htmlFor={id}
              className={`${label === "" ? "d-none" : ""}`}
            >
              {label} {required && <span className="text-danger">*</span>}
            </Form.Label>
           
            
            <DatePicker
             selected={selectedDate}
             
                      onChange={onChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className={"form-control cutome"}
                    />
            {showError && showError(name) ? (
              <Form.Control.Feedback type="invalid" className="d-block">
                {showError(name)}
              </Form.Control.Feedback>
            ) : null}

            {/* <AsyncSelect
              {...field}
              inputId={id}
              isSearchable={true}
              isDisabled={disabled}
              placeholder={placeholder}
              defaultOptions={options}
              loadOptions={promiseOptions}
              options={options}
              value={options.find((o) => o.value == field.value)}
              onChange={(selectedOption: any) => {
                console.log(selectedOption);
                if (selectedOption) {
                  field.onChange(selectedOption.value);
                  if (onSelect) {
                    onSelect(selectedOption);
                  }
                }
              }}
            />
            {showError && showError(name) ? (
              <Form.Control.Feedback type="invalid" className="d-block">
                {showError(name)}
              </Form.Control.Feedback>
            ) : null} */}
          </Form.Group>
        </>
      )}
    ></Controller>
  );
};

export default Datectrl;
