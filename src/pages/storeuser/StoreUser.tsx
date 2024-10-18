import {  Badge, Button, Card, Col, Row } from "react-bootstrap";
import { useApi, useToast } from "../../hooks";
import { getAllUser } from "../../helpers";
import PageTitleBox from "../../components/PageTitleBox";
import Table from "../../components/Table";
import Search from "../../components/Search";
import { Link, useNavigate } from "react-router-dom";

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
    Header: "Assigned Store",
    accessor: (row:any) => {
      const storeNames = row.storeName.split(",");
      const truncatedStoreNames = storeNames.slice(0, 2).join(",");
      if (storeNames.length > 2) {
        return `${truncatedStoreNames} ...`;
      } else {
        return truncatedStoreNames;
      }
    },
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Phone ",
    accessor: "phoneNumber"
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

const StoreUser = () => {
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
        filters:"STOREUSER",
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


  return (
    <>
      <PageTitleBox
        name=""
        pageTitle="Store User"
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

export default StoreUser;

