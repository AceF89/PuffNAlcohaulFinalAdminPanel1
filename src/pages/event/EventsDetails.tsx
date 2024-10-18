import React, { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button } from "react-bootstrap";
import { InputCtrl, SelectCtrl } from "../../controllers";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteUser, getAllRoles, getUser, saveUser } from "../../helpers";
import DeleteConfirm from "../../components/Inplace Confirm/DeleteConfirm";
import { useToast } from "../../hooks";
import Loader from "../../components/Loader";
import { blockUser } from "../../helpers/api/user";
import TextareaCtrl from "components/TextArea/TextArea";
import FileUpload from "pages/forms/FileUpload";
import { deleteFile, getFile } from "helpers/api/file";

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

const EventDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [roles, setRoles] = useState<any[]>([]);
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoadoing]: any = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFile, setUploadedFile]: any = useState({});
  const [imageUrl, setImageUrl]: any = useState('');
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

  const changeStatus = async (e: any) => {
    let response = await blockUser({
      id: id,
      isActive: e.value == 1 ? true : false,
    });
    try {
      if (response.statusCode === 200) {
        console.log(response.message);
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(response.error);
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
      });
      if(response?.data?.iconFileId){
        const logoId:any = response?.data?.iconFileId
        const imageResponse = await getFile({id:logoId})

        if(imageResponse && imageResponse?.data && imageResponse?.data?.id!==0){
          setImageUrl(imageResponse?.data?.fullFileUrl)
          setIsUploaded(true)
          setUploadedFile(imageResponse?.data)
        }
        else{
          setImageUrl("")
          setIsUploaded(false)
          setUploadedFile({})
        }

      }
      setLoadoing(false);
      // showToast("success", response.message);
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

  // const breadCrumbItems = [
  //   // { label: "Dashboard", path: "/#/dashboard" },
  //   // { label: "Customers", path: "/#/customer" },
  //   {
  //     label: `${Number(params.id) ? "Edit" : "Add"} Customer`,
  //     path: `/#${path}`,
  //   },
  // ];

  

  const handleCallBack = (data: any) => {
    setUploadedFile(data)
    setIsUploaded(true)
    setImageUrl(data?.fullFileUrl)

  }

  const deleteImage = async()=>{
    const imageId = uploadedFile?.id;
    const res = await deleteFile(imageId)
    setIsUploaded(false);
    setImageUrl('');
    setUploadedFile({})
  }

  return (
    <>
      <PageTitleBox
        name="Event Detail"
        pageTitle="Event Details"
        // breadCrumbItems={breadCrumbItems}
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none">
          <Card.Body>
            {loading && <Loader />}
            <Row>
              <Col xl={12}>
                <Row>
                  <Col xl={7}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name=""
                      id=""
                      placeholder="Enter Event name"
                      label="Event Name"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      componentName="Name"
                    />
                  </Col>
                  <Col xl={9}>
                    <TextareaCtrl
                      control={control}
                      name=""
                      id=""
                      placeholder="Enter Event Description"
                      label="Description"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      rows={10}
                    />
                  </Col>
                 <Row>
                 <Col xl={4}>
                    <SelectCtrl
                      control={control}
                      name=""
                      id=""
                      placeholder="Please Select Country"
                      label="Country"
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={[]}
                      showError={showError}
                    />
                  </Col>
                  <Col xl={4}>
                    <SelectCtrl
                      control={control}
                      name=""
                      id=""
                      placeholder="Please Select State"
                      label="State"
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={[]}
                      showError={showError}
                    />
                  </Col>
                  <Col xl={4}>
                    <SelectCtrl
                      control={control}
                      name=""
                      id=""
                      placeholder="Please Select City"
                      label="City"
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={[]}
                      showError={showError}
                    />
                  </Col>
                 </Row>
                <Row>
                <Col xl={4}>
                    <InputCtrl
                      control={control}
                      type="date"
                      name=""
                      id=""
                      placeholder=""
                      label="Event Date"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={4}>
                    <InputCtrl
                      control={control}
                      type="time"
                      name=""
                      id=""
                      placeholder=""
                      label="Start Time"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  <Col xl={4}>
                    <InputCtrl
                      control={control}
                      type="time"
                      name=""
                      id=""
                      placeholder=""
                      label="End Time"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                </Row>
                </Row>
                <Col xl={6}>
                {isUploaded ? <div className="d-flex justify-content-center"><img className="uploaded-image" src={imageUrl} />

                  <div className="remove-button">
                  <DeleteConfirm
              isHide={!isUploaded}
              disabled={apiStatus.inprogress}
              confirm={() => {
                deleteImage();
              }}
              message='Are You Sure, You Want To Delete The Logo?'
            />
                  </div>


                </div> : <FileUpload handleCallBack={handleCallBack} />}

              </Col>
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

export default EventDetails;
