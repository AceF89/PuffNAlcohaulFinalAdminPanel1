import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useToast } from "../../hooks";
import { getAllCategories, getAllOrder, getAllStores, getAllUser } from "../../helpers";
import PageTitleBox from "../../components/PageTitleBox";
import Table from "../../components/Table";
import { FormatDate } from "../../common/utility";
import Search from "../../components/Search";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SelectCtrl from "controllers/SelectCtrl";
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import moment from "moment";
const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Customer Name",
    accessor: "placedByName",
  },
  {
    Header: "Store Name",
    accessor: "storeName",
  },
  {
    Header: "Source",
    accessor: "source",
  },
  {
    Header: "Sub Total",
    accessor: (row: any) => `$${row.subTotal}`,
  },
  {
    Header: "Taxes",
    accessor: (row: any) => `$${row.totalTax}`,
  },
  {
    Header: "Total",
    accessor: (row: any) => `$${row.total}`,
  },
  {
    Header: "Orderded On",
    accessor: (row: any) => {
      return FormatDate(row.placedOn, "lll");
    },
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const Order = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<any[]>([]);
  const [myValue, setMyValue] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any[]>([]);
  const [store, setStore] = useState<any[]>([]);
  const [state, setState] = useState<any>([
    {
      startDate: null,
      endDate: new Date(""),
      key: "selection",
    },
  ]);

  const startdate = state && state[0].startDate?.toString()
  const enddate = state && state[0].endDate?.toString()

    let checkInTime = startdate ? moment(startdate) : null;
    let checkInDate = checkInTime?.format("YYYY-MM-DD");
    let checkOutTime = enddate ? moment(enddate) : null;
    let checkOut = checkOutTime?.format("YYYY-MM-DD");


  console.log(checkInDate , checkOut )
  const [apiStatus, setApiStatus] = useState({
    inprogress: false,
    error: null,
  });
  const {
    list: usersList,
    isFetching,
    pagination,
    reCall: fetchOrders,
  } = useApi(
    "getAllOrder",
    (data: any) =>
      getAllOrder({
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

  const fetchCategory = async () => {
    try {
      const response = await getAllCategories({
        pageNumber: 1,
        pageSize: 100,
        filters: "",
        query: "",
      });
      if (response.statusCode === 200) {
        setCategory(
          response.data.items.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };
  const fetchCustomer = async () => {
    try {
      const response = await getAllUser({
        pageNumber: 1,
        pageSize: 100,
        filters: "USER",
        query: "",
      });
      if (response.statusCode === 200) {
        setCustomer(
          response.data.items.map((item: any) => {
            return {
              label: item.fullName,
              value: item.id,
            };
          })
        );
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };
  const fetchStore = async () => {
    try {
      const response = await getAllStores({
        pageNumber: 1,
        pageSize: 100,
        query: "",
      });
      if (response.statusCode === 200) {
        setStore(
          response.data.items.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    Id: number;
  }>({
    mode: "onBlur",
  });

  const orderValueRange: any[] = [
    {
      label: "50-100",
      value: "50-100",
    },
    {
      label: "100-200",
      value: "100-200",
    },
    {
      label: "200-500",
      value: "200-500",
    },
    {
      label: "Above 500",
      value: "above 500",
    },
  ];


  useEffect(() => {
    fetchCategory();
    fetchStore();
    fetchCustomer();
  }, [reset]);


  const handleFilterSubmit = async (data: any) => {
    const customerId = data.custId;
    const storeId = data.myStoreId;
    const categoryId = data.catId;
    const orderRange = data.orderId;

    const startDate = state[0].startDate ? moment(state[0].startDate).format("YYYY-MM-DD") : null;
    const endDate = state[0].endDate ? moment(state[0].endDate).format("YYYY-MM-DD") : null;
    
    const filters = orderRange ? orderRange : (startDate && endDate ? `date=${startDate},${endDate}` : "");

    fetchOrders({
      storeIds: storeId || 0,
      customerId: customerId || 0,
      categoryId: categoryId || 0,
      filters: filters,
    });

    handleCloseModal();
  };
  const handleSelect = () => {
    console.log("object")
  }

  return (
    <>
      <PageTitleBox
        name=""
        pageTitle="Orders"
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex my-2" xs={12} md={12}>
              <Search pagination={pagination} />
              <div style={{ position: "relative", right: "0px" }} onClick={handleOpenModal}>
                <Button variant="primary" className="btn ms-4 save-btn">
                  <i className="uil-align-center-alt"></i> Filter
                </Button>
              </div>
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
      <Modal size="lg" show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="uil-align-center-alt"></i> Add filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form name="chat-form" id="chat-form" onSubmit={handleSubmit(handleFilterSubmit)}>
            <Row>
              <Col xl={12}>
                <Row>
                  <Col xl={6}>
                    <SelectCtrl
                      control={control}
                      name="catId"
                      id="catId"
                      placeholder="Select category name "
                      label="Category Name"
                      showError={''}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={category}
                    />
                  </Col>
                  <Col xl={6}>
                    <SelectCtrl
                      control={control}
                      name="myStoreId"
                      id="myStoreId"
                      placeholder="Select store name "
                      label=" Store Name"
                      showError={''}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={store}
                    />
                  </Col>
                  <Col xl={6}>
                    <SelectCtrl
                      control={control}
                      name="custId"
                      id="custId"
                      placeholder="Select customer name "
                      label="Customer Name"
                      showError={''}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={customer}
                    />
                  </Col>
                  <Col xl={6}>
                    <SelectCtrl
                      control={control}
                      name="orderId"
                      id="orderId"
                      placeholder="Select value range "
                      label="Order Value Range"
                      showError={''}
                      required={false}
                      disabled={apiStatus.inprogress}
                      className="mb-3"
                      options={orderValueRange}
                    />
                  </Col>
          
               
                


                </Row>
              </Col>
            </Row>
            <div className="mx-4 d-flex align-items-center daterange">

<DateRange
  editableDateInputs={true}
  onChange={(item: any) => setState([item.selection])}
  moveRangeOnFirstSelection={false}
  ranges={state}
  months={2}
  direction="horizontal"
/>
</div>
            <div className="d-flex justify-content-between align-items-baseline mt-3">
              <div className="button-list">
                <Button
                  type="submit"
                  disabled={apiStatus.inprogress}
                  className="px-4 save-btn"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Order;
