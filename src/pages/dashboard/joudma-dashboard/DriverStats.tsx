import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import DriverStatsCard from "./StatsCard";



const DriverStats = ()=>{

  return (

  <div>
    	<Row>
			<Col>
				<div className="page-title-box">
					<div style={{display:'block' , color:"#314559"}}>
						<h4 className="page-title text-muted">Drivers</h4>
					</div>
          </div>

			</Col>
		</Row>

        
 <Row>
   <Col sm={6} xl={3}>
     <DriverStatsCard
       title="Approved Drivers"
       stats="100"
       icon='./dashboard/dash-car-1.svg'
       className="award-card-icon card-icon"
       cardClass="driver-card"
       textClass="text-white"
     />
   </Col>

   <Col sm={6} xl={3}>
     <DriverStatsCard
       title="Active Drivers"
       stats="80"       
       icon='./dashboard/user-pin-line-white-2.svg'
       className="award-card-icon"
   
     />
   </Col>
   <Col sm={6} xl={3}>
     <DriverStatsCard
       title="Unapproved Drivers"
       stats="20"
       icon='./dashboard/user-x-line-white-3.svg'
       className="award-card-icon"
       
     />
   </Col>
 </Row>
</div>

  );
};

export default DriverStats;








