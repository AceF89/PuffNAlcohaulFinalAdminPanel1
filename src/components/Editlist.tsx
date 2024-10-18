import { getProducts, saveStoreProducts } from 'helpers/api/products';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from 'hooks';

interface EditableCellProps {
    value: string;
    row: any;
    column: { id: string };
    refreshTableData?: any;
}

const Editlist: React.FC<EditableCellProps> = ({
    value: initialValue,
    row,
    column: { id },
    refreshTableData
}) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();
    const changedValuesRef = useRef<Record<string, string>>({});

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        changedValuesRef.current = {
            ...changedValuesRef.current,
            [e.target.name]: newValue,
        };
    };

    const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                const response = await saveStoreProducts({
                    ...row?.original,
                    costPrice: changedValuesRef.current.Cost ? Number(changedValuesRef.current.Cost) : row?.original?.costPrice,
                    salePrice: changedValuesRef.current.Price ? Number(changedValuesRef.current.Price) : row?.original?.salePrice,
                    currentStock: changedValuesRef.current.currentStock ? changedValuesRef.current.currentStock : row?.original?.currentStock,
                });

                if (response.statusCode === 200) {
                    showToast("success", response.message);
                    if (refreshTableData) {
                        refreshTableData();
                    }
                } else {
                    console.log(response.error);
                    showToast("error", response.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

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
                        onKeyDown={onKeyDown}
                        type="text"
                        className="form-control"
                        aria-label={id}
                        aria-describedby={`${id}-addon`}
                    />
                </div>
            ) : (
                <div className="input-group">
                <div className="input-group-prepend">
                    {/* <span className="input-group-text" id={`${id}-addon`}></span> */}
                </div>
                <input
                    ref={inputRef}
                    value={value}
                    name={id}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    type="text"
                    className="form-control"
                    aria-label={id}
                    aria-describedby={`${id}-addon`}
                />
            </div>
         
            )}
        </>
    );
};

export default Editlist;
