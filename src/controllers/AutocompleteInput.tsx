// AutocompleteInput.tsx
import usePlacesAutocomplete from 'components/PlacesAutoComplete/usePlacesAutocomplete';
import React, { useEffect, useRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Controller } from 'react-hook-form';

interface AutocompleteInputProps {
  control: any;
  name: string;
  id: string;
  placeholder: string;
  label: string;
  showError: any;
  required: boolean;
  disabled: boolean;
  className: string;
  apiKey?: string;
  type: string;
  setValue?: any,
  defaultValue?: string,
  value?: string;
  onChange?:any
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  control,
  name,
  id,
  placeholder,
  type,
  label,
  showError,
  required,
  disabled,
  className,
  apiKey,
  defaultValue,
  value,
  onChange

}) => {
  // const { address, isLoaded, loadError } = usePlacesAutocomplete(apiKey);

  // if (loadError) return <div>Error loading maps</div>;
  // if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className={className}>
      <label className='custom-label' htmlFor={id}>{label}</label>
      <input
        value={value}
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        defaultValue={defaultValue}
        className="form-control"
        ref={control}
        onChange={onChange}
      />
    </div>
  );
};

export default AutocompleteInput;

