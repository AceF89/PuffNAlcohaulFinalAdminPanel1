import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useToast } from "../../hooks";
import { getAllUser } from "../../helpers";
import PageTitleBox from "../../components/PageTitleBox";
import Table from "../../components/Table";
import { FormatDate } from "../../common/utility";
import Search from "../../components/Search";

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "fullName",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Phone Number",
    accessor: (row: any) => {
      return row.phoneNumber || "NA";
    },
  },
  {
    Header: "Order Count",
    accessor: "",
  },
  {
    Header: "Status",
    accessor: (row: any) => {
      return row.isActive ? "Active" : "Inactive";
    },
  },
];

const Vendor = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    list: usersList,
    isFetching,
    pagination,
  } = useApi(
    "GetAllUsers",
    (data: any) =>
      getAllUser({
        pageNumber: 1,
        pageSize: 10,
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

  const breadCrumbItems = [
    // { label: "Dashboard", path: "/#/dashboard" },
    // { label: "Customers", path: "/#/customer" },
  ];

  return (
    <>
      <PageTitleBox
        name=""
        pageTitle="Vendor"
        // breadCrumbItems={breadCrumbItems}
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
              <Search pagination={pagination} />
              <Link style={{ position: "relative", right: "0px" }} to="./add">
                <Button variant="primary" className="btn ms-4 save-btn">
                  <i className="uil uil-plus"></i> Add
                </Button>
              </Link>
            </Col>
          </Row>
        }
      />

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
            onRowClick={(row) => {
              navigate("" + row.original.id);
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Vendor;
