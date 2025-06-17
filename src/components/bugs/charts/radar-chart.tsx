"use client";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type UserRadarStat = {
  user_id: number;
  user_name: string;
  total_assigned: number;
  resolved_on_time: number;
  resolved_late: number;
  unresolved_late: number;
};

type Props = {
  data: UserRadarStat[];
};

export function RadarChartByUser({ data }: Props) {
  const { labels, datasets } = useMemo(() => {
    const labels = ["Đúng hạn", "Trễ hạn (đã xử lý)", "Trễ hạn (chưa xử lý)"];

    const datasets = data.map((user, index) => ({
      label: user.user_name,
      data: [user.resolved_on_time, user.resolved_late, user.unresolved_late],
      fill: true,
      backgroundColor: getColor(index, 0.2),
      borderColor: getColor(index),
      pointBackgroundColor: getColor(index),
    }));

    return { labels, datasets };
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
      },
    },
  };

  return <Radar data={{ labels, datasets }} options={options} />;
}

// 🎨 Tạo màu khác nhau cho từng người
function getColor(index: number, alpha = 1): string {
  const colors = [
    "rgba(59, 130, 246,", // blue-500
    "rgba(16, 185, 129,", // green-500
    "rgba(234, 179, 8,", // yellow-500
    "rgba(244, 63, 94,", // red-500
    "rgba(168, 85, 247,", // purple-500
  ];
  const base = colors[index % colors.length];
  return `${base}${alpha})`;
}
