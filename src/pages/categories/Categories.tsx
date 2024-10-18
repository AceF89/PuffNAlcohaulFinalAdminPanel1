import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useToast } from "../../hooks";
import { getAllCategories } from "../../helpers";
import PageTitleBox from "../../components/PageTitleBox";
import Table from "../../components/Table";
import { FormatDate } from "../../common/utility";
import Search from "../../components/Search";
import { setOrderCategories } from "helpers/api/category";

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Picture",
    accessor:(row: any) => {
      return row?.fullIconFileUrl ?<img src={row.fullIconFileUrl} style={{width:'30px', height:'30px'}}/>: "NA";
    },
},
  {
    Header: "Loyalty Points",
    accessor: "loyaltyPoints",
  },
  {
    Header: "Updated On",
    accessor: (row: any) => {
      return FormatDate(row.modifiedOn, "lll");
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

const Categories = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    list: usersList,
    isFetching,
    pagination,
    reCall,
  } = useApi(
    "GetAllUsers",
    (data: any) =>
      getAllCategories({
        pageNumber: 1,
        pageSize: 10,
        filters:"",
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

  const handleSetOrder = async (data: any) => {
    try {
      
      const response = await setOrderCategories({   
        ids:data.map((item: any) => item.id).join(","),
        
      });
      if (response.statusCode === 200) {
        reCall();
      } else {
        showToast("error", response.error);
      }
    } catch (error) {
      console.log(error);
    }
   
  };
  

  const breadCrumbItems = [
    
  ];

  return (
    <>
      <PageTitleBox
        name=""
        pageTitle="Categories"
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
            isDragble={true}
            handleSetOrder={handleSetOrder}
            onRowClick={(row) => {
              navigate("" + row.original.id);
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Categories;
