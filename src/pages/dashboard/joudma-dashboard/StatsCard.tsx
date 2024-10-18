import React from "react";
import { Card } from "react-bootstrap";
import classNames from "classnames";

interface StatsCard {
  title?: string;
  stats?: string;
  icon?:string;
  className?:string;
  cardClass?:string;
  textClass?:string;
}

const StatsCard = ({
  title,
  stats,
  icon,
  className,
  cardClass,
  textClass
}: StatsCard) => {
  //  default options

  return (
    <Card className={`${cardClass}`}>
      <Card.Body>
        <div className="d-flex">
          <div className="flex-grow-1">
            <span className={`${textClass?textClass:'text-muted'} text-uppercase fw-bold fs-12`}>
              {title}
            </span>
            <h3 className={`${textClass?textClass:'text-muted'} mb-0`}>{stats}</h3>
          </div>
          <div className={`align-self-center flex-shrink-0 ${className}`} >
            <span className={classNames("fw-bold", "fs-13")}>
              {/* <i className={trend.icon}></i> {trend.value} */}
              <img src={`./${icon}`}/>
             <div>
            
             </div>
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;
