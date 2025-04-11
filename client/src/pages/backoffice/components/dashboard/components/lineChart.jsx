// components/LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ chartData, desc, title }) {

  const options = {
    plugins: {
      title: {
        display: true,
        text: desc ?? ''
      },
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="w-full">
      {title && <h2 style={{ textAlign: "center" }}>{title}</h2>}
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
}
export default LineChart;