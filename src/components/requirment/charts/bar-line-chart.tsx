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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartByDate({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        type: "bar" as const,
        label: "Đã tạo",
        data: data.map((d) => d.created_count),
        backgroundColor: "#3b82f6",
      },
      {
        type: "line" as const,
        label: "Đã xử lý",
        data: data.map((d) => d.resolved_count),
        borderColor: "#f97316",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" as const } },
    ticks: {
      display: false, // ⬅ Ẩn hoàn toàn số liệu trên vòng tròn
      stepSize: 1,
      precision: 0, // ⬅ nếu bạn vẫn muốn hiện số, dùng cái này để tránh số thập phân
    },
  };

  return <Chart type="bar" data={chartData} options={options} />;
}
