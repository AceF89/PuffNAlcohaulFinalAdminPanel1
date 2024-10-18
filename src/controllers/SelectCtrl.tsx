import React from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import { ISelectProps } from "../interfaces";
import Select from "react-select";
import AsyncSelect from "react-select/async";

let debounce: any = undefined;
const SelectCtrl = ({
  control,
  showError,
  placeholder,
  name,
  required,
  disabled,
  id,
  startAdornment,
  endAdornment,
  startAdornmentIcon,
  endAdornmentIcon,
  promiseMethod = () => {},
  label,
  options,
  onSelect,
  onChange,
  pagination,
  className = "",
  showNoneOption = false,
  canFetch = true,
  labelKey = "name",
  valueKey = "id",
  params = {},
  query = "",
  fetch,
}: ISelectProps) => {
  const rules: any = {
    required: required,
    pattern: {
      value: /[A-Za-z0-9]{1,20}/,
      message: "Field is invalid",
    },
  };

  const onSelectHandler = (e: any) => {
    const value = e?.target?.value;
    let found;
    if (value && Number(value)) {
      found = options.find((option) => Number(option.value) === Number(value));
    } else if (value) {
      found = options.find((option) => option.value === value);
    }
    if (found && onSelect) {
      onSelect(found);
    }
  };

  const promiseOptions = async (inputValue: string) => {
    try {
      if (!canFetch) {
        return;
      }
      if (id) {
        const response = await promiseMethod({
          pageNumber: 1,
          filters: inputValue,
          query: query,
          pageSize: 10,
          ...params,
        });
        if (response.data && response.data.items) {
          const data = response.data.items.map((item: any) => ({
            label: item[labelKey],
            value: item[valueKey],
          }));
          if (showNoneOption) {
            data.unshift({
              label: "None",
              value: 0,
            });
          }
          return data;
        }
      }
      return [];
    } catch (error) {
      console.log("error", error);
      return [];
    }
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
            {/* <Form.Select
							{...field}
							id={id}
							disabled={disabled}
							placeholder={placeholder}
							isInvalid={
								showError && showError(name) ? true : false
							}
                            onSelect={onSelectHandler}
						>
                            {placeholder ? <option>{placeholder}</option>: null}
							{options.map((option, idx) => (
								<option key={idx} value={option.value}>
									{option.label}
								</option>
							))}
						</Form.Select> */}
            {fetch ? (
                <AsyncSelect
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
             
            ) : (
              <Select
              {...field}
              inputId={id}
              isDisabled={disabled}
              placeholder={placeholder}
              options={options}
              value={options.find((o) => o.value == field.value)}
              onChange={(selectedOption: any) => {
                if (selectedOption) {
                  field.onChange(selectedOption.value);
                  if (onSelect) {
                    onSelect(selectedOption);
                  }
                }
              }}
            />
            
            )}
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

export default SelectCtrl;
