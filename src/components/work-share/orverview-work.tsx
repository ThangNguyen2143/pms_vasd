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
  Filler
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
  const radarDatasets = priorityList.map((prio) => {
    const counts = statusList.map(
      (st) =>
        dataRaw.filter((w) => w.priority === prio.code && w.status === st.code)
          .length
    );
    return {
      label: prio.display,
      data: counts,
      fill: true,
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
            },
          }}
        />
      </div>
      <div className="md:col-span-2 h-[400px] w-full flex justify-center items-center">
        <Radar
          data={radarData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Tương quan trạng thái & ưu tiên",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
