import {  Button, Card, Col, Row } from "react-bootstrap";
import { useApi, useToast } from "../../hooks";
import {  getAllStores } from "../../helpers";
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
    Header: "Store Name",
    accessor: "name",
  },
  {
    Header: "Store Address",
    accessor: "address",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Phone ",
    accessor: (row: any) => {
      return row.phoneNumber || "NA";
    },
  },

];

const Store = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    list: usersList,
    isFetching,
    pagination,
  } = useApi(
    "GetAllUsers",
    (data: any) =>
      getAllStores({
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

  return (
    <>
      <PageTitleBox
        name=""
        pageTitle="Stores"
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
              <Search pagination={pagination} />
              <Link style={{ position: "relative", right: "0px" }} to="/store/edit/add">
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

export default Store;
