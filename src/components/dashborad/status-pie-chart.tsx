/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Đăng ký các thành phần và plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type SummaryData = {
  [key: string]: number;
  total: number;
};

type StatusPieChartProps = {
  title: string;
  data: SummaryData;
  colorMap?: Record<string, string>;
  labelMap?: Record<string, string>;
};
type ChartOptions = React.ComponentProps<typeof Pie>["options"] & {
  plugins: {
    datalabels: {
      formatter: (value: number, context: any) => string | null;
      color: string;
      font: {
        weight: string;
        size: number;
      };
    };
  };
};

const defaultColors = [
  "#4ade80", // green
  "#60a5fa", // blue
  "#facc15", // yellow
  "#f87171", // red
  "#a78bfa", // purple
  "#34d399", // emerald
  "#fb923c", // orange
  "#818cf8", // indigo
  "#ec4899", // pink
  "#22d3ee", // cyan
  "#f97316", // deep orange
  "#10b981", // teal
  "#eab308", // amber
];

export default function StatusPieChart({
  title,
  data,
  colorMap,
  labelMap = {},
}: StatusPieChartProps) {
  if (!data?.total) {
    return (
      <div className="bg-base-200 p-4 rounded-lg shadow text-center w-full md:w-64">
        <h3 className="font-bold text-lg text-primary mb-2">{title}</h3>
        <p className="text-sm text-gray-500 italic">Không có dữ liệu</p>
      </div>
    );
  }

  const labels = Object.keys(data).filter((key) => key !== "total");
  const translatedLabels = labels.map((label) => labelMap[label] || label);
  const values = labels.map((key) => data[key]);

  const pieData = {
    labels: translatedLabels,
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

  const options: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        formatter: (value: number, context: any) => {
          if (value == 0) return null;
          const label = context.chart.data.labels[context.dataIndex];
          const total = context.chart.data.datasets[0].data.reduce(
            (acc: number, data: number) => acc + data,
            0
          );
          const percentage = Math.round((value / total) * 100);
          // Chỉ hiển thị nếu phần trăm đủ lớn
          if (percentage < 20) return `${value} (${percentage}%)`;
          return `${label}\n${value} (${percentage}%)`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 10,
        },
        anchor: "center", // Hiển thị ở trung tâm mỗi phần
        align: "center" as const,
        offset: 0,
        padding: {
          top: 5,
          bottom: 5,
          left: 5,
          right: 5,
        },
        display: (context: any) => {
          // Tự động ẩn label nếu phần quá nhỏ
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce(
            (acc: number, data: number) => acc + data,
            0
          );
          return value / total > 0.15; // Chỉ hiển thị nếu >15%
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = (context.raw as number) || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow text-center w-full md:w-64">
      <h3 className="font-bold text-lg text-primary mb-4">{title}</h3>
      <p className="font-bold text-md  mb-4">
        Tổng: <i> {data.total}</i>
      </p>
      <Pie data={pieData} options={options} />
    </div>
  );
}
