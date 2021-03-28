import React, { Component } from 'react'
import ReactApexChart from 'react-apexcharts'
import "./Charts.scss"


class Charts extends Component {
    
  state = {
    series: [],
    options: {
      chart: {
        id: 'realtime',
        height: 600,
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'category',
        min: 0,
        range: 10,
        title: {
          text: "Time",
          style: {
            fontSize: "14px",
            color: "#d1d4dc"
          },
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: "Viewers",
          style: {
            fontSize: "14px",
            color: "#d1d4dc"
          },
        },
        labels: {
          style: {
            colors: "#d1d4dc"
          },
        },
      },
      legend: {
        show: true,
        fontSize: "12px",
        fontWeight: 600,
        labels: {
          colors: "#d1d4dc"
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0
      },
      },
    }, 
  };
    
  render() {
      return (
        <React.Fragment>
          <div className={"chartTitle"}> Viewer count of Dota 2 (the best game of all time), Rocket League and HearthStone </div>
          <div id="chart">
              <ReactApexChart options={this.state.options} series={this.props.series} type="line" height={500} />
          </div>
        </React.Fragment>
      )
  }
}
 
export default Charts

