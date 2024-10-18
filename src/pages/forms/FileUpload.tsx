import React, { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

// components
import FileUploader from "../../components/FileUploader";
import { SubmitHandler } from "react-hook-form";
import { saveFile } from "../../helpers/api/file";
import { useToast } from "../../hooks";

const FileUpload = (props: any) => {
  const { handleCallBack } = props;

  const [fileData, setFileData]: any = useState([]);
  const { showToast, dissmisToast } = useToast();

  const onSubmit: SubmitHandler<any> = async () => {
    if (fileData && fileData.length > 0) {
      const fileUploaded: any = fileData[0];

      if (fileUploaded) {
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

        if (fileUploaded.size !== 0 && fileUploaded.size <= maxSizeInBytes) {
          const finalPayload = {
            File: fileUploaded,
            Type: fileUploaded.type,
          };

          try {
            const response: any = await saveFile(finalPayload);
            if (handleCallBack && response) {
              handleCallBack(response?.data?.data);
            }
            if (response.statusCode === 200) {
              // showToast("success", response.message);
            } else {
              console.log(response.error);
              // showToast("error", response.message);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          let desc: string = "File size exceeds the limit of 5 MB.";
          if (fileUploaded.size === 0) {
            desc = "No content, please upload a valid file.";
          }
          // show toast message
          showToast("error", desc);
        }
      }
    } else {
      showToast("error", "Please upload a file.");
    }
    // saveFile
  };

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <h4 className="header-title mt-0 mb-1">Upload File</h4>

              <FileUploader
                onFileUpload={(files) => {
                  if (files && files.length > 0) {
                    setFileData(files);
                  } else {
                    showToast("error", "Please upload a file.");
                  }
                }}
              />

              <div className="clearfix text-end mt-3">
                <Button onClick={onSubmit} variant="primary">
                  <i className="uil uil-arrow-right me-1"></i> Upload
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FileUpload;
