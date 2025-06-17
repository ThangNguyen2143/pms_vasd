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

type SeverityStatus = {
  severity: string;
  status: string;
  count: number;
};

type Props = {
  data: SeverityStatus[];
};

export function StackedBarChart({ data }: Props) {
  const { labels, datasets } = useMemo(() => {
    const severitySet = new Set<string>();
    const statusSet = new Set<string>();

    data.forEach((item) => {
      severitySet.add(item.severity);
      statusSet.add(item.status);
    });

    const severitys = Array.from(severitySet);
    const statuses = Array.from(statusSet);

    // Khởi tạo dữ liệu cho từng status
    const statusDataMap: Record<string, number[]> = {};

    statuses.forEach((status) => {
      statusDataMap[status] = severitys.map((severity) => {
        const found = data.find(
          (d) => d.severity === severity && d.status === status
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
      labels: severitys.map((mod) => mod),
      datasets,
    };
  }, [data]);

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
          y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
        },
      }}
    />
  );
}

// 🎨 Gán màu theo status
function getStatusColorMap(): Record<string, string> {
  return {
    NEW: "#facc15",
    REJECTED: "#6b7280",
    INPROGRESS: "#0ea5e9",
    RESOLVED: "#3b82f6",
    CONFIRMED: "#6366f1",
    CLOSED: "#22c55e",
  };
}
