import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PerfHistogram({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const marks = data.map((item) => item.mark);
    const frequencies = data.map((item) => item.frequency);

    const ctx = chartRef.current.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: marks,
        datasets: [
          {
            label: "Frequency",
            data: frequencies,
            backgroundColor: "white",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "white",
              
            },
          },
        },
        scales: {
          x: {
            title: {
              color: "white",
              display: true,
              text: "Marks",
            },
            type: "category",
            ticks: {
              color: "white",
            },
            border: {
              color: "white",
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              color: "white",
              display: true,
              text: "Frequency",
            },
            type: "linear",
            ticks: {
              color: "white",
            },
            border: {
              color: "white",
            },
            position: "left",
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, []);
  console.log(data);
  return (
    <canvas
      ref={chartRef}
      width={500}
      height={300}
      className="mx-8 my-8"
    ></canvas>
  );
}
