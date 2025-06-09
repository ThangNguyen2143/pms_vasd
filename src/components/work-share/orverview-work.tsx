// components/OverviewWork.tsx
"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Radar } from "react-chartjs-2";
import React from "react";
import { Priority, WorkShareDto, WorkStatus } from "~/lib/types";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels
);

export default function OverviewWork({
  priorityList,
  statusList,
  dataRaw,
}: {
  priorityList: Priority[];
  statusList: WorkStatus[];
  dataRaw: WorkShareDto[] | null;
}) {
  if (!dataRaw) return <p>Không có dữ liệu</p>;

  // === DATA ===
  const statusLabels = statusList.map((s) => s.display);
  const priorityLabels = priorityList.map((p) => p.display);

  // Đếm số lượng công việc theo trạng thái
  const statusCounts = statusList.map(
    (s) => dataRaw.filter((w) => w.status === s.code).length
  );

  // Đếm số lượng công việc theo mức độ ưu tiên
  const priorityCounts = priorityList.map(
    (p) => dataRaw.filter((w) => w.priority === p.code).length
  );

  // Biểu đồ radar: mỗi priority là 1 line, theo các status
  const radarDatasets = priorityList.map((prio, idx) => {
    const counts = statusList.map(
      (st) =>
        dataRaw.filter((w) => w.priority === prio.code && w.status === st.code)
          .length
    );
    const colors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ];
    const borderColors = colors.map((c) => c.replace("0.6", "1"));
    return {
      label: prio.display,
      data: counts,
      backgroundColor: colors[idx % colors.length],
      borderColor: borderColors[idx % borderColors.length],
      pointBorderColor: borderColors[idx % borderColors.length],
      pointBackgroundColor: "#fff",
      fill: true,
      tension: 0.3,
    };
  });

  // === CHART OPTIONS & DATA ===

  const barData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Số lượng",
        data: statusCounts,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: priorityLabels,
    datasets: [
      {
        label: "Số lượng",
        data: priorityCounts,
        backgroundColor: [
          "#FF6384",
          "#FFCE56",
          "#36A2EB",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const radarData = {
    labels: statusLabels,
    datasets: radarDatasets,
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="h-[300px] w-full">
        <Bar
          data={barData}
          options={{
            responsive: true,
            indexAxis: "y",
            plugins: {
              title: { display: true, text: "Trạng thái công việc" },
              legend: { display: false },
            },
          }}
        />
      </div>
      <div className="h-[300px] w-full">
        <Pie
          data={pieData}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: "Độ ưu tiên" },
              legend: { position: "right" },
              datalabels: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: (value: number, context: any) => {
                  if (value == 0) return null;
                  // const label = context.chart.data.labels[context.dataIndex];
                  const total = context.chart.data.datasets[0].data.reduce(
                    (acc: number, data: number) => acc + data,
                    0
                  );
                  const percentage = Math.round((value / total) * 100);
                  // Chỉ hiển thị nếu phần trăm đủ lớn
                  if (percentage < 20) return `${value} (${percentage}%)`;
                  return `${percentage}%`;
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            },
          }}
        />
      </div>
      <div className="md:col-span-2 h-[500px] w-full flex justify-center items-center">
        <Radar
          data={radarData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Tương quan trạng thái & ưu tiên",
              },
              legend: { position: "right" },
            },
          }}
        />
      </div>
    </div>
  );
}
