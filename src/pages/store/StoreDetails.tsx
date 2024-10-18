import { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row,  Form, Badge } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {   getStores,  saveStores } from "../../helpers";
import { useApi, useToast } from "../../hooks";
import Loader from "../../components/Loader";
import Table from "components/Table";
import { getAllProducts } from "helpers/api/products";
import Search from "components/Search";
import EditableCell from "components/EditableCell";
import EditCell from "components/EditCell";

//Default values
const defaultValues: {
  Id: number;
  name: string;
  address: string;
  countryId: number | string;
  stateId: number | string;
  cityId: number | string;
  
} = {
  Id: 0,
  name: "",
  address: "",
  cityId: 0,
  stateId: 0,
  countryId: 0,
};

const StoreDetails = () => {
  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Category",
      accessor: "categoryName",
    },
    {
      Header: "UPC code",
      accessor: "barcode",
    },
    {
      Header: "Quantity",
      accessor: "currentStock",
      Cell: ({value, row, column}:any) => {
        return <EditCell value={value} row={row} column={column} refreshTableData={()=>{ fetchProducts({...pagination}) }} />
      },
    },
    {
      Header: "Cost",
      accessor: (row:any) => `${parseFloat(row.costPrice).toFixed(2)}`, 
      Cell: ({value, row, column}:any) => {
        return <EditCell value={value} row={row} column={column} refreshTableData={()=>{ fetchProducts({...pagination}) }} />
      }
  
    },
    {
      Header: "Price",
      accessor: (row:any) => `${parseFloat(row.salePrice).toFixed(2)}`, 
      Cell: ({value, row, column}:any) => {
        return <EditCell value={value} row={row} column={column} refreshTableData={()=>{ fetchProducts({...pagination}) }} />
      },  
    },
    
    {
      Header: "Featured",
      accessor: (row:any) => `${row.isFeatured}`,
      Cell: EditableCell,
    
    },
    {
      Header: "Status",
      accessor: (row: any) => {
        return (
          <Badge
            bg={row.isActive ? "success" : "danger"}
            className=' text-capitalize text-light rounded-pill px-2 fs-12  '
          >
            {row.isActive ? "Active" : "InActive"}
          </Badge>
        );
      },
    },
    
   
    
  ];
  const navigate = useNavigate();
  const params = useParams();
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoadoing]: any = useState(false);
  const [myData, setMyData] = useState<any>({})
  const [data, setData] = useState<any[]>([]);;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<{
    Id: number;
    name: string;
    address: string ;
    countryId: number | string;
    stateId: number | string;
    cityId: number | string;
  }>({
    defaultValues: {
      ...defaultValues,
    },
    mode: "onBlur",
  });

  let location = useLocation();
  let path = location.pathname;
  let arr = path.split("/");
  let id = parseInt(arr[arr.length - 1]);

  const onSubmit: SubmitHandler<{
    Id: number;
    name: string;
    address: string;
    countryId: number | string;
    stateId: number | string;
    cityId: number | string;
  }> = async (data) => {
    // saveUserData
    try {
      console.log("Data>>", data);
      const response = await saveStores({
        Id: data.Id,
        name: data.name,
        address: data.address,
        stateId: data.stateId,
        countryId: data.countryId,
        cityId: data.cityId,
        
      });
      navigate(-1);

      if (response.statusCode === 200) {
        showToast("success", response.message);
      } else {
        console.log(response.error);
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetDetails = async () => {
    setLoadoing(true);
    try {
      const response = await getStores({ id });
      reset({
        Id: response.data.id,
        name: response.data.name,
        address: response.data.address,
        countryId: response.data.countryId,
        stateId: response.data.stateId,
        cityId: response.data.cityId,
      });
      setLoadoing(false);
      setMyData(response.data)
    } catch (error) {
      setLoadoing(false);
     
      console.log(error, "error");
    }
  };

  const updateData = (rowIndex :any, columnId :any, value :any) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };


useEffect(() => {
  if (Number(params.id)) {
    GetDetails();
  }
}, []); 


  const {
    list: products,
    isFetching,
    pagination,
    reCall:fetchProducts,
  } = useApi(
    "GetAllProduct",
    (data: any) =>
      getAllProducts({
        pageNumber: 1,
        pageSize: 10,
        storeId:id,
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
  useEffect(() => {
    if (products) {
      setData(products);
    }
  }, [products]);
 

  return (
    <>
      <PageTitleBox
        name="Store Detail"
        pageTitle="  Store Detail "
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none">
          <Card.Body>
<div className="text-end">
<i className="uil uil-edit cursor-pointer" style={{color:"#C43433"}} onClick={() => navigate(`/store/edit/${id}`)}></i>

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
                        Name
                      </label>
                      <div>{myData.name}</div>
                    </div>
                  </Col>
                  <Col xl={3}>
                    <div className="mb-3">
                      <label
                        htmlFor="address"
                        className="form-label fw-bold">
                        Address
                      </label>
                      <div>{myData.address}</div>
                    </div>
                  </Col>
                 
                   
                  <Col xl={3}>
                    <div className="mb-3">
                      <label
                        htmlFor="email"
                        className="form-label fw-bold">
                        Email
                      </label>
                      <div>{myData.email}</div>
                    </div>
                  </Col>
                  <Col xl={3}>
                    <div className="mb-3">
                      <label
                        htmlFor="phoneNumber"
                        className="form-label fw-bold">
                        Phone Number
                      </label>
                      <div>{myData.phoneNumber}</div>
                    </div>
                  </Col>
                  <Col xl={6}>
                    <div className="mb-3">
                      <label
                        htmlFor="posapikey"
                        className="form-label fw-bold">
                       POS Key
                      </label>
                      <div>{myData.posApiKey}</div>
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
        pageTitle="Products"
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
              <Search pagination={pagination} />
            </Col>
          </Row>
        }
      />
        <Card className="shadow-none">
        <Card.Body>
          <Table
             isFetching={isFetching}
            columns={columns}
            data={products}
            sizePerPageList={[]}
            isSortable={true}
            pagination={true}
            {...pagination}
            updateData={updateData}
          />
        </Card.Body>
      </Card>
      
      </form>
    </>
  );
};

export default StoreDetails;
