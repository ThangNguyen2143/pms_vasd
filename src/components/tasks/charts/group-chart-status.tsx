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
import { ProductModule } from "~/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
  ChartDataLabels
);

type TaskStatusByModule = {
  module: string;
  status: string;
  count: number;
};

type Props = {
  data: TaskStatusByModule[];
  moduleProduct: ProductModule[];
};

export function StackedBarChartByModule({ data, moduleProduct }: Props) {
  const { labels, datasets } = useMemo(() => {
    const moduleSet = new Set<string>();
    const statusSet = new Set<string>();

    data.forEach((item) => {
      moduleSet.add(item.module);
      statusSet.add(item.status);
    });

    const modules = Array.from(moduleSet);
    const statuses = Array.from(statusSet);

    // Khởi tạo dữ liệu cho từng status
    const statusDataMap: Record<string, number[]> = {};

    statuses.forEach((status) => {
      statusDataMap[status] = modules.map((module) => {
        const found = data.find(
          (d) => d.module === module && d.status === status
        );
        return found ? found.count : 0;
      });
    });

    const colorMap = getStatusColorMap();

    const datasets = statuses.map((status) => ({
      label: status,
      data: statusDataMap[status],
      backgroundColor: colorMap[status] ?? "#9ca3af",
    }));

    return {
      labels: modules.map((mod) => {
        const display = moduleProduct.find((mo) => mo.id == mod)?.display;
        return display ? display : mod;
      }),
      datasets,
    };
  }, [data, moduleProduct]);

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
          y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
        },
      }}
    />
  );
}

// 🎨 Gán màu theo status
function getStatusColorMap(): Record<string, string> {
  return {
    NEW: "#facc15",
    DONE: "#10b981",
    FAILED: "#ef4444",
    CANCELED: "#6b7280",
    INPROGRESS: "#0ea5e9",
    ASSIGNED: "#3b82f6",
    ACCEPTED: "#6366f1",
    CLARIFY: "#a855f7",
    CLOSED: "#22c55e",
    PROCESSED: "#14b8a6",
    UNABLE_TO_PROCESS: "#9ca3af",
  };
}
