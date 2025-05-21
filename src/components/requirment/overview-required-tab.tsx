"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);
function OverviewRequirement() {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold text-primary mb-4">
        📊 Thống kê yêu cầu theo phòng ban
      </h3>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Dev code....</h1>
            <p className="py-6">
              Chức năng tạm thời đang phát triển. Liên hệ với nhà phát triển để
              biết thêm chi tiết
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OverviewRequirement;
