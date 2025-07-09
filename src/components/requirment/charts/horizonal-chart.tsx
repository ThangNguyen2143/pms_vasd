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
import { useMemo } from "react";

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
  const { labels, datasets } = useMemo(() => {
    const colorMap = getStatusColorMap();

    const datasets = [
      {
        label: "Số lượng",
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => colorMap[d.label] ?? "#10a4d0"),
      },
    ];

    return {
      labels: data.map((mod) => mod.label),
      datasets,
    };
  }, [data]);

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

  return <Bar data={{ labels, datasets }} options={options} />;
}

function getStatusColorMap(): Record<string, string> {
  return {
    CLARIFY: "#0505fa",

    NEW: "#70eb13",

    ACCEPTED: "#13ebd9",

    CLOSED: "#ed0505",

    REJECTED: "#f1f507",

    CANCELED: "#4e00c2",

    FAILED: "#fa1b96",

    INPROGRESS: "#09e68d",

    PROCESSED: "#5604d1",

    UNABLE_TO_PROCESS: "#f58b00",
  };
}
