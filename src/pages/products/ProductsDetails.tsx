import React, { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button, Modal, Form } from "react-bootstrap";
import { InputCtrl, SelectCtrl } from "../../controllers";
import {  useForm } from "react-hook-form";
import { useState } from "react";
import { Link,  useLocation, useNavigate, useParams } from "react-router-dom";
import { useApi, useToast } from "../../hooks";
import Loader from "../../components/Loader";
import {  deleteStoreProducts, getProducts,  saveStoreProducts } from "helpers/api/products";
import {  getAllStores } from "helpers";
import Table from "components/Table";
import Search from "components/Search";
import EditCell from "components/EditCell";
import { access } from "fs";
import DeleteConfirm from "components/Inplace Confirm/DeleteConfirm";
import Editlist from "components/Editlist";

//Default values
const defaultValues: {
  Id: number;
  name: string;
  size: string;
  detail: string;
  flair: string;
  price: number | string;
  catId: number | string;
  password: string;
  ProfilePicId: number;
  FullFileUrl: string;
  gender: string;
  storeId:number;
  costPrice:number;
  salePrice:number;
  currentStock:number;
} = {
  Id: 0,
  name: "",
  size: "",
  detail: "",
  flair: "",
  password: "",
  FullFileUrl: "",
  ProfilePicId: 0,
  catId: 0,
  storeId:0,
  price: 0,
  salePrice:0,
  costPrice:0,
  currentStock:0,
  gender: "Male",
};


const ProductsDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoadoing]: any = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [myData, setMyData] = useState<any>({});
  const [stores, setStores] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [apiStatus] = useState({
    inprogress: false,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    Id: number;
    name: string;
    detail: string;
    flair: string;
    price: number | string;
    catId: number | string;
    password: string;
    size: string;
    storeId:number;
    costPrice:number;
    salePrice:number;
    currentStock:number;
    ProfilePicId: number;
    FullFileUrl: string;
    gender: string;
  }>({
    defaultValues: {
      ...defaultValues,
    },
    mode: "onBlur",
  });
  const showError = (_fieldName: string): any => {
    const keyList: Array<string> = _fieldName.split(".");
    const [key1, key2] = keyList;
    let error;
    if (key1 && key2) {
      const errorObj = (errors as any)[key1];
      error = errorObj ? errorObj[key2] : null;
    } else if (key1) {
      error = (errors as any)[key1];
    }
    return error ? error.message || "Field is required" : null;
  };

  let location = useLocation();
  let path = location.pathname;
  let arr = path.split("/");
  let id = parseInt(arr[arr.length - 1]);

  const onSubmit = async (data:any) => {
    try {
      const response = await saveStoreProducts({
        productId:id,
        storeId: data.storeId,
        salePrice: data.salePrice,
        costPrice: data.costPrice,
        currentStock: data.currentStock,
      });

      if (response.statusCode === 200) {
        showToast("success", response.message);
        handleCloseModal();
        GetProductDetails();
      } else {
        showToast("error", response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetProductDetails = async () => {
    setLoadoing(true);
    try {
      const response = await getProducts({ id });
      reset({
        Id: response.data.id,
        name: response.data.name,
        size: response.data.size,
        detail: response.data.detail,
        ProfilePicId: response.data.ProfilePicId,
        FullFileUrl: response.data.FullFileUrl,
        price: response.data.price,
        password: response.data.password,
        storeId: response.data.storeId,
        catId: response.data.catId,
        costPrice: response.data.costPrice,
        salePrice: response.data.salePrice,
        currentStock: response.data.currentStock,
        gender: response.data.gender,
      });
      setMyData(response.data);
      setProductData(response.data.storeProducts);
      setLoadoing(false);
    } catch (error) {
      setLoadoing(false);
      console.log(error, "error");
    }
  };

  
  const deleteData = async (storeId:any) => {
    try {
      const response = await deleteStoreProducts({
        storeId,
        productId: id,
      });
      if (response.statusCode === 200) {
        showToast("success", response.message);
        GetProductDetails(); 
      } else {
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Store Name",
      accessor: "storeName",
    },
    {
      Header: "UPC code",
      accessor: "barcode",
    },
    {
      Header: "Quantity",
      accessor: "currentStock",
      Cell: ({value, row, column}:any) => {
        return <Editlist value={value} row={row} column={column} refreshTableData={()=>{ GetProductDetails() }} />
      },
    },
    {
      Header: "Price",
      accessor: (row:any) => `${parseFloat(row.salePrice).toFixed(2)}`, 
      Cell: ({value, row, column}:any) => {
        return <Editlist value={value} row={row} column={column} refreshTableData={()=>{ GetProductDetails() }} />
      },    },
    {
      Header: "Cost",
      accessor: (row:any) => `${parseFloat(row.costPrice).toFixed(2)}`, 
      Cell: ({value, row, column}:any) => {
        return <Editlist value={value} row={row} column={column} refreshTableData={()=>{ GetProductDetails() }} />
      },
    },
    {
      Header: "Action",
      accessor: (row: any) => {
        return (
          <DeleteConfirm
          disabled={false}
          confirm={() => {
            deleteData(row.storeId);
            
          }}
        />
        );
      },
    },
  ];
  
  const {
    list: usersList,
    isFetching,
    pagination,
  } = useApi(
    "GetAllUsers",
    (data: any) =>
    getAllStores({
        pageNumber: 1,
        pageSize: 10,
      
        ...data,
      }),
    {
      enabled: true,
      onSuccess: (response) => {
        return response;
      },
      onError: (error: Error) => {
        console.error(error);
        showToast("error", error.message);
      },
    }
  );
  
  const fetchStores = async () => {
    try {
      const response = await getAllStores({
        pageNumber: 1,
        pageSize: 500,
      });
      if (response.statusCode === 200) {
        setStores(
          response.data.items.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const resetForm = () => {
    reset(defaultValues);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    resetForm(); 
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (Number(params.id)) {
      GetProductDetails();
    }
    }, []);

  useEffect(()=>{
    fetchStores();
  },[])

  return (
    <>
      <PageTitleBox
        name="Products Detail"
        pageTitle="Product Detail"
      />
      <form name="chat-form" id="chat-form" >
        <Card className="shadow-none">
          <Card.Body>
          <div className="text-end">
            <i className="uil uil-edit cursor-pointer" style={{color:"#0C94EA"}} onClick={() => navigate(`/products/edit/${id}`)}></i>
              </div>
            {loading && <Loader />}
            {myData && Object.keys(myData).length > 0 && (
            <Row>
              <Col xl={12}>
                <Row>
                <Col xl={3}>
                    <div className="mb-3">
                      <label
                        htmlFor="name"
                        className="form-label fw-bold">
                        Product Name
                      </label>
                      <div>{myData.name}</div>
                    </div>
                  </Col>
                  <Col xl={2}>
                    <div className="mb-3">
                      <label
                        htmlFor="categoryName"
                        className="form-label fw-bold">
                        Category
                      </label>
                      <div>{myData.categoryName}</div>
                    </div>
                  </Col>
                 
                
                  <Col xl={5}>
                    <div className="mb-3">
                      <label
                        htmlFor="detail"
                        className="form-label fw-bold">
                        Description
                      </label>
                      <div>{myData.detail}</div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            )}
          </Card.Body>
        </Card>
        <PageTitleBox
        name=""
        pageTitle="Stores"
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
            <Search pagination={pagination} />
              <Link style={{ position: "relative", right: "0px",color:"white" }} to="">
                <Button variant="" className="btn ms-4 save-btn" onClick={handleOpenModal}>
                  <i className="uil uil-plus"></i> Add
                </Button>
              </Link>
            </Col>
          </Row>
        }      />
       <Card className="shadow-none">
          <Card.Body>
            <Table
              isFetching={loading}
              columns={columns}
              data={productData}
              sizePerPageList={[]}
              isSortable={true}
              pagination={true}
              {...pagination}
            />
          </Card.Body>
        </Card>
      
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>

          <Row>
            <Col xl={12}>
              <Row>
              <Col xl={6}>
                    <SelectCtrl
                      control={control}
                      name="storeId"
                      id="storeId"
                      placeholder="Select Store Name "
                      label="Store Name"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={stores}
                    />
                  </Col> 
                  <Col xl={6}>
              <InputCtrl
                      control={control}
                      type="number"
                      name="currentStock"
                      id="currentStock"
                      placeholder="Enter quantity"
                      label="Quantity"
                      showError={showError}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={6}>
              <InputCtrl
                      control={control}
                      type="number"
                      name="salePrice"
                      id="salePrice"
                      placeholder="Enter Price"
                      label="Price"
                      showError={showError}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      startAdornment={"$"}
                    />
                  </Col>
                  <Col xl={6}>
              <InputCtrl
                      control={control}
                      type="number"
                      name="costPrice"
                      id="costPrice"
                      placeholder="Enter cost"
                      label="Cost"
                      showError={showError}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      startAdornment={"$"}
                    />
                  </Col>
              </Row>
            </Col>
          </Row>
          <div className="d-flex justify-content-between align-items-baseline mt-3">
          <div className="button-list">
            <Button
              type="submit"
              disabled={apiStatus.inprogress}
              className="px-4 save-btn"
            >
              Save
            </Button>
          </div>
        
        </div>
        </form>

        </Modal.Body>
      </Modal>
      </form>
    </>
  );
};

export default ProductsDetails;
