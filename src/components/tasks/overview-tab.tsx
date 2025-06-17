"use client";
import { useEffect, useState } from "react";
import ChartOverviewTask from "./charts";

type EnumTab = "taskByProduct" | "taskByDate";
function OverviewTab() {
  const [tabOverview, setTabOverview] = useState<EnumTab>("taskByProduct");
  const [paraTab, setParaTab] = useState<{
    product_id: boolean;
    warningHours: boolean;
    from: boolean;
    to: boolean;
  }>({ product_id: false, warningHours: false, to: false, from: false });
  useEffect(() => {
    switch (tabOverview) {
      case "taskByDate":
        //Lấy theo product_id, from, to
        setParaTab({
          product_id: true,
          warningHours: false,
          from: true,
          to: true,
        });
        break;
      case "taskByProduct":
        // Không có fillter. get by project_id
        setParaTab({
          product_id: true,
          from: false,
          to: false,
          warningHours: false,
        });
        break;
      default:
        break;
    }
  }, [tabOverview]);
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      {/* name of each tab group should be unique */}
      <div className="tabs tabs-box">
        <input
          type="radio"
          name="my_tabs_1"
          className="tab"
          aria-label="Theo phần mềm"
          defaultChecked
          onClick={() => setTabOverview("taskByProduct")}
        />
        <input
          type="radio"
          name="my_tabs_1"
          className="tab"
          aria-label="Theo ngày"
          onClick={() => setTabOverview("taskByDate")}
        />
      </div>
      <ChartOverviewTask tab={tabOverview} paraTab={paraTab} />
    </div>
  );
}

export default OverviewTab;
