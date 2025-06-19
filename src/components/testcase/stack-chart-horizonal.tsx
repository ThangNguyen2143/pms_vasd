"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
  ChartDataLabels
);
type DataRaw = {
  label: string;
  [type: string]: number | string;
};
function StackBarChartHorizonal({
  data,
  type,
}: {
  data: DataRaw[];
  type: string[];
}) {
  const { labels, datasets } = useMemo(() => {
    const labels = data.map((d) => d.label);

    const dataMap: Record<string, number[]> = {};
    type.forEach((key) => {
      dataMap[key] = data.map((d) => Number(d[key]) || 0);
    });
    const colorMap = getRandomColorMap(type);

    const datasets = type.map((key) => ({
      label: key,
      data: dataMap[key],
      backgroundColor: colorMap[key] ?? "#9ca3af",
    }));
    return { labels, datasets };
  }, [data, type]);
  return (
    <Bar
      data={{ labels, datasets }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" as const },
          datalabels: {
            anchor: "center",
            align: "center",
            color: "#111827",
            font: { weight: "bold" as const, size: 11 },
            formatter: (val: number) => (val > 0 ? val : ""),
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      }}
    />
  );
}

export default StackBarChartHorizonal;
function getRandomColorMap(keys: string[]): Record<string, string> {
  const colorList = [
    "#facc15",
    "#10b981",
    "#a855f7",
    "#3b82f6",
    "#ef4444",
    "#6b7280",
    "#e11d48",
    "#0ea5e9",
    "#22d3ee",
    "#9ca3af",
    "#ec4899",
    "#8b5cf6",
    "#14b8a6",
    "#f97316",
    "#84cc16",
  ];

  const shuffled = [...colorList].sort(() => Math.random() - 0.5);

  const map: Record<string, string> = {};
  keys.forEach((key, index) => {
    map[key] = shuffled[index % shuffled.length];
  });

  return map;
}
