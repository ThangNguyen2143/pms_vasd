"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineController,
  LineElement,
  Tooltip,
  Legend
);
type DataChart = {
  date: string;
  bar_data: number;
  line_data: number;
};
export function ChartByDate({ data }: { data: DataChart[] }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        type: "bar" as const,
        label: "Đã tạo",
        data: data.map((d) => d.bar_data),
        backgroundColor: "#3b82f6",
        order: 2,
      },
      {
        type: "line" as const,
        label: "Đã xử lý",
        data: data.map((d) => d.line_data),
        borderColor: "#f97316",
        borderWidth: 2,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" as const } },
    scale: {
      y: {
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Chart type="bar" data={chartData} options={options} />;
}
