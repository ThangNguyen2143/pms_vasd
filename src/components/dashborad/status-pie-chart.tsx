"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type SummaryData = {
  [key: string]: number;
  total: number;
};

type StatusPieChartProps = {
  title: string;
  data: SummaryData;
  colorMap?: Record<string, string>; // Optional custom color
};

const defaultColors = [
  "#4ade80", // green
  "#60a5fa", // blue
  "#facc15", // yellow
  "#f87171", // red
  "#a78bfa", // purple
  "#34d399", // teal
  "#fb923c", // orange
  "#818cf8", // indigo
];

export default function StatusPieChart({
  title,
  data,
  colorMap,
}: StatusPieChartProps) {
  if (!data || !data.total || data.total === 0) {
    return (
      <div className="bg-base-200 p-4 rounded-lg shadow text-center w-full md:w-64">
        <h3 className="font-bold text-lg text-primary mb-2">{title}</h3>
        <p className="text-sm text-gray-500 italic">Không có dữ liệu</p>
      </div>
    );
  }

  const labels = Object.keys(data).filter((key) => key !== "total");
  const values = labels.map((key) => data[key]);

  const pieData = {
    labels,
    datasets: [
      {
        label: "Số lượng",
        data: values,
        backgroundColor: labels.map(
          (_, i) =>
            colorMap?.[labels[i]] || defaultColors[i % defaultColors.length]
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow text-center w-full md:w-64">
      <h3 className="font-bold text-lg text-primary mb-4">{title}</h3>
      <Pie data={pieData} options={options} />
    </div>
  );
}
