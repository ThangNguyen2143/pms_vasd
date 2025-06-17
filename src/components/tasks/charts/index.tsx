/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { endOfDay, startOfDay, subDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { ChartByDate } from "~/components/requirment/charts/bar-line-chart";
import DateTimePicker from "~/components/ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductModule, ProjectMember } from "~/lib/types";
import { toISOString } from "~/utils/fomat-date";
import { StackedBarChartByModule } from "./group-chart-status";
import { ChartByStatus } from "~/components/requirment/charts/vertical-chart";
import { ChartByLocation } from "~/components/requirment/charts/horizonal-chart";

type EnumTab = "taskByProduct" | "taskByDate";
interface ChartOverviewProps {
  tab: EnumTab;
  paraTab: {
    product_id: boolean;
    warningHours: boolean;
    from: boolean;
    to: boolean;
  };
}
function ChartOverviewTask({ tab, paraTab }: ChartOverviewProps) {
  const { data: dataOverView, getData } = useApi<any[]>();
  const { data: dataOverView1, getData: getData1 } = useApi<any[]>();
  const [fromDate, setFromDate] = useState<string>(
    toISOString(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, settoDate] = useState<string>(
    toISOString(endOfDay(new Date()))
  );
  const [productSelect, setproductSelect] = useState<string>("");

  const { data: moduleProduct, getData: getModules } =
    useApi<ProductModule[]>();
  const { data: productList, getData: getProducts } = useApi<ProjectMember[]>();
  const titleReport = useRef("");

  useEffect(() => {
    const fetchData = async () => {
      if (
        tab == "taskByDate" &&
        paraTab.from &&
        paraTab.to &&
        paraTab.product_id
      ) {
        await getData(
          "/tasks/overview/" +
            encodeBase64({
              type: "task_progress",
              product_id: productSelect,
              from: toISOString(fromDate),
              to: toISOString(toDate),
            }),
          "reload"
        );
        await getData1(
          "/tasks/overview/" +
            encodeBase64({
              type: "task_count",
              product_id: productSelect,
              from: toISOString(fromDate),
              to: toISOString(toDate),
            }),
          "reload"
        );
      }
      if (tab == "taskByProduct" && productSelect != "") {
        await getModules(
          "/product/" +
            encodeBase64({ type: "module", product_id: productSelect })
        );
        await getData(
          "/tasks/overview/" +
            encodeBase64({
              type: "overview_status",
              product_id: productSelect,
            }),
          "reload"
        );
        await getData1(
          "/tasks/overview/" +
            encodeBase64({
              type: "module_status",
              product_id: productSelect,
            }),
          "reload"
        );
      }
    };
    fetchData();
    switch (tab) {
      case "taskByDate":
        //Lấy theo product_id, from, to
        titleReport.current = "Thống kê task theo thời gian";
        break;
      case "taskByProduct":
        // Không có fillter. get by project_id
        titleReport.current = "Thống kê task theo phần mềm";
        break;
      default:
        break;
    }
  }, [tab, productSelect, toDate, fromDate, paraTab]);
  useEffect(() => {
    getProducts("/system/config/" + encodeBase64({ type: "product" }));
  }, []);
  return (
    <div className="flex flex-col p-2">
      <h3 className="text-center font-bold">{titleReport.current}</h3>
      <div className="flex gap-2">
        {paraTab.product_id && (
          <select
            className="select w-fit"
            name="product"
            value={productSelect}
            onChange={(e) => setproductSelect(e.target.value)}
          >
            <option value="" disabled>
              Chọn phần mềm
            </option>
            {productList?.map((pd) => (
              <option value={pd.id} key={"product_" + pd.id}>
                {pd.name}
              </option>
            ))}
          </select>
        )}
        {paraTab.from && (
          <div className="flex">
            <span className="label">Từ</span>
            <DateTimePicker
              value={fromDate}
              onChange={setFromDate}
              className="w-full"
            />
          </div>
        )}
        {paraTab.to && (
          <div className="flex">
            <span className="label">Đến</span>
            <DateTimePicker
              value={toDate}
              onChange={settoDate}
              className="w-full"
            />
          </div>
        )}
      </div>
      {tab == "taskByProduct" && productSelect != "" && (
        <div className="grid grid-cols-2">
          <div>
            <ChartByStatus data={dataOverView || []} />
          </div>
          <div>
            <StackedBarChartByModule
              data={dataOverView1 || []}
              moduleProduct={moduleProduct || []}
            />
          </div>
        </div>
      )}
      {tab == "taskByDate" && productSelect != "" && (
        <div className="grid grid-cols-1">
          <div className="h-[500px] w-full flex justify-center items-center">
            <ChartByDate
              data={
                dataOverView
                  ? dataOverView.map((d) => ({
                      date: d.date,
                      bar_data: d.created_count,
                      line_data: d.done_count,
                    }))
                  : []
              }
            />
          </div>
          <div className="h-[500px] w-full flex justify-center items-center">
            {/* <TaskCountByUser data={dataOverView1 || []} />
             */}
            <ChartByLocation
              data={
                dataOverView1
                  ? dataOverView1.map((d) => ({
                      label: d.name,
                      value: d.task_count,
                    }))
                  : []
              }
              name="Số lượng công việc theo từng thành viên"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartOverviewTask;
