"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
);
type DataChart = {
  label: string;
  value: number;
};
export function ChartByLocation({
  name,
  data,
}: {
  name: string;
  data: DataChart[];
}) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Số lượng",
        data: data.map((d) => d.value),
        backgroundColor: [
          "#0505fa",
          "#70eb13",
          "#13ebd9",
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
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      title: { display: true, text: name },
      legend: { display: false },
    },
    scale: {
      x: {
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
