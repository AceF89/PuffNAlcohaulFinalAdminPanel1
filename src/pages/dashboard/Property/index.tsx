import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FormatDate } from "../../../common/utility";
import PageTitleBox from "../../../components/PageTitleBox";
import Search from "../../../components/Search";
import Table from "../../../components/Table";
import { getAllSnippet } from "../../../helpers/api/snippet";
import { useApi, useToast } from "../../../hooks";
import StatsChart from "../joudma-dashboard/StatsChart";
import Select from "react-select";
import { Form } from "react-bootstrap";
import Location from "../../../assets/images/location.png";
import { getAdminDashboard } from "helpers/api/dashboard";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import propery from "../../../assets/images/property.png";
import users from "../../../assets/images/users.png";
import snag from "../../../assets/images/snag.png";
import { getAllUser } from "helpers";


const checkboxData = [
  {
    label: "Kitchen",
    value: "Kitchen",
  },
  {
    label: "Living Room",
    value: "livingRoom",
  },
  {
    label: "Hollway",
    value: "Hollway",
  },
  {
    label: "Drawing room",
    value: "Drawing room",
  },
  {
    label: "Bathroom",
    value: "Bathroom",
  },
  {
    label: "Guset room",
    value: "guset room",
  },
];

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Property",
    accessor: "name",
  },
  {
    Header: "Address",
    accessor: "address",
  },
  {
    Header: "City",
    accessor: "cityName",
  },
  {
    Header: "State",
    accessor: "stateName",
  },
  {
    Header: "Country",
    accessor: "countryName",
  },
  {
    Header: "Property Code",
    accessor: "uniqueCode",
  },
  {
    Header: "Worker Assigned",
    accessor: (row: any) => {
      return row.assignedWorkers[0]?.fullName || "NA";
    },
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [property, setProperty] = useState<any>();
  const [flag, setFlag] = useState(true);
  const [details, setDetails] = useState({
    totalCustomers: 0,
    totalTasksSchedule: 0,
    totalWorkers: 0,
    completedTasks: 0,
    totalSnagsPending:0,
    totalProperties:0,
  });

  const ridesCard = [
    {
      title: "Total Customers",
      name: 'totalCustomers',
      stats: details.totalCustomers,
      icon: users,
    },
    {
      title: "Total  Workers",
      name:'totalWorkers',
      stats: details.totalWorkers,
      icon: users,
    },
    {
      title: "Total Properties",
      stats: details.totalProperties,
      icon: users,
      // type: "property",
    },
    {
      title: "Total Snags Schedule",
      name: 'totalTasksSchedule',
      stats: details.totalTasksSchedule,
      icon: snag,
    },
    {
      title: "Completed snags",
      name: 'completedTasks',
      stats: details.completedTasks,
      icon: snag,
    },
    {
      title: "Pending snags",
      stats: details.totalSnagsPending,
      icon: snag,
    },
  ];
  const {
    list: propertyList,
    isFetching,
    pagination,
  } = useApi(
    "GetAllUsers",
    (data: any) =>
      getAllUser({
        pageNumber: 1,
        pageSize: 10,
        //  query: "",
        ...data,
      }),
    {
      enabled: true,
      onSuccess: (response) => {
        // setProperty(response?.data?.items[0])
        return response;
      },
      onError: (error: Error) => {
        console.error(error);
        showToast("error", error.message);
      },
    }
  );

  const fetchData = async() =>{
    try {
      const response = await getAdminDashboard();
      if(response.statusCode === 200){
        setDetails(response.data)
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (flag && propertyList.length > 0) {
      setProperty(propertyList[0]);
      setFlag(false);
    }
  }, [propertyList]);

  const fetchDashoard = async () => {
    try {
      const response = await getAdminDashboard();
      if (response.statusCode === 200) {
        console.log(response);
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchDashoard();
    fetchData();
  }, []);

  // const breadCrumbItems = [{ label: "Dashboard", path: "/" }];
  return (
    <>
      <PageTitleBox
        name=""
        pageTitle="DASHBOARD"
        // breadCrumbItems={breadCrumbItems}
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
              {/* <Search pagination={pagination} />
              <Link style={{ position: "relative", right: "30px" }} to="./add">
                <Button variant="primary" className="btn ms-4">
                  <i className="uil uil-plus"></i> Add
                </Button>
              </Link> */}
            </Col>
          </Row>
        }
      />

      <Row>
        <Col sm={6} xl={9}>
          <Row>
            {ridesCard.map((cardItem: any) => {
              return (
                <Col sm={6} xl={4}>
                  {/* <AwardStasProps
                    title={cardItem.title}
                    stats={cardItem.stats}
                    trend={{
                      textClass: "text-success",
                      icon: "uil uil-arrow-up",
                      value: "",
                    }}
                    colors={["#727cf5"]}
                    icon={cardItem?.icon}
                    type={cardItem?.type}
                  /> */}
                </Col>
              );
            })}

            <Col sm={12} xl={12}>
              <Card className="shadow-none">
                <Card.Body>
                  <Row>
                    <Col xl={5}>
                      <div className="UserWrap">
                        <div>
                          {/* <p className="title">{property?.name}</p>
                          <div className="UserInfo">
                            <div className="user-img">
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt=""
                              />
                            </div>
                            <div className="user-name">
                              <div className="type">Worker Assigned</div>
                              <div>
                                {property?.assignedWorkers[0]?.fullName}
                              </div>
                            </div>
                          </div> */}
                        </div>
                        <div>
                          <div className="location">
                            <div>
                              {/* <img src={Location} alt="" className="icon" /> */}
                            </div>
                            <div>
                              {/* 13419 Stasia Freeway */}
                              {/* <span>{property?.address}</span>
                              <div className="view">View on Map</div> */}
                            </div>
                          </div>
                        </div>
                        <div>
                          {/* <div className="upc">Unique Property Code (UPC)</div>
                          <div>{property?.uniqueCode}</div> */}
                        </div>

                        <div>
                          {/* <div className="upc">Total Snags</div>
                          <div>{property?.taskCount}</div> */}
                        </div>
                      </div>
                    </Col>
                    {/* <Col xl={7} className={"checkWrap"}>
                      <div className="wrap">
                        <div>
                          <p>ASSIGNED SNAGS</p>
                          <Form className={"checkboxWrap"}>
                            {checkboxData?.map((item) => {
                              return (
                                <Form.Check
                                  disabled
                                  type="checkbox"
                                  label={item.label}
                                  id="default-checkbox"
                                />
                              );
                            })}
                          </Form>
                        </div>

                        <div>
                          <Select options={[]} />
                        </div>
                      </div>
                    </Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        {/* <Col sm={6} xl={3}>
          <StatsChart title="Statistics" />
        </Col> */}
      </Row>

      {/* <Card className="shadow-none">
        <Card.Body>
          <Table
            isFetching={isFetching}
            columns={columns}
            data={propertyList}
            sizePerPageList={[]}
            isSortable={true}
            pagination={true}
            {...pagination}
            onRowClick={(row) => {
              console.log(row);
              setProperty(row.original);
            }}
          />
        </Card.Body>
      </Card> */}
    </>
  );
};

export default Dashboard;
