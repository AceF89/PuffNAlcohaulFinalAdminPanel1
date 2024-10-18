import { saveProducts } from 'helpers/api/products';
import React, { useState, useEffect, useRef } from 'react';
import { debounce } from "lodash";
import { useToast } from 'hooks';
import Form from 'react-bootstrap/Form';

interface EditableCellProps {
    value: string;
    row: any;
    column: { id: string };
    updateData: (rowIndex: number, columnId: string, value: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    value: initialValue,
    row,
    column: { id },
    updateData,
}) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const changedValuesRef = useRef<Record<any, any>>({});
    const { showToast } = useToast();

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setValue(newValue as string);
        changedValuesRef.current = {
            ...changedValuesRef.current,
            [e.target.name]: newValue,
        };
        debouncedOnChange.current(changedValuesRef.current);
    };

    const debouncedOnChange = useRef(
        debounce(async (changedValues: Record<string, string>) => {
            try {
                const response = await saveProducts({
                    ...row?.original,
                    costPrice: changedValues.Cost ? Number(changedValues.Cost) : row?.original?.costPrice,
                    salePrice: changedValues.Price ? Number(changedValues?.Price) : row?.original?.salePrice,
                    currentStock: changedValues?.currentStock ? changedValues?.currentStock : row?.original?.currentStock,
                    isFeatured: changedValues.Featured !== undefined ? changedValues.Featured : row?.original?.isFeatured,
                });

                if (response.statusCode === 200) {
                    showToast("success", response.message);
                } else {
                    console.log(response.error);
                    showToast("error", response.message);
                }
            } catch (error) {
                console.log(error);
            }
        }, 1000)
    );

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <>
            {id === 'Cost' || id === 'Price' ? (
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id={`${id}-addon`}>$</span>
                    </div>
                    <input
                        ref={inputRef}
                        value={value}
                        name={id}
                        onChange={onChange}
                        type="text"
                        className="form-control"
                        aria-label={id}
                        aria-describedby={`${id}-addon`}
                    />
                </div>
            ) : id === 'Featured' ? (
                <Form.Check
                    defaultChecked={row.original.isFeatured}
                    type="switch"
                    id={id}
                    name={id}
                    onChange={onChange}
                />
            ) : (
                <input
                    ref={inputRef}
                    value={value}
                    name={id}
                    onChange={onChange}
                    type="text"
                    className="form-control"
                    aria-label={id}
                />
            )}
        </>
    );
};

export default EditableCell;
