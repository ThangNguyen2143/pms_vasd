/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Bar } from "react-chartjs-2";
type RawItem = {
  type: string;
  status: string;
  count: number;
};

function groupChartDataByTypeAndStatus(data: RawItem[]) {
  const typeSet = new Set<string>();
  const statusSet = new Set<string>();

  // Gom tất cả type & status
  data.forEach((item) => {
    typeSet.add(item.type);
    statusSet.add(item.status);
  });

  const types = Array.from(typeSet);
  const statuses = Array.from(statusSet);

  // Khởi tạo map: { status: [counts per type] }
  const datasetMap: Record<string, number[]> = {};
  statuses.forEach((status) => {
    datasetMap[status] = Array(types.length).fill(0);
  });

  // Đổ dữ liệu vào map
  data.forEach(({ type, status, count }) => {
    const typeIndex = types.indexOf(type);
    if (typeIndex >= 0) {
      datasetMap[status][typeIndex] = count;
    }
  });

  // Tạo datasets cho Chart.js
  const datasets = statuses.map((status) => ({
    label: status,
    data: datasetMap[status],
    backgroundColor: getColorByStatus(status),
  }));

  return {
    labels: types,
    datasets,
  };
}

// Tùy chọn: Gán màu theo status
function getColorByStatus(status: string): string {
  const colorMap: Record<string, string> = {
    NEW: "#facc15",
    CLOSED: "#10b981",
    CLARIFY: "#a855f7",
    ACCEPTED: "#3b82f6",
    REJECTED: "#ef4444",
    CANCELED: "#6b7280",
    FAILED: "#e11d48",
    INPROGRESS: "#0ea5e9",
    PROCESSED: "#22d3ee",
    UNABLE_TO_PROCESS: "#9ca3af",
  };
  return colorMap[status] ?? "#a3a3a3";
}

export function ChartByType({ data }: { data: RawItem[] }) {
  const { labels, datasets } = groupChartDataByTypeAndStatus(data);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      datalabels: {
        color: "#fff",
        display: (context: any) => {
          const value = context.dataset.data[context.dataIndex];
          return value > 0;
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        ticks: {
          display: true,
          stepSize: 1,
          precision: 0, // ⬅ nếu bạn vẫn muốn hiện số, dùng cái này để tránh số thập phân
        },
      },
    },
  };

  return <Bar data={{ labels, datasets }} options={options} />;
}
