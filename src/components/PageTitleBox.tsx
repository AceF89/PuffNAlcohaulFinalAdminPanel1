import React from "react";
import { Row, Col, Breadcrumb } from "react-bootstrap";
import { useUser } from "../hooks";
import PageTitle from "./PageTitle";

interface PageTitleBoxProps {
  name: string;
  pageTitle: string;
  rightItem?: any;
  breadCrumbItems?: any;
}

/**
 * PageTitleBox
 */
const PageTitleBox = ({
  name,
  pageTitle,
  rightItem,
  breadCrumbItems,
}: PageTitleBoxProps) => {
  const { user } = useUser();

  return (
    <Row>
      <Col>
        <div className="page-title-box">
          <div style={{ display: "block", color: "#314559" }}>
            {/* <h3 className="mb-2 text-color-blue fs-2">{user?.TeamName}</h3> */}
            <h4 className="page-title hassle-free">{pageTitle}</h4>
            <div className="mt-1">
              <Breadcrumb listProps={{ className: "m-0" }}>
                {/* <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item> */}

                {(breadCrumbItems || []).map((item: any, index: number) => {
                  return item.active ? (
                    <Breadcrumb.Item
                      active
                      key={index}
                      style={{ color: "#7f7d7d" }}
                    >
                      {item.label}
                    </Breadcrumb.Item>
                  ) : (
                    <Breadcrumb.Item key={index} href={item.path}>
                      {item.label}
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
            </div>
          </div>

          <div className="page-title-right">{rightItem}</div>
        </div>
      </Col>
    </Row>
  );
};

export default PageTitleBox;
