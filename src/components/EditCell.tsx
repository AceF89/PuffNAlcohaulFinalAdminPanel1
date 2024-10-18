import { getAllProducts, saveStoreProducts } from 'helpers/api/products';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from 'hooks';
import { useLocation } from 'react-router-dom';

interface EditableCellProps {
    value: string;
    row: any;
    column: { id: string };
    refreshTableData?: any;
}

const EditCell: React.FC<EditableCellProps> = ({
    value: initialValue,
    row,
    column: { id },
    refreshTableData
}) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const changedValuesRef = useRef<Record<string, string>>({});
    const { showToast } = useToast();
    let location = useLocation();
    let path = location.pathname;
    let arr = path.split("/");
    let storeId = parseInt(arr[arr.length - 1]);

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                const changedValues = changedValuesRef.current;
                const response = await saveStoreProducts({
                    ...row?.original,
                    posId: row?.original.productPosId,
                    id: row?.original.storeProductId,
                    productId: row?.original.id,
                    storeId: storeId ? storeId : row?.original?.storeId,
                    costPrice: changedValues.Cost ? Number(changedValues.Cost) : row?.original?.costPrice,
                    salePrice: changedValues.Price ? Number(changedValues?.Price) : row?.original?.salePrice,
                    currentStock: changedValues?.currentStock ? changedValues?.currentStock : row?.original?.currentStock,
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
            {id === 'Cost' || id === 'Price'  ? (
                <div className="input-group custom_input">
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
                        className="form-control "
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

export default EditCell;
