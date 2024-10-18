import { saveFileMulti } from "helpers/api/file";
import { useToast } from "hooks";
import React, { forwardRef, useRef, useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";


const FileUpload = forwardRef((props: any, ref) => {
  const { handleCallBack, handleRemove }: any = props;
  // const [fileData, setFileData]: any = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedFileUrls, setSelectedFileUrls] = useState<any>([]);
  // const [resetFiles, setResetFiles]: any = useState(false);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setHandleClose = (url: { id: number; fullFileUrl: string }) => {
    if (props.handleClose) {
      props.handleClose(url);
    }
  };

  const handleImageChange = async (e: any) => {
    if (props.multiple && e.target.files?.length > 0) {
      const urls = Array.from(e.target.files).map((file: any) =>
        URL.createObjectURL(file)
      );
      setSelectedFileUrls([...selectedFileUrls, ...urls]);
      setSelectedFile([...selectedFile, ...e.target.files]);
    } else {
      const file = e.target.files[0];
      if (file)
        if (props.multiple) {
          setSelectedFile([...selectedFile, file]);
          setSelectedFileUrls([...selectedFileUrls, URL.createObjectURL(file)]);
        } else {
          setSelectedFileUrls([URL.createObjectURL(file)]);
        }
    }
  };

  const triggerFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    selectedFile?.forEach((file: File) => {
      formData.append('req', file);
    });
    try {
      const response = await saveFileMulti(formData);
      if (response && response?.data) {
        showToast("success", response?.data?.message);
        handleCallBack(response?.data?.data);
        setSelectedFile([]);
        setSelectedFileUrls([]);
      }
    } catch (error) { }
  };

  const handleRemoveFile = (id: string) => {
    if (handleRemove) {
      handleRemove(id);
    }
  };

  const handleCancel = (index: number) => {
    setSelectedFile(
      selectedFile?.map((item: any, ind: number) => ind != index)
    );
    setSelectedFileUrls(
      selectedFileUrls?.filter((item: any, ind: number) => ind != index)
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <div
                className="dz-preview dz-processing dz-error dz-complete dz-image-preview"
              >
                <h4 className="header-title mt-0 mb-1">Upload File</h4>
                <div className="row d-flex flex-wrap gap-3 w-75 gx-0 p-0 ">
                  {selectedFileUrls?.length > 0 || props?.Images?.length > 0 ? (
                    <>
                      {selectedFileUrls?.map((file: any, index: number) => {
                        return (
                          <div className="col-2 position-relative  Upload_img">
                            <img
                              src={file}
                              className="img-fluid"
                              alt=""
                              width={"150px"}
                              height={"150px"}
                              onClick={triggerFileInputClick}
                            />
                            <i
                              onClick={() => handleCancel(index)}
                              className="fa fa-times cross-Icon"
                              aria-hidden="true"
                            ></i>
                          </div>
                        );
                      })}
                      {props?.Images?.map((file: any) => {
                        return (
                          <div className="col-2 position-relative  Upload_img">
                            <img
                              src={file.fullFileUrl}
                              className="img-fluid"
                              alt=""
                              width={"150px"}
                              height={"150px"}
                              onClick={triggerFileInputClick}
                            />
                            <i
                              onClick={() => handleRemove(file?.id)}
                              className="fa fa-times cross-Icon"
                              aria-hidden="true"
                            ></i>
                          </div>
                        );
                      })}
                      {selectedFileUrls?.length > 0 && (
                        <div className=" col-1 upload-button">
                          <Button
                            onClick={handleImageUpload}
                            variant="primary"
                          >
                            Upload
                          </Button>
                        </div>
                      )}
                    </>
                  ) : ""
                  }

                  <div className="col-1 add_image_icon">
                    <input
                      type="file"
                      id="imageUpload"
                      ref={!props?.multiple ? fileInputRef : null}
                      accept=".png, .jpg, .jpeg"
                      multiple={props.multiple}
                      onChange={(e) => handleImageChange(e)}
                    />
                    {selectedFileUrls?.length > 0 && !props.multiple ? (
                      <div></div>
                    ) : (
                      <>
                        <div className="bg-light border d-flex align-items-center justify-content-center h-100 rounded">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-plus-lg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
});

export default FileUpload;

