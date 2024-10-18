import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useToast } from "../../hooks";
import { getAllUser } from "../../helpers";
import PageTitleBox from "../../components/PageTitleBox";
import Table from "../../components/Table";
import Search from "../../components/Search";
import { FormatDate } from "common/utility";

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
    Header: "Assigned Store",
    accessor: "storeName",
  },
  {
    Header: "DOB",
    accessor: (row: any) => {
      return FormatDate(row.dob,'ll');
    },  },
  {
    Header: "Phone ",
    accessor: (row: any) => {
      return row.phoneNumber || "NA";
    },
  },
  

  {
    Header: "Status",
    accessor: (row: any) => {
      return (
        <Badge
          bg={row.isActive ? "success" : "danger"}
          className='w-75 text-capitalize text-light rounded-pill fs-12  '
        >
          {row.isActive ? "Active" : "InActive"}
        </Badge>
      );
    },
  },
];

const User = () => {
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
        filters:"USER",
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
        pageTitle="Customers"
        // breadCrumbItems={breadCrumbItems}
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
              <Search pagination={pagination} />
              {/* <Link style={{ position: "relative", right: "0px" }} to="./add">
                <Button variant="primary" className="btn ms-4 save-btn">
                  <i className="uil uil-plus"></i> Add
                </Button>
              </Link> */}
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

export default User;