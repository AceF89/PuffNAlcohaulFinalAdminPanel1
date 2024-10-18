import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const StatsChart = (props: any) => {
  const { title, chartLevel } = props;
  const apexBarChartOpts: ApexOptions = {
    chart: {
      height: "80%",
      type: "pie",
      width: "10%",
    },
    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 0,
        },
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Properties",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },

    colors: ["#0C94EA", "#D83EE5"],
    labels: ["Snag", "Properties"],
    legend: {
      show: true,
      floating: false,
      fontSize: "10px",
      position: "bottom",
      offsetX: 2,
      offsetY: 2,
      labels: {
        useSeriesColors: true,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        horizontal: 7,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const apexBarChartOpts2: ApexOptions = {
    chart: {
      height: "100%",
      type: "pie",
      width: "10%",
    },
    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        startAngle: 50,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 10,
          minAngleToShowLabel: 0,
        },
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Customers",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#FF0000",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },

    colors: ["#0C94EA", "#3EE5BD"],
    labels: ["Active", "Inactive"],
    legend: {
      show: true,
      floating: false,
      fontSize: "10px",
      position: "bottom",
      // gap: "10px",
      offsetX: 2,
      offsetY: 2,
      labels: {
        useSeriesColors: true,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        horizontal: 7,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const apexBarChartData = [60, 30];
  const apexBarChartData2 = [80, 20];
  return (
    <Card className="shadow-none">
      <Card.Body>
        {/* <Dropdown className="float-end" align="end">
          <Dropdown.Toggle
            as="a"
            className="cursor-pointer arrow-none p-0 text-dark"
          >
            <i className="uil uil-ellipsis-v fs-13"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <i className="uil uil-refresh me-2"></i>Refresh Report
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="uil uil-export me-2"></i>Export Report
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}

        <h4 className="card-title header-title">{title}</h4>

        <div className="my-4" dir="ltr">
          <Chart
            options={apexBarChartOpts}
            series={apexBarChartData}
            type="donut"
            className="apex-charts"
            height={250}
            dir="ltr"
          />
          <Chart
            options={apexBarChartOpts2}
            series={apexBarChartData2}
            type="donut"
            className="apex-charts my-4"
            height={250}
            dir="ltr"
          />
        </div>

      </Card.Body>
    </Card>
  );
};

export default StatsChart;
