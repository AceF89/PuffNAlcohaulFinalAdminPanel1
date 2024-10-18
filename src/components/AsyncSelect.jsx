import { useEffect } from "react";
import { ISelectProps } from "../interfaces";

const AsyncSelect = ({
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
}) => {

    useEffect(()=>{
        console.log("options")
    })

  return (
    <AsyncSelect
      inputId={id}
      isSearchable={true}
      isDisabled={disabled}
      placeholder={placeholder}
      defaultOptions={options}
      loadOptions={promiseOptions}
      options={options}
      value={options.find((o) => o.value == field.value)}
      onChange={(selectedOption) => {
        console.log(selectedOption);
        if (selectedOption) {
          field.onChange(selectedOption.value);
          if (onSelect) {
            onSelect(selectedOption);
          }
        }
      }}
    />
  );
};

export default AsyncSelect;
