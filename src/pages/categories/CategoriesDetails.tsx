import { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button } from "react-bootstrap";
import { InputCtrl, SelectCtrl } from "../../controllers";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteCategories, getAllStores, getCategories, saveCategories } from "../../helpers";
import DeleteConfirm from "../../components/Inplace Confirm/DeleteConfirm";
import { useApi, useToast } from "../../hooks";
import Loader from "../../components/Loader";
import FileUpload from "pages/forms/FileUpload";
import { t } from "i18next";
import { deleteFile, getFile } from "helpers/api/file";
import AsyncMultiSelectCtrlV1 from "controllers/AsyncMultiSelectCtrlV1";
import { deleteStorecategory, saveCategoryStore } from "helpers/api/store";
import _ from "lodash";

//Default values
const defaultValues: {
  Id: number;
  name: string;
  iconFileId: string| number;
  loyaltyPoints:number;
  isAcitve:boolean;
  isFeatured:boolean;
} = {
  Id: 0,
  name: "",
  iconFileId: "",
  loyaltyPoints:0,
  isAcitve:true,
  isFeatured:true,
};

const CategoriesDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [stores, setStores] = useState<any[]>([]);
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoadoing]: any = useState(false);
  const [uploadedFile, setUploadedFile]: any = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
  const [imageUrl, setImageUrl]: any = useState('');
  const [apiStatus] = useState({
    inprogress: false,
  });
  const [defaultData, setDefaultData] = useState<any>({
    stores: [],
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    Id: number;
    name: string;
    isFeatured:boolean;
    loyaltyPoints:number;
    iconFileId: string | number;
    statusId: number | string;
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
    isFeatured:boolean;
    iconFileId: string | number;
    loyaltyPoints:number;
    statusId: number | string;
  }> = async (data) => {
    // saveUserData
    if (!isUploaded) {
      showToast("error", "Please upload an image.");
      return; // Stop further execution
    }
    try {
      console.log("Data>>", data);
      const response = await saveCategories({
        Id: data.Id,
        name: data.name,
        isFeatured:data.isFeatured,
        iconFileId: uploadedFile?.id,
        loyaltyPoints:data.loyaltyPoints,
        isActive: data.statusId === 2 ? false : true ,
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
      const response = await getCategories({ id });
      reset({
        Id: response.data.id,
        name: response.data.name,
        isFeatured:response.data.isFeatured,
        iconFileId: response.data.iconFileId,
        loyaltyPoints:response.data.loyaltyPoints,
        statusId: response.data.isActive ? 1 : 2,
      });
      setLoadoing(false);
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
     
    } catch (error) {
      setLoadoing(false);
     
      console.log(error, "error");
    }
  };

  

  async function deleteData() {
    let response = await deleteCategories(id);
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

  const {
    list: usersList,
    isFetching,
    pagination,
    reCall:getStores,
  } = useApi(
    "getAllStores",
    (data: any) =>
      getAllStores({
        pageNumber: 1,
        pageSize: 10,
        categoryId:id,
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
  const saveCategoryStoreData = async (selectedOptions: any) => {
    try {
      let categoryId = id;
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
          const response = await deleteStorecategory({
            id:0,
            storeId, 
            categoryId,
          });
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
          const response = await saveCategoryStore({
            
            storeId,
            categoryId,
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



  useEffect(() => {
    if (Number(params.id)) {
      GetDetails();
    }
  }, []);


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
        name="Categories Detail"
        pageTitle="  Categories Detail "
      />
      <form name="chat-form" id="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none">
          <Card.Body>
            {loading && <Loader />}
            <Row>
              <Col xl={12}>
                <Row>
                <Col xl={6}>
                <label className="mb-4">
                       Picture <span style={{ color: 'red' }}>*</span>
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
              </Row>
                   <Row>
                   <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="text"
                      name="name"
                      id="name"
                      placeholder={t("Enter category name")}
                      label={t("Category Name")}
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                    </Col>
                    <Col xl={6}>
                    <InputCtrl
                      control={control}
                      type="number"
                      name="loyaltyPoints"
                      id="loyaltyPoints"
                      placeholder={t("Enter Loyalty Points")}
                      label={t("Loyalty Points")}
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                    </Col>
                    {id ? (
                    <Col xl={6}>
                     <AsyncMultiSelectCtrlV1
  control={control}
  name='test'
  id='test'
  placeholder='Select Store'
  label='Store'
  showError={showError}
  required={false}
  disabled={apiStatus.inprogress}
  className='mb-3'
  promiseMethod={getAllStores}
  labelKey='name'
  valueKey='id'
  defaultValue={defaultData.stores}
  options={[]}
  onSelect={(selectedOptions: any) => {
    saveCategoryStoreData(selectedOptions);
  }}

  
/>

                  </Col>
                     ) : null}
                     
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
                   </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <div className="d-flex justify-content-between align-items-baseline">
          <div className="button-list">
            <Button
              variant="primary"
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

export default CategoriesDetails;

