import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApi, useToast } from "../../hooks";
import PageTitleBox from "../../components/PageTitleBox";
import Table from "../../components/Table";
import Search from "../../components/Search";
import { getAllProducts } from "helpers/api/products";

const columns = [
  {
    Header: "ID",
    accessor: "id",
    colKey:"id",
    sort:true
  },
  {
    Header: "Name",
    accessor: "name",
    colKey:"name",
    sort:true
  },
  {
    Header: "Category",
    accessor: "categoryName",
    colKey:"categoryName",
    sort:true
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

const Products = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramValue = searchParams.get("page");
  const {
    list: usersList,
    isFetching,
    pagination,
    reCall:refetchUser,
  } = useApi(
    "GetAllUsers",
    (data: any) =>
      getAllProducts({
        pageNumber: paramValue ? parseInt(paramValue) : 1,
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
        pageTitle="Products"
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
              <Search pagination={pagination} />
              <Link style={{ position: "relative", right: "0px" }} to="/products/edit/add">
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
            handleColumnSort={(key: string, order: string)=>{
              refetchUser({
                pageNumber: 1,
                pageSize: 10,
                sortBy: `${key},${order}` 
              })
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Products;
