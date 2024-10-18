import React, { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllOrder, getAllRoles, getUser, saveUser } from "../../helpers";
import { useApi, useToast } from "../../hooks";
import Loader from "../../components/Loader";
import Table from "components/Table";
import { FormatDate } from "common/utility";
import { getFile } from "helpers/api/file";
import { blockUser } from "helpers/api/user";

//Default values
const defaultValues: {
  Id: number;
  firstName: string;
  lastName: string;
  Email: string;
  flair: string;
  roleId: number | string;
  statusId: number | string;
  password: string;
  ProfilePicId: number;
  FullFileUrl: string;
  phoneNumber: number | string;
  gender: string;
  isActive: boolean;

} = {
  Id: 0,
  firstName: "",
  lastName: "",
  Email: "",
  flair: "",
  password: "",
  FullFileUrl: "",
  ProfilePicId: 0,
  statusId: 1,
  roleId: 2,
  phoneNumber: "",
  gender: "Male",
  isActive: true,
};


const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: " Product Name",
    accessor: "productName",
  },
  {
    Header: "Order Value",
    accessor: "quantity",
  },
  {
    Header: "Order Date",
    accessor: (row: any) => {
      return FormatDate(row.placedOn, "lll");
    },
  },
  {
    Header: "Order Status",
    accessor: "status"
  },
];

const UserDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [roles, setRoles] = useState<any[]>([]);
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoadoing]: any = useState(false);
  const [myData, setMyData] = useState<any>({});
  const [frontImageUrls, setFrontImageUrls] = useState("");
  const [backImageUrls, setBackImageUrls] = useState("");
  const [isActives, setIsActives] = useState(false);
  const [apiStatus] = useState({
    inprogress: false,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<{
    Id: number;
    firstName: string;
    Email: string;
    flair: string;
    roleId: number | string;
    statusId: number | string;
    password: string;
    lastName: string;
    isActive: boolean;
    ProfilePicId: number;
    FullFileUrl: string;
    phoneNumber: number | string;
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

  const onSubmit: SubmitHandler<{
    Id: number;
    firstName: string;
    Email: string;
    lastName: string;
    password: string;
    isActive: boolean;
    roleId: number | string;
    statusId: number | string;
    phoneNumber: number | string;
    ProfilePicId: number;
    FullFileUrl: string;
    gender: string;
  }> = async (data) => {
    // saveUserData
    try {
      const response = await saveUser({
        Id: data.Id,
        firstName: data.firstName,
        lastName: data.lastName,
        Email: data.Email,
        password: data.password,
        roleId: data.roleId,
        isActive: isActives,
        statusId: data.statusId,
        phoneNumber: data.phoneNumber,
        FullFileUrl: data.FullFileUrl,
        ProfilePicId: data.ProfilePicId,
        gender: data.gender,
      });

      if (response.statusCode === 200) {
        showToast("success", response.message);
        navigate(-1);
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
      const response = await getUser({ id });
      // Use reset method to update the form values
      reset({
        Id: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        Email: response.data.email,
        ProfilePicId: response.data.ProfilePicId,
        FullFileUrl: response.data.FullFileUrl,
        roleId: response.data.roleId,
        password: response.data.password,
        phoneNumber: response.data.phoneNumber,
        statusId: response?.data?.isActive ? 1 : 2,
        gender: response?.data?.gender,
        isActive: response.data.isActive,

      });
      setLoadoing(false);
      setIsActives(response.data.isActive)
      setMyData(response.data)
      setFrontImageUrls(response.data.fullFrontLicenseFileUrl);
      setBackImageUrls(response.data.fullBackLicenseFileUrl);
    } catch (error) {
      setLoadoing(false);
      console.log(error, "error");
    }
  };



  const fetchRoles = async () => {
    try {
      const response = await getAllRoles({
        pageNumber: 1,
        pageSize: 100,
      });
      if (response.statusCode === 200) {

        setRoles(
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



  const {
    list: usersList,
    isFetching,
    pagination,
  } = useApi(
    "GetAllOrders",
    (data: any) =>
      getAllOrder({
        pageNumber: 1,
        pageSize: 10,
        customerId: id,
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



  const toggleSwitch = async () => {
    const newIsActive = !isActives;

    try {
      const response = await blockUser({ id, isActive: newIsActive });
      if (response.statusCode === 200) {
        showToast("success", response.message);
        setIsActives(newIsActive);
      } else {
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Failed to update user status");
    }
  };




  useEffect(() => {
    if (Number(params.id)) {
      GetDetails();
    }
    fetchRoles();
  }, []);

  return (
    <>
      <PageTitleBox
        name="Customer Detail"
        pageTitle="Customer Details"
      // breadCrumbItems={breadCrumbItems}
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none">
          <Card.Body>
            {loading && <Loader />}
            {myData && Object.keys(myData).length > 0 && (
              <Row>
                <Col xl={12}>
                  <Row>
                    <Col xl={3}>
                      <div className="mb-3">
                        <label
                          htmlFor="fullName"
                          className="form-label fw-bold">
                          Name
                        </label>
                        <div>{myData.fullName}</div>
                      </div>
                    </Col>
                    <Col xl={3}>
                      <div className="mb-3">
                        <label
                          htmlFor="age"
                          className="form-label fw-bold">
                          DOB
                        </label>
                        <div>{FormatDate(myData.dob, "ll")}</div>
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
                          htmlFor="storeName"
                          className="form-label fw-bold">
                          Assigned Store
                        </label>
                        <div>{myData.storeName}</div>
                      </div>
                    </Col>
                    <Col xl={3}>
                      <label>{isActives ? "Unblock User" : "Block User"}</label>
                      <Form.Check
                        type="switch"
                        id="isActive"
                        checked={!isActives}
                        onChange={toggleSwitch}
                        name="isActive"
                        className="mb-2"
                      />
                    </Col>
                  </Row>


                </Col>
              </Row>
            )}


          </Card.Body>
        </Card>
        <h4>Order Details</h4>
        <Card className="shadow-none">
          <Card.Body>
            <Table
              isFetching={isFetching}
              columns={columns}
              data={usersList}
              sizePerPageList={[]}
              isSortable={true}
              pagination={true}
              {...pagination}
            // onRowClick={(row) => {
            //   navigate("" + row.original.id);
            // }}
            />
          </Card.Body>
        </Card>
        <h4>Customer's Driving License Images</h4>

        {frontImageUrls && backImageUrls && frontImageUrls.length > 0 && backImageUrls.length > 0 && (
          <div className="mt-4">
            <div className="d-flex flex-row align-items-center">
              <img
                src={frontImageUrls}
                alt="Front of License"
                className="image mb-2"
                style={{ height: "100px", maxWidth: "150px", marginRight: "20px" }}
              />
              <img
                src={backImageUrls}
                alt="Back of License"
                className="image mb-2"
                style={{ height: "100px", maxWidth: "150px", marginRight: "20px" }}
              />
            </div>
          </div>
        )}



      </form>
    </>
  );
};

export default UserDetails;
