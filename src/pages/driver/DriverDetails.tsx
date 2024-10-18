import React, { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button } from "react-bootstrap";
import { InputCtrl, SelectCtrl } from "../../controllers";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteUser, getAllRoles, getAllStores, getUser, saveUser } from "../../helpers";
import DeleteConfirm from "../../components/Inplace Confirm/DeleteConfirm";
import { useApi, useToast } from "../../hooks";
import Loader from "../../components/Loader";
import AsyncMultiSelectCtrlV1 from "controllers/AsyncMultiSelectCtrlV1";
import { deleteUserStore, saveUserStore } from "helpers/api/store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, formatISO } from "date-fns";
import _ from "lodash";
import { deleteFile, getFile } from "helpers/api/file";
import FileUpload from "pages/forms/FileUpload";

//Default values
const defaultValues: {
  Id: number;
  firstName: string;
  lastName: string;
  Email: string;
  address: string;
  flair: string;
  roleId: number | string;
  statusId: number | string;
  password: string;
  dob: string;
  frontLicenseFileId: number;
  backLicenseFileId: number;
  storeId: number | string;
  phoneNumber: number | string;
  gender: string;
} = {
  Id: 0,
  firstName: "",
  lastName: "",
  Email: "",
  address: "",
  flair: "",
  dob: "",
  password: "",
  statusId: 1,
  roleId: 4,
  storeId: 0,
  frontLicenseFileId: 0,
  backLicenseFileId:0,
  phoneNumber: "",
  gender: "Male",
};

const DriverDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [roles, setRoles] = useState<any[]>([]);
  const { showToast, dissmisToast } = useToast();
  const [myData, setMyData] = useState<any>({});
  const [loading, setLoadoing]: any = useState(false);
  const [uploadedFrontFile, setUploadedFrontFile]: any = useState({});
  const [isFrontUploaded, setIsFrontUploaded] = useState(false);
  const [frontImageUrl, setFrontImageUrl]: any = useState('');
  const [uploadedBackFile, setUploadedBackFile]: any = useState({});
  const [isBackUploaded, setIsBackUploaded] = useState(false);
  const [BackImageUrl, setBackImageUrl]: any = useState('')

  const [defaultData, setDefaultData] = useState<any>({
    stores: [],
  });
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
    firstName: string;
    Email: string;
    flair: string;
    frontLicenseFileId: number;
    backLicenseFileId: number;
    roleId: number | string;
    statusId: number | string;
    storeId: number | string;
    password: string;
    lastName: string;
    dob: string;
    address: string;
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
    dob: string;
    address: string;
    password: string;
    frontLicenseFileId: number;
    backLicenseFileId: number;
    roleId: number | string;
    statusId: number | string;
    phoneNumber: number | string;
    storeId: number | string;
    gender: string;
  }> = async (data) => {


    // saveUserData
    try {
      const formattedDob = formatISO(new Date(data.dob));
      const response = await saveUser({
        Id: data.Id,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        dob: formattedDob,
        Email: data.Email,
        password: data.password,
        roleId: data.roleId,
        statusId: data.statusId,
        storeId: data.storeId,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        frontLicenseFileId:uploadedFrontFile?.id,
        backLicenseFileId: uploadedBackFile?.id,
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

      reset({
        Id: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        dob: response.data.dob?.split('T')[0],
        address: response.data.address,
        Email: response.data.email,
        roleId: response.data.roleId,
        storeId: response.data.storeId,
        password: response.data.password,
        phoneNumber: response.data.phoneNumber,
        statusId: response?.data?.isActive ? 1 : 2,
        gender: response?.data?.gender,
        frontLicenseFileId:response.data.frontLicenseFileId,
        backLicenseFileId:response.data.backLicenseFileId
      });
      setMyData(response.data)
      setLoadoing(false);
      if(response?.data?.frontLicenseFileId){
        const logoId:any = response?.data?.frontLicenseFileId
        const imageResponse = await getFile({id:logoId})

        if(imageResponse && imageResponse?.data && imageResponse?.data?.id!==0){
          setFrontImageUrl(imageResponse?.data?.fullFileUrl)
          setIsFrontUploaded(true)
          setUploadedFrontFile(imageResponse?.data)
        }
        else{
          setFrontImageUrl("")
          setIsFrontUploaded(false)
          setUploadedFrontFile({})
        }

      }
      if(response?.data?.backLicenseFileId){
        const logoId:any = response?.data?.backLicenseFileId
        const imageResponse = await getFile({id:logoId})

        if(imageResponse && imageResponse?.data && imageResponse?.data?.id!==0){
          setBackImageUrl(imageResponse?.data?.fullFileUrl)
          setIsBackUploaded(true)
          setUploadedBackFile(imageResponse?.data)
        }
        else{
          setBackImageUrl("")
          setIsBackUploaded(false)
          setUploadedBackFile({})
        }

      }
      getStores({ storeIds: '' })
    } catch (error) {
      setLoadoing(false);
      console.log(error, "error");
    }
  };

  async function deleteData() {
    let response = await deleteUser(id);
    try {
      if (response.statusCode === 200) {
        console.log(response.message);
        showToast("success", response.message);
        navigate(-1);
      } else {
        console.log(response.message);
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(response.error);
    }
  }


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

  useEffect(() => {
    if (Number(params.id)) {
      GetDetails();
    }
    fetchRoles();
  }, []);




  const {
    reCall: getStores,
  } = useApi(
    "getAllStores",
    (data: any) =>
      getAllStores({
        pageNumber: 1,
        pageSize: 10,
        userId: id,
        ...data,
      }),
    {
      enabled: true,
      onSuccess: (response) => {
        if (response.statusCode === 200) {

          setDefaultData((prev: any) => {
            return {
              ...prev,
              stores: response.data.items.map((a: any) => ({
                label: a.name,
                value: a.id,
              })),
            };
          });
        }
        return response;
      },
      onError: (error: Error) => {
        console.error(error);
        showToast("error", error.message);
      },
    }
  );

  const saveDriverStoreData = async (selectedOptions: any) => {
    try {
      let userId = id;
      let storeId = 0;

      if (!selectedOptions) {
        selectedOptions = [];
      }

      const customEquality = (obj1: any, obj2: any) =>
        obj1.value === obj2.value;

      let difference: any[] = [];

      if (selectedOptions.length < defaultData.stores.length) {
        difference = _.differenceWith(
          defaultData.stores,
          selectedOptions,
          customEquality
        );
      }

      if (selectedOptions.length > defaultData.stores.length) {
        difference = _.differenceWith(
          selectedOptions,
          defaultData.stores,
          customEquality
        );
      }

      if (difference && difference.length > 0) {
        storeId = difference[0].value;
      }

      if (storeId) {
        const isDeletion = defaultData.stores.length > selectedOptions.length;
        if (isDeletion) {
          const response = await deleteUserStore(
            {
              id: 0,
              storeId,
              userId,
            }
          );
          if (response.statusCode === 200) {
            showToast("success", response.message);
            setDefaultData((prev: any) => ({
              ...prev,
              stores: selectedOptions,
            }));
          } else {
            showToast("error", response.message);
          }
        } else {
          const response = await saveUserStore({
            userId,
            storeId,
          });
          if (response.statusCode === 200) {
            setDefaultData((prev: any) => ({
              ...prev,
              stores: selectedOptions,
            }));
          }
        }
      } else {
        console.log("unknown case");
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const handleFrontLicensePicture = (data: any) => {
    setUploadedFrontFile(data)
    setIsFrontUploaded(true)
    setFrontImageUrl(data?.fullFileUrl)
  }
  const handleBackLicensePicture = (data: any) => {
    setUploadedBackFile(data)
    setIsBackUploaded(true)
    setBackImageUrl(data?.fullFileUrl)
  }


  const deleteFrontImage = async () => {
    const imageFrontId = uploadedFrontFile?.id;
    const res = await deleteFile(imageFrontId)
    setIsFrontUploaded(false);
    setFrontImageUrl('');
    setUploadedFrontFile({})
  }

  const deleteBackImage = async () => {
    const imageBackId = uploadedBackFile?.id;
    const res = await deleteFile(imageBackId)
    setIsBackUploaded(false);
    setBackImageUrl('');
    setUploadedBackFile({})
  }



  const statusData: any[] = [
    {
      label: "Active",
      value: 1,
    },
    {
      label: "In-Active",
      value: 2,
    },
  ];

  return (
    <>
      <PageTitleBox
        name="Driver
         Detail"
        pageTitle="Driver Details"
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none">
          <Card.Body>
            {loading && <Loader />}
            <Row>
              <Col xl={12}>
                <Row>
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Enter first name"
                      label="First Name"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Enter last name"
                      label="Last Name"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="email"
                      name="Email"
                      id="Email"
                      placeholder="Enter email"
                      label="Email"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      componentName="Email"
                    />
                  </Col>
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Enter address"
                      label="Address"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter password"
                      label="Password"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>

             
                  {id ? (
                    <Col xl={6}>
                      <SelectCtrl
                        control={control}
                        name="statusId"
                        id="statusId"
                        placeholder="Please Select Status"
                        label="Status"
                        required={true}
                        disabled={apiStatus.inprogress}
                        className="mb-3"
                        options={statusData}
                        showError={showError}
                      />
                    </Col>
                  ) : null}
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="number"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Enter phone Number"
                      label="Phone Number"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      minLength={10}
                      maxLength={13}
                    />
                  </Col>
                  <Col xl={6}>
                    <label className="mb-2">Dob  <span style={{ color: 'red' }}>*</span></label>
                    <Controller
                      control={control}
                      name="dob"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date ? format(date, "MM/dd/yyyy") : "")}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Enter dob"
                          className="form-control"
                        />
                      )}
                    />


                    <span className="text-danger">{showError("dob")}</span>
                  </Col>
                  <Col xl={6}>
                  {id ? (
                    <AsyncMultiSelectCtrlV1
                      control={control}
                      name='stores'
                      id='stores'
                      placeholder='Select Store'
                      label='Store'
                      showError={''}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className='mb-3'
                      promiseMethod={getAllStores}
                      labelKey='name'
                      valueKey='id'
                      defaultValue={defaultData.stores}
                      options={[]}
                      onSelect={(selectedOptions: any) => {
                        saveDriverStoreData(selectedOptions);
                      }}
                    />

                  ) : null}</Col>
                  <Row className="mt-2">
                    <Col xl={6}>
                      <label className="mb-4">
                        Upload Front License Picture 
                      </label>
                      {isFrontUploaded ? <div className="d-flex justify-content-center"><img className="uploaded-image" src={frontImageUrl} />

                        <div className="remove-button">
                          <DeleteConfirm
                            isHide={!isFrontUploaded}
                            disabled={apiStatus.inprogress}
                            confirm={() => {
                              deleteFrontImage();
                            }}
                            message='Are You Sure, You Want To Delete?'
                          />
                        </div>


                      </div> : <FileUpload handleCallBack={handleFrontLicensePicture} />}
                    </Col>
                    <Col xl={6}>
                      <label className="mb-4">
                        Upload  Back License Picture 
                      </label>
                      {isBackUploaded ? <div className="d-flex justify-content-center"><img className="uploaded-image" src={BackImageUrl} />

                        <div className="remove-button">
                          <DeleteConfirm
                            isHide={!isBackUploaded}
                            disabled={apiStatus.inprogress}
                            confirm={() => {
                              deleteBackImage();
                            }}
                            message='Are You Sure, You Want To Delete?'
                          />
                        </div>


                      </div> : <FileUpload handleCallBack={handleBackLicensePicture} />}
                    </Col>
                  </Row>

                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <div className="d-flex justify-content-between align-items-baseline">
          <div className="button-list">
            <Button
              type="submit"
              disabled={apiStatus.inprogress}
              className="px-4 save-btn"
            >
              Save
            </Button>
            <Button
              className="px-4 cancel-btn"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <DeleteConfirm
              isHide={!Number(params.id)}
              disabled={apiStatus.inprogress}
              confirm={() => {
                deleteData();
              }}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default DriverDetails;
