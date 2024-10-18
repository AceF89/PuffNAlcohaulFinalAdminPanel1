import { useEffect } from "react";
import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button } from "react-bootstrap";
import { InputCtrl } from "../../controllers";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllRoles } from "../../helpers";
import DeleteConfirm from "../../components/Inplace Confirm/DeleteConfirm";
import { useToast } from "../../hooks";
import Loader from "../../components/Loader";
import TextareaCtrl from "../../components/TextArea/TextArea";
import {
  deleteSnippet,
  getSnippet,
  saveSnippet,
} from "../../helpers/api/snippet";
import FileUpload from "pages/forms/FileUpload";
import { deleteFile, getFile } from "helpers/api/file";

//Default values
const defaultValues: {
  Id: number;
  key: string;
  content: string;
  mediaFileId:string | number;
} = {
  Id: 0,
  key: "",
  content: "",
  mediaFileId:"",
};

const SnippetDetailsV1 = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [roles, setRoles] = useState<any[]>([]);
  const { showToast, dissmisToast } = useToast();
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
    key: string;
    content: string;
    mediaFileId:string | number;

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
    key: string;
    content: string;
    mediaFileId:string | number;

  }> = async (data) => {
    try {
      console.log("Data>>", data);
      const response = await saveSnippet({
        Id: data.Id,
        key: data.key,
        content: data.content,
        mediaFileId: uploadedFile?.id,
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
      const response = await getSnippet({ id });
      reset({
        Id: response.data.id,
        key: response.data.key,
        content: response.data.content,
        mediaFileId: response.data.mediaFileId,
      });
      setLoadoing(false);
      if(response?.data?.mediaFileId){
        const logoId:any = response?.data?.mediaFileId
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
    let response = await deleteSnippet(id);
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

  useEffect(() => {
    if (Number(params.id)) {
      GetDetails();
    }
    fetchRoles();
  }, []);


  return (
    <>
      <PageTitleBox
        name="User Detail"
        pageTitle="Snippets Details"
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
                      name="key"
                      id="key"
                      placeholder="Enter key"
                      label="Key"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                    />
                  </Col>

                  <Col xl={12}>
                    <TextareaCtrl
                      control={control}
                      name="content"
                      id="content"
                      placeholder=""
                      label="Content"
                      showError={showError}
                      required={true}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      rows={10}
                    />
                  </Col>
                  <Row>
                <Col xl={6}>
                <label className="mb-4">
                       Picture
                    </label>
                {isUploaded ? <div className="d-flex justify-content-start"><img className="uploaded-image" src={imageUrl} />

                  <div className="remove-button">
                  <DeleteConfirm
              isHide={!isUploaded}
              disabled={apiStatus.inprogress}
              confirm={() => {
                deleteImage();
              }}
              message='Are You Sure ?'
            />
                  </div>


                </div> : <FileUpload handleCallBack={handleCallBack} />}

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

export default SnippetDetailsV1;
