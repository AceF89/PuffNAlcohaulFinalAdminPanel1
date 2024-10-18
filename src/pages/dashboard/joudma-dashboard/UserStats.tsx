import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import DriverStatsCard from "./StatsCard";



const UserStats = ()=>{

  return (

      <div>
      <Row>
			<Col>
				<div className="page-title-box">
					<div style={{display:'block' , color:"#314559"}}>
						<h4 className="page-title text-muted">Users</h4>
					</div>
          </div>

			</Col>
		</Row>
 <Row>
   <Col sm={6} xl={3}>
     <DriverStatsCard
       title="Total Users"
       stats="200"
       icon='./dashboard/users-three-light-white-4.svg'
       className = 'award-card-icon card-icon'
       cardClass="driver-card"
       textClass='text-white'

     />
   </Col>

   <Col sm={6} xl={3}>
     <DriverStatsCard
       title="Active Users "
       stats="70"
       icon='./dashboard/user-tick-outline_white-5.svg'
       className = 'award-card-icon'
     />
   </Col>
   <Col sm={6} xl={3}>
     <DriverStatsCard
       title="Inactive users"
       stats="130"
       icon='./dashboard/user-x-line-6.svg'
       className = 'award-card-icon'
       
     />
   </Col>
 </Row>
</div>
  );
};

export default UserStats;








