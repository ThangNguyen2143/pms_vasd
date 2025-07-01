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

    const datasets = type.map((key) => ({
      label: key,
      data: dataMap[key],
      backgroundColor: key == "testcase_created" ? "#0d1ae6" : "#49f304",
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
