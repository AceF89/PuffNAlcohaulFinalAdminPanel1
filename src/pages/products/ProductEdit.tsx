import React, { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { InputCtrl, SelectCtrl } from "../../controllers";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteConfirm from "../../components/Inplace Confirm/DeleteConfirm";
import { useToast } from "../../hooks";
import Loader from "../../components/Loader";
import TextareaCtrl from "controllers/TextareaCtrl";
import { deleteProducts, getProducts, saveProducts } from "helpers/api/products";
import { getAllCategories, getAllStores } from "helpers";
import FileUpload from "pages/forms/FileUpload";
import { deleteFile, getFile } from "helpers/api/file";

//Default values
const defaultValues: {
  Id: number;
  name: string;
  size: string;
  detail: string;
  flair: string;
  isActive:boolean;
  barcode:number | string;
  price: number | string;
  catId: number | string;
  password: string;
  mediaFileIds: string| number;
  FullFileUrl: string;
  storeId: number | string;
  gender: string;
} = {
  Id: 0,
  name: "",
  size: "",
  detail: "",
  flair: "",
  password: "",
  FullFileUrl: "",
  mediaFileIds: "",
  catId: 0,
  isActive:true,
  barcode:"",
  storeId:0,
  price: 0,
  gender: "Male",
};

const ProductEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [category, setCategory] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const { showToast, dissmisToast } = useToast();
  const [isActives, setIsActives] = useState(true);
  const [loading, setLoadoing]: any = useState(false);
  const [uploadedFile, setUploadedFile]: any = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
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
    name: string;
    detail: string;
    flair: string;
    barcode:number | string;
    isActive:boolean;
    price: number | string;
    catId: number | string;
    storeId:number | string;
    password: string;
    size: string;
    mediaFileIds: string| number;
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

  const onSubmit: SubmitHandler<{
    Id: number;
    name: string;
    detail: string;
    size: string;
    barcode:number | string;
    password: string;
    isActive:boolean;
    price: number | string;
    catId: number | string;
    storeId: number | string;
    mediaFileIds: string| number;
    FullFileUrl: string;
    gender: string;
  }> = async (data) => {
    // saveUserData
    if (!isUploaded) {
      showToast("error", "Please upload an image.");
      return; // Stop further execution
    }
    try {
      const response = await saveProducts({
        Id: data.Id,
        name: data.name,
        size: data.size,
        detail: data.detail,
        password: data.password,
        price: data.price,
        catId: data.catId,
        barcode:data.barcode,
        storeId:data.storeId,
        isActive:isActives,
        FullFileUrl: data.FullFileUrl,
        mediaFileIds: uploadedFile?.id.toString(),
        gender: data.gender,
      });

      if (response.statusCode === 200) {
        showToast("success", response.message);
        navigate(-2);
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
      const response = await getProducts({ id });
      // Use reset method to update the form values
      reset({
        Id: response.data.id,
        name: response.data.name,
        size: response.data.size,
        detail: response.data.detail,
        mediaFileIds: response.data.mediaFileIds,
        FullFileUrl: response.data.FullFileUrl,
        price: response.data.price,
        barcode:response.data.barcode,
        password: response.data.password,
        storeId: response.data.storeId,
        catId: response.data.catId,
        isActive:response.data.isActive ,  
        gender: response?.data?.gender,
      });
      setLoadoing(false);
      setIsActives(response.data.isActive)
      if(response?.data?.mediaFileIds){
        const logoId:any = response?.data?.mediaFileIds
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

      }    } catch (error) {
      setLoadoing(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (Number(params.id)) {
      GetDetails();
    }
    fetchCategory();
    fetchStores();
    }, []);
  
    const toggleSwitch = (e: any) => {
      console.log("toggle", e.target.checked);
      setIsActives(e.target.checked);
    };

  async function deleteData() {
    let response = await deleteProducts(id);
    try {
      if (response.statusCode === 200) {
        console.log(response.message);
        showToast("success", response.message);
        navigate("/products");
      } else {
        console.log(response.message);
        showToast("error", response.message);
      }
    } catch (error) {
      console.log(response.error);
    }
  }


  const fetchCategory = async () => {
    try {
      const response = await getAllCategories({
        pageNumber: 1,
        pageSize: 100,
        filters:"",
        query:"",
      });
      if (response.statusCode === 200) {
        setCategory(
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


  const fetchStores = async () => {
    try {
      const response = await getAllStores({
        pageNumber: 1,
        pageSize: 100,
        query:"",
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
        name="Products Detail"
        pageTitle="ADD PRODUCTS"
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none">
          <Card.Body>
            {loading && <Loader />}
            <Row>
              <Col xl={12}>
                <Row>
                  <Col xl={12}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter product name"
                      label="Product Name"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>
                  {/* <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="size"
                      id="size"
                      placeholder="Enter productSize"
                      label="Product Size"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col> */}
                  <Col xl={6}>
                    <SelectCtrl
                      control={control}
                      name="catId"
                      id="catId"
                      placeholder="Please Select category "
                      label="Select Category"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={category}
                    />
                  </Col>                  
                  <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="number"
                      name="barcode"
                      id="barcode"
                      placeholder="Enter UPC code"
                      label="UPC Code"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>                
                  
                </Row>
                <Row>
                    <Col xl={12}>
                    <TextareaCtrl
                            control={control}
                            
                            name="detail"
                            id="detail"
                            placeholder=""
                            label="Description"
                            showError={showError}
                            required={true}
                            disabled={apiStatus.inprogress}
                            className="mb-3"
                            rows={5}
        
        
             />
                    </Col>
                    
                </Row>
                <Col xl={6}>
                <label className="mb-4">
                      Products Picture <span style={{ color: 'red' }}>*</span>
                    </label>
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
              <Form.Check
    type="switch"
    id="isActive"
    checked={isActives}
    onChange={toggleSwitch}
    name="isActive"
    className="mb-2"
    label={isActives ? "Active" : "In-active"}
/>
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

export default ProductEdit;
