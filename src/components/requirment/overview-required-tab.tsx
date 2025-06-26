"use client";

import { useEffect, useState } from "react";
import ChartOverviewRequirement from "./charts";
type EnumTab = "reqByLocation" | "reqByStatus" | "reqByDate" | "reqByType";
function OverviewRequirement() {
  const [tabOverview, setTabOverview] = useState<EnumTab>("reqByLocation");
  const [paraTab, setParaTab] = useState<{
    product_id: boolean;
    project_id: boolean;
    from: boolean;
    to: boolean;
  }>({ product_id: false, project_id: false, to: false, from: false });
  useEffect(() => {
    switch (tabOverview) {
      case "reqByDate":
        //Lấy theo product_id, from, to
        setParaTab({
          product_id: true,
          from: true,
          to: true,
          project_id: false,
        });
        break;
      case "reqByLocation":
        // Không có fillter. get by project_id
        setParaTab({
          product_id: false,
          from: false,
          to: false,
          project_id: true,
        }); //Chưa set mặc định
        break;
      case "reqByStatus":
        //Lấy theo product_id
        setParaTab({
          product_id: true,
          from: false,
          to: false,
          project_id: false,
        });
        break;
      case "reqByType":
        //Lấy theo product_id
        setParaTab({
          product_id: true,
          from: false,
          to: false,
          project_id: false,
        });
        break;
      default:
        break;
    }
  }, [tabOverview]);
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <div className="tabs tabs-box">
        <input
          type="radio"
          name="my_tabs_1"
          className="tab"
          aria-label="Số lượng yêu cầu theo khoa"
          defaultChecked
          onClick={() => setTabOverview("reqByLocation")}
        />
        <input
          type="radio"
          name="my_tabs_1"
          className="tab"
          aria-label="Số lượng yêu cầu theo trạng thái"
          onClick={() => setTabOverview("reqByStatus")}
        />
        <input
          type="radio"
          name="my_tabs_1"
          className="tab"
          aria-label="Tỉ lệ xử lý yêu cầu theo ngày"
          onClick={() => setTabOverview("reqByDate")}
        />
        <input
          type="radio"
          name="my_tabs_1"
          className="tab"
          aria-label="Số lượng yêu cầu theo loại"
          onClick={() => setTabOverview("reqByType")}
        />
      </div>
      <ChartOverviewRequirement tab={tabOverview} paraTab={paraTab} />
    </div>
  );
}
export default OverviewRequirement;
