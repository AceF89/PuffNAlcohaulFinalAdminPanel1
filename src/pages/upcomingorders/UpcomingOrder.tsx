import PageTitleBox from "../../components/PageTitleBox";
import { Card, Col, Row, Button, Collapse, Dropdown, Modal } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { getAllOrder, getAllStores } from "../../helpers";
import { useApi, useToast } from "../../hooks";
import Loader from "../../components/Loader";
import { FormatDate, reduceString } from "common/utility";
import { getOrder, orderStatus } from "helpers/api/order";
import SelectFilter from "components/SelectFilter";

const UpcomingOrders = () => {
  const { showToast, dissmisToast } = useToast();
  const [loading, setLoading]: any = useState(false);
  const [myData, setMyData] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  const [product, setProduct] = useState<any>([]);
  const [type, setType] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [detailLoadingOrderId, setDetailLoadingOrderId] = useState(null);
  const [storeName, setStoreName] = useState<any[]>([]);


  const { reCall: pendingorder } = useApi(
    "getAllOrder",
    (data: any) =>
      getAllOrder({
        pageNumber: 1,
        pageSize: 500,
        status: "Paid",
        ...data,
      }),
    {
      enabled: true,
      onSuccess: (response) => {
        setMyData(response.data.items);
        return response;
      },
      onError: (error: Error) => {
        console.error(error);
        showToast("error", error.message);
      },
    }
  );

  const { reCall: orderprepare } = useApi(
    "getAllOrder",
    (data: any) =>
      getAllOrder({
        pageNumber: 1,
        pageSize: 500,
        status: "Accepted,Delivering,Preparing,ReadyForDelivery,ReadyForPickup",
        ...data,
      }),
    {
      enabled: true,
      onSuccess: (response) => {
        setOrders(response.data.items);
        if (response.data.items.length > 0) {
          setType(response.data.items[0].type);
        }
        return response;
      },
      onError: (error: Error) => {
        console.error(error);
        showToast("error", error.message);
      },
    }
  );

  const handleAcceptOrder = async (orderId: number) => {
    try {
      const response = await orderStatus({ orderId, status: "Accepted", reason: "" });
      showToast(response.statusCode === 200 ? "success" : "error", response.message);
      if (response.statusCode === 200) {
        pendingorder();
        orderprepare();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectOrder = async (orderId: any) => {
    if (!modalInput) {
      showToast("error", "Please enter a reason for rejecting the order.");
      return;
    }

    try {
      const response = await orderStatus({ orderId, status: "Rejected", reason: modalInput });
      showToast(response.statusCode === 200 ? "success" : "error", response.message);
      if (response.statusCode === 200) {
        handleCloseModal();
        pendingorder();
        orderprepare();
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleOrderStatus = async (orderId: any, selectedStatus: any) => {
    try {
      const response = await orderStatus({ orderId, status: selectedStatus, reason: "" });
      showToast(response.statusCode === 200 ? "success" : "error", response.message);
      if (response.statusCode === 200) {
        orderprepare();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetOrderDetails = async (orderId: any) => {
    try {
      setDetailLoadingOrderId(orderId);
      const response = await getOrder({ id: orderId });
      setProduct(response.data);
      setDetailLoadingOrderId(null);
    } catch (error) {
      console.log(error, "error");
      setDetailLoadingOrderId(null);
    }
  };

  const handleToggleExpand = (orderId: any) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    if (expandedOrderId !== orderId) {
      GetOrderDetails(orderId);
    }
  };
  const getStatusOptions = (orderType: any) => {
    if (orderType === "DELIVERY") {
      return [
        { label: "In Progress", value: "Preparing" },
        { label: "Ready for Delivery", value: "ReadyForDelivery" },
        { label: "Out for Delivery", value: "Delivering" },
        { label: "Completed", value: "Delivered" },
        { label: "Rejected", value: "Rejected" },
      ];
    } else if (orderType === "PICKUP") {
      return [
        { label: "In Progress", value: "Preparing" },
        { label: "Ready for Pickup", value: "ReadyForPickup" },
        { label: "Completed", value: "PickedUp" },
        { label: "Rejected", value: "Rejected" }
      ];
    }
    return [];
  };

  const fetchStoreName = async () => {
    try {
      const response = await getAllStores({
        pageNumber: 1,
        pageSize: 100,
      });
      if (response.statusCode === 200 && response.data) {
        const options = response.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        options.unshift({ label: "All", value: 0 });
        setStoreName(options);
      }
    } catch (error: any) {
      console.log("error", error);
      showToast("error", error.message);
    }
  };

  useEffect(() => {
    fetchStoreName();
  }, [])



  const refreshOrders = useCallback(() => {
    pendingorder();
    orderprepare();
  }, [pendingorder, orderprepare]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refreshOrders]);

  const handleOpenModal = (orderId: any) => {
    setShowModal(true);
    setModalInput("");
    setOrderValue(orderId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStoreChange = (selectedStatus: { label: string; value: string }) => {
    pendingorder({
      storeIds: selectedStatus.value
    });
    orderprepare({
      storeIds: selectedStatus.value
    })
  };

  return (
    <>
      <PageTitleBox name="Orders" pageTitle="Orders"
        rightItem={
          <Row className="justify-content-end">
            <Col className="d-flex " xs={12} md={12}>
              <SelectFilter
                options={storeName}
                paramName="status"
                placeholder="Select Store Name"
                onChange={handleStoreChange}
              />
            </Col>
          </Row>
        } />

      {myData.map((order: any) => (
        <Card className="shadow" key={order.id}>
          <Card.Body>
            {loading && <Loader />}

            <Row>
              <Col xl={2}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">Order No</label>
                  <div>{order.id}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="refNo" className="form-label fw-bold">Reference Id</label>
                  <div>{order.refNo}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label fw-bold">Customer Name</label>
                  <div>{order.placedByName}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label fw-bold">Driver Name</label>
                  <div>{order.driverName}</div>
                </div>
              </Col>
              <Col xl={2}>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-bold">Total Price</label>
                  <div>${order.total}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label fw-bold">Store Name</label>
                  <div>{order.storeName}</div>
                </div>
              </Col>

              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label fw-bold">Order Type</label>
                  <div>{order.type}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-bold">Status</label>
                  <div>{order.status}</div>
                </div>
              </Col>
              <Col xl={2}>
                <div className="mb-3">
                  <label htmlFor="placedOn" className="form-label fw-bold">Delivery Status</label>
                  <div>{order.scheduleType}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="placedOn" className="form-label fw-bold">Order On</label>
                  <div>{FormatDate(order.placedOn, "lll")}</div>
                </div>
              </Col>
            </Row>
            <div className="d-flex justify-content-between align-items-baseline">
              <div className="button-list">
                <Button type="button" className="px-4 save-btn" onClick={() => handleAcceptOrder(order.id)}>
                  Accept
                </Button>
                <Button className="px-4 cancel-btn" onClick={() => handleOpenModal(order.id)}>
                  Reject
                </Button>
              </div>
              <div className="text-end hand" style={{ color: "#0C94EA" }} onClick={() => handleToggleExpand(order.id)}>
                Order Details
              </div>
            </div>
            <Collapse in={expandedOrderId === order.id}>
              <div>
                {detailLoadingOrderId === order.id ? (
                  <Loader />
                ) : (
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th>Order No</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.orderItems?.map((item: any) => (
                        <tr key={item.id}>
                          <td>{item.orderId}</td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>$ {item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Collapse>
          </Card.Body>
        </Card>
      ))}

      <PageTitleBox name="Orders Status" pageTitle="Orders Status" />

      {orders.map((order: any) => (
        <Card className="shadow" key={order.id}>
          <Card.Body>
            {loading && <Loader />}

            <Row>
              <Col xl={2}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">Order No</label>
                  <div>{order.id}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="refNo" className="form-label fw-bold">Reference Id</label>
                  <div>{order.refNo}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label fw-bold">Customer Name</label>
                  <div>{order.placedByName}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label fw-bold">Driver Name</label>
                  <div>{order.driverName}</div>
                </div>
              </Col>
              <Col xl={2}>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-bold">Total Price</label>
                  <div>${order.total}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label fw-bold">Store Name</label>
                  <div>{order.storeName}</div>
                </div>
              </Col>

              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label fw-bold">Order Type</label>
                  <div>{order.type}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-bold">Delivery Status</label>
                  <div>{order.scheduleType}</div>
                </div>
              </Col>
              <Col xl={2}>
                <div className="mb-3">
                  <label htmlFor="placedOn" className="form-label fw-bold">Delivery Status</label>
                  <div>{order.scheduleType}</div>
                </div>
              </Col>
              <Col xl={3}>
                <div className="mb-3">
                  <label htmlFor="placedOn" className="form-label fw-bold">Order On</label>
                  <div>{FormatDate(order.placedOn, "lll")}</div>
                </div>
              </Col>

              {order.status === "REJECTED" && (
                <Col xl={3}>
                  <div className="mb-3">
                    <label htmlFor="statusReason" className="form-label fw-bold">Reason</label>
                    <div>{order.statusReason}</div>
                  </div>
                </Col>
              )}

            </Row>

            <Row>
              <Col xl={10}>

                <Dropdown>
                  <Dropdown.Toggle
                    variant={order.status === "REJECTED" ? "danger" : "secondary"}
                    id="dropdown-basic"
                  >
                    {getStatusOptions(order.type)
                      .find((el) => reduceString(el.value) === reduceString(order.status))?.label || order.status}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {getStatusOptions(order.type).map((statusOption, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => {
                          if (statusOption.value === "Rejected") {
                            handleOpenModal(order.id);
                          } else {
                            handleOrderStatus(order.id, statusOption.value);
                          }
                        }}
                      >
                        {statusOption.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>


              </Col>
              <Col xl={2} className="text-end hand" style={{ color: "#0C94EA" }} onClick={() => handleToggleExpand(order.id)}>
                Order Details
              </Col>
            </Row>
            <Collapse in={expandedOrderId === order.id}>
              <div>
                {detailLoadingOrderId === order.id ? (
                  <Loader />
                ) : (
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th>Order No</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.orderItems?.map((item: any) => (
                        <tr key={item.id}>
                          <td>{item.orderId}</td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>$ {item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Collapse>
          </Card.Body>
        </Card>
      ))}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reason for Rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter reason here"
            value={modalInput}
            onChange={(e) => setModalInput(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="px-4 save-btn"
            onClick={() => handleRejectOrder(orderValue)}           >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default UpcomingOrders;
