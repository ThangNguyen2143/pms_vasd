"use client";
import { Bar } from "react-chartjs-2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartByStatus({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((d) => d.status),
    datasets: [
      {
        label: "Số lượng",
        data: data.map((d) => d.count),
        backgroundColor: [
          "#0505fa",
          "#c2af7c",
          "#26484a",
          "#ed0505",
          "#f1f507",
          "#4e00c2",
          "#fa1b96",
          "#09e68d",
          "#5604d1",
          "#f58b00",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#fff",
      },
    },
    scale: {
      y: {
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
