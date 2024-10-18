import React from "react";
import Select, { SingleValue } from "react-select";

interface SelectFilterProps {
  pagination?: any;
  options: any[];
  paramName: string;
  placeholder: string; 
  onChange: (selectedStatus: any) => void;
}

const SelectFilter = ({
  pagination,
  options = [],
  paramName = "status",
  placeholder, 
  onChange,
}: SelectFilterProps) => {
  const handleSelectChange = (
    selectedOption: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    if (pagination?.handleSelectFilter && selectedOption) {
      pagination?.handleSelectFilter(selectedOption.value || "", paramName);
    }
    onChange(selectedOption);
  };

  return (
    <div>
      <Select
        placeholder={placeholder} 
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 9999 }),
          control: (provided) => ({
            ...provided,
            fontSize: "15px",
            width: "250px",
          }),
        }}
        options={options}
        onChange={(selectedOption) => {
          handleSelectChange(selectedOption);
        }}
      />
    </div>
  );
};

export default SelectFilter;
