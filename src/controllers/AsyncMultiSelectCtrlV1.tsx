import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import { IBaseCtrl, ISelectOption } from "../interfaces";
import Select from "react-select/async";

export interface IAsyncSelectCtrlV1 extends IBaseCtrl {
  label: string;
  options: ISelectOption[];
  endAdornment?: any;
  startAdornment?: any;
  startAdornmentIcon?: any;
  endAdornmentIcon?: any;
  inputProps?: any;
  onSelect?: (option: ISelectOption) => void;
  onRemove?: (option: ISelectOption) => void;
  cb?: () => void;
  defaultValue?: any;
  promiseMethod?: any;
  onChange?:any;
  params?: any;
  canFetch?: boolean;
  labelKey?: string;
  valueKey?: string;
  showNoneOption?: boolean;
}

const AsyncMultiSelectCtrlV1 = ({
  control,
  showError,
  placeholder,
  name,
  required,
  disabled,
  id,
  label,
  onSelect,
  className = "",
  cb = () => {},
  defaultValue = undefined,
  promiseMethod = () => {},
  params = {},
  canFetch = true,
  labelKey = "Name",
  valueKey = "Id",
  showNoneOption = false
}: IAsyncSelectCtrlV1) => {
  const [selected, setSelected] = useState<any[] | null>([]);
  const rules: any = {
    required: required,
    pattern: {
      value: /^(?!\s*$).+/,
      message: "Field is invalid",
    },
  };
  const promiseOptions = async (inputValue: string) => {
    try {
      if (!canFetch) {
        return;
      }
      if (id) {
        const response = await promiseMethod({
          pageNumber: 1,
          query: inputValue,
          pageSize: 500,
          ...params,
        });
        if (response.data && response.data.items) {
          const data = response.data.items.map((item: any) => ({
            label: item[labelKey],
            value: item[valueKey],
          }));
          console.log(data)
          if(showNoneOption){
            data.unshift({
              label: "None",
              value: 0
            })
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

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div>
      <Controller
        rules={rules}
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Form.Group className={`mb-3 ${className}`}>
              <Form.Label htmlFor={id}>
                {label} {required && <span className='text-danger'>*</span>}
              </Form.Label>
              <Select
                {...field}
                inputId={id}
                isDisabled={disabled}
                placeholder={placeholder}
                loadOptions={promiseOptions}
                cacheOptions
                defaultOptions
                value={selected}
                onChange={(selectedOptions: any) => {
                  if (selectedOptions && selectedOptions.length) {
                    field.onChange(selectedOptions);
                    if (onSelect) {
                      onSelect(selectedOptions);
                    }
                    setSelected(selectedOptions);
                  } else {
                    field.onChange(null);
                    setSelected(null);
                    if (onSelect) {
                      // @ts-ignore
                      onSelect(null);
                    }
                  }
                }}
                isClearable
                isMulti
              />
              {showError && showError(name) ? (
                <Form.Control.Feedback type='invalid' className='d-block'>
                  {showError(name)}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
          </>
        )}
      ></Controller>
    </div>
  );
};

export default AsyncMultiSelectCtrlV1;
