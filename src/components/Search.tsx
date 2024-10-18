import { useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";

let debounce: any = undefined;
const Search = ({ pagination }: { pagination: any }) => {
  const [value, setValue] = useState<any>("");
  const onChange = (value: any) => {
    if (debounce) {
      clearInterval(debounce);
    }
    debounce = setTimeout(() => {
      if (pagination?.handleSearch) {
        pagination?.handleSearch(value || "");
      }
    }, 400);
  };
  return (
    <InputGroup
      className="align-items-center  rounded-border bg-white"
      style={{ position: "relative", right: "20px", width: "240px" }}
    >
      <i className="bi bi-search bg-white icon-search bg-light ms-2"></i>
      <FormControl
        className="search-input bg-white border-0 rounded-border"
        type="search"
        value={value}
        onChange={(e: any) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        // placeholder={`${pagination?.totalItems || ""} records...`}
        placeholder="Search..."
      />
    </InputGroup>
  );
};

export default Search;
