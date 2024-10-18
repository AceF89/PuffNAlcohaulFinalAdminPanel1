import React, { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button, Table } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { saveUser } from "../../helpers";
import { useToast } from "../../hooks";
import Loader from "../../components/Loader";
import { FormatDate } from "common/utility";
import { getOrder } from "helpers/api/order";

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
};



const OrderDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoadoing]: any = useState(false);
  const [myData, setMyData] = useState<any>({});
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [proofImage, setProofImage] = useState("");
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
      const response = await getOrder({ id });
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
      });
      setLoadoing(false);
      setMyData(response.data)
      setFrontImage(response.data.fullFrontLicenseFileUrl)
      setBackImage(response.data.fullBackLicenseFileUrl)
      setProofImage(response.data.doorImageFullUrl)

    } catch (error) {
      setLoadoing(false);
      console.log(error, "error");
    }
  };



  useEffect(() => {
    if (Number(params.id)) {
      GetDetails();
    }
  }, []);

  return (
    <>
      <PageTitleBox
        name="Order Detail"
        pageTitle="Order Details"
      // breadCrumbItems={breadCrumbItems}
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={6}>
            <Card className="shadow-none  ">
              <Card.Body >
                {loading && <Loader />}
                {myData && Object.keys(myData).length > 0 && (
                  <Row>
                    <Col xl={12}>
                      <h4 className="mb-4 mycolour">General Details</h4>
                      <Row>
                        <Col xl={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="placedOn"
                              className="form-label fw-bold">
                              Reference Id
                            </label>
                            <div>{myData.refNo}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="placedOn"
                              className="form-label fw-bold">
                              Order Date
                            </label>
                            <div>{FormatDate(myData.placedOn, "lll")}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="status"
                              className="form-label fw-bold">
                              Order Status
                            </label>
                            <div>{myData.status}</div>
                          </div>
                        </Col>

                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="categoryName"
                              className="form-label fw-bold">
                              Product Category Name
                            </label>
                            <div>{myData.categoryName}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="address"
                              className="form-label fw-bold">
                              Delivery Address
                            </label>
                            <div>{myData.address}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="placedByName"
                              className="form-label fw-bold">
                              Customer Name
                            </label>
                            <div>{myData.placedByName}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="placedByName"
                              className="form-label fw-bold">
                              Driver Name
                            </label>
                            <div>{myData.driverName}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="storeName"
                              className="form-label fw-bold">
                              Assigned Store
                            </label>
                            <div>{myData.storeName}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="scheduleType"
                              className="form-label fw-bold">
                              Delivery Status
                            </label>
                            <div>{myData.scheduleType}</div>
                          </div>
                        </Col>
                        {myData.status === "REJECTED" ? (
                          <Col xl={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="statusReason"
                                className="form-label fw-bold">
                                Rejection Reason
                              </label>
                              <div>{myData.statusReason}</div>
                            </div>
                          </Col>
                        ) : null}

                      </Row>

                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
            <Card className="shadow-none">
              <Card.Body >
                {loading && <Loader />}
                {myData && Object.keys(myData).length > 0 && (
                  <Row>
                    <Col xl={12}>
                      <Row>
                        <h4 className="mb-4 mycolour">Order Info</h4>
                        <Col xl={12}>
                          {myData.orderItems && myData.orderItems.length > 0 && (
                            <Table bordered >
                              <thead>
                                <tr>
                                  <th>Product Name</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {myData.orderItems.map((item: any, index: any) => (
                                  <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          )}
                        </Col>

                      </Row>
                    </Col>
                  </Row>
                )}

              </Card.Body>
            </Card>
          </Col>
          <Col xl={6}>
            <Card className="shadow-none  ">
              <Card.Body >
                {loading && <Loader />}
                {myData && Object.keys(myData).length > 0 && (
                  <Row>
                    <Col xl={12}>
                      <h4 className="mb-4 mycolour">Payment Info</h4>
                      <Row>
                        <Col xl={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="paymentMethod"
                              className="form-label fw-bold">
                              Payment Method
                            </label>
                            <div>{myData.paymentMethod}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="subTotal"
                              className="form-label fw-bold">
                              Product Cost
                            </label>
                            <div>${myData.subTotal}</div>
                          </div>
                        </Col>

                        <Col xl={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="deliveryFee"
                              className="form-label fw-bold">
                              Delivery Fee
                            </label>
                            <div>{myData.deliveryFee}</div>
                          </div>
                        </Col>
                        <Col xl={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="serviceFee"
                              className="form-label fw-bold">
                              Service Fee
                            </label>
                            <div>${myData.serviceFee}</div>
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <label
                              htmlFor="subTotal"
                              className="form-label fw-bold">
                              Sub Total
                            </label>
                            <div>${myData.subTotal}</div>
                          </div>
                        </Col>
                        <Col xl={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="tip"
                              className="form-label fw-bold">
                              Driver's Tip
                            </label>
                            <div>${myData.tip}</div>
                          </div>
                        </Col>
                        <Col xl={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="totalTax"
                              className="form-label fw-bold">
                              Tax
                            </label>
                            <div>${myData.totalTax}</div>
                          </div>
                        </Col>
                        <Col xl={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="total"
                              className="form-label fw-bold">
                              Total
                            </label>
                            <div>${myData.total}</div>
                          </div>
                        </Col>
                      </Row>

                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl={6}>
          </Col>
          <Col xl={6}>
            <h4>Customer's Driving License Images</h4>

            {frontImage && backImage && frontImage.length > 0 && backImage.length > 0 && (
              <div className="mt-4">
                <div className="d-flex flex-row align-items-center">
                  <img
                    src={frontImage}
                    alt="Front of License"
                    className="image mb-2"
                    style={{ height: "100px", maxWidth: "150px", marginRight: "20px" }}
                  />
                  <img
                    src={backImage}
                    alt="Back of License"
                    className="image mb-2"
                    style={{ height: "100px", maxWidth: "150px", marginRight: "20px" }}
                  />
                </div>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
          </Col>
          {myData.status === "DELIVERED" ? (
            <Col xl={6}>
              <h4 className="mt-4">Delivery Image</h4>

              {proofImage && proofImage.length > 0 && (
                <div className="mt-4">
                  <div className="d-flex flex-row align-items-center">
                    <img
                      src={proofImage}
                      alt="Proof Image"
                      className="image mb-2"
                      style={{ height: "100px", maxWidth: "150px", marginRight: "20px" }}
                    />
                  </div>
                </div>
              )}
            </Col>) : ""}
        </Row>



      </form>
    </>
  );
};

export default OrderDetails;
