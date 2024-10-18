import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useToast } from "../../hooks";
import PageTitleBox from "../../components/PageTitleBox";
import Table from "../../components/Table";
import { FormatDate } from "../../common/utility";
import Search from "../../components/Search";
import { getAllSnippet } from "../../helpers/api/snippet";

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Key",
    accessor: (item: any) => {
      return item?.key || "NA";
    },
  },
  {
    Header: "Picture",
    accessor:(row: any) => {
      return row?.mediaFileFullUrl ?<img src={row.mediaFileFullUrl} style={{width:'30px', height:'30px'}}/>: "NA";
    },
},
  {
    Header: "Updated On",
    accessor: (row: any) => {
      return FormatDate(row.modifiedOn, "lll");
    },
  },
 
];

const SnippetV1 = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    list: usersList,
    isFetching,
    pagination,
  } = useApi(
    "GetAllUsers",
    (data: any) =>
      getAllSnippet({
        pageNumber: 1,
        pageSize: 10,
        //  query: "",
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
        pageTitle="Snippets"
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

export default SnippetV1;
