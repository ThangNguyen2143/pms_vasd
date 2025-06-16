"use client";

import clsx from "clsx";
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
      <div className="drawer lg:drawer-open">
        <input
          id="requirment-overview-draw"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex flex-col">
          {/* Page content here */}
          <label
            htmlFor="requirment-overview-draw"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Mở
          </label>
          {/* Chart here */}
          <ChartOverviewRequirement tab={tabOverview} paraTab={paraTab} />
        </div>
        <div className="drawer-side">
          <label
            htmlFor="requirment-overview-draw"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li onClick={() => setTabOverview("reqByLocation")}>
              <a
                className={clsx(
                  "flex",
                  "truncate max-w-[300px]",
                  tabOverview == "reqByLocation" ? "menu-active" : ""
                )}
              >
                Số lượng yêu cầu theo khoa
              </a>
            </li>
            <li onClick={() => setTabOverview("reqByStatus")}>
              <a
                className={clsx(
                  "flex",
                  "truncate max-w-[300px]",
                  tabOverview == "reqByStatus" ? "menu-active" : ""
                )}
              >
                Số lượng yêu cầu theo trạng thái
              </a>
            </li>
            <li onClick={() => setTabOverview("reqByDate")}>
              <a
                className={clsx(
                  "flex",
                  "truncate max-w-[300px]",
                  tabOverview == "reqByDate" ? "menu-active" : ""
                )}
              >
                Tỉ lệ xử lý yêu cầu theo ngày
              </a>
            </li>
            <li onClick={() => setTabOverview("reqByType")}>
              <a
                className={clsx(
                  "flex",
                  "truncate max-w-[300px]",
                  tabOverview == "reqByType" ? "menu-active" : ""
                )}
              >
                Số lượng yêu cầu theo loại
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default OverviewRequirement;
