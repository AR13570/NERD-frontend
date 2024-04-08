import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme, ThemeProvider } from "@mui/material/styles";

export default function PerfHistogram({ data }) {
  const marks = data.map((item) => item.mark);
  const frequencies = data.map((item) => item.frequency);
  const theme = useTheme();

  return (
    <BarChart
      width={500}
      height={300}
      series={[
        {
          data: frequencies,
          color: "lightblue",
          label: "Frequency",
          id: "frequency",
        },
      ]}
      xAxis={[{ data: marks, scaleType: "band" }]}
      yAxis={[{ type: "number", scaleType: "linear", position: "left" }]}
    />
  );
}
