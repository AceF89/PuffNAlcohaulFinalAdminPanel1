import React, { useState } from "react";
import { Row, Col, Dropdown, ButtonGroup } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";

// components
import Datepicker from "../../../components/Datepicker";
import DriverStats from "./DriverStats";
import UserStats from "./UserStats";
import StatsChart from "./StatsChart";



const JoudmaDashboard = () => {
    const [dateRange, setDateRange] = useState<any>([
        new Date(),
        new Date().setDate(new Date().getDate() + 7),
    ]);
    const [startDate, endDate] = dateRange;

    /*
     * handle date change
     */
    const onDateChange = (date: Date) => {
        if (date) {
            setDateRange(date);
        }
    };

    return (
        <>
            <Row>
                <Col xl={12} className="text-center">
                    <div className="page-title-box justify-content-center">
                        <h4 className="page-title hassle-free">Dashboard</h4>
                    </div>
                </Col>
            </Row>


            <Row>
                <Col xl={12}>
                    <DriverStats />
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <UserStats />
                </Col>
            </Row>

            <Row className="mt-5">
                <Col lg={6} xl={4}>
                    <StatsChart title="Driver Statistics"  chartLevel="Total Driver"/>
                </Col>
                <Col lg={6} xl={4}>
                    <StatsChart title="User Statistics" chartLevel = "Total User"/>
                </Col>
            </Row>



        </>
    );
};

export default JoudmaDashboard;
