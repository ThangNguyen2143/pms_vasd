/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export type DataRaw = {
  label: string;
  [type: string]: number | string;
};

type Props = {
  data: DataRaw[];
  valueKey: string; // thay vì type[], dùng 1 key duy nhất như "count"
};

function getRandomColorList(length: number): string[] {
  const baseColors = [
    "#3b82f6",
    "#10b981",
    "#facc15",
    "#ef4444",
    "#a855f7",
    "#e11d48",
    "#0ea5e9",
    "#22d3ee",
    "#6b7280",
    "#9ca3af",
  ];
  const shuffled = [...baseColors].sort(() => Math.random() - 0.5);
  return Array.from({ length }, (_, i) => shuffled[i % shuffled.length]);
}

export default function PieChartComp({ data, valueKey }: Props) {
  const { labels, dataset } = useMemo(() => {
    const labels = data.map((d) => d.label);
    const values = data.map((d) => Number(d[valueKey]) || 0);
    const backgroundColor = getRandomColorList(values.length);

    return {
      labels,
      dataset: {
        data: values,
        backgroundColor,
        borderWidth: 1,
      },
    };
  }, [data, valueKey]);
  console.log(dataset, labels);
  return (
    <Pie
      data={{ labels, datasets: [dataset] }}
      options={{
        responsive: true,
        plugins: {
          title: { display: true, text: "Tỉ lệ kết quả" },
          legend: { position: "right" as const },
          datalabels: {
            color: "#fff",
            font: { weight: "bold", size: 10 },
            formatter: (value: number, context: any) => {
              const total = context.chart.data.datasets[0].data.reduce(
                (acc: number, val: number) => acc + val,
                0
              );
              const percent = Math.round((value / total) * 100);
              return percent > 0 ? `${percent}%` : "";
            },
            display: (context: any) => {
              const value = context.dataset.data[context.dataIndex];
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              return value / total > 0.1;
            },
          },
        },
      }}
    />
  );
}
