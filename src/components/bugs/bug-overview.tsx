/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { ChartByDate } from "../requirment/charts/bar-line-chart";
import DateTimePicker from "../ui/date-time-picker";
import { encodeBase64 } from "~/lib/services";
import { useApi } from "~/hooks/use-api";
import { toISOString } from "~/utils/fomat-date";
import { endOfDay, startOfDay, subDays } from "date-fns";
import GroupProductToChart from "./charts/group-product-to-chart";
import { RadarChartByUser } from "./charts/radar-chart";

// Tổng quan gồm 3 loại: Trạng thái và độ ảnh hưởng (bar), tiến trình xử lý bug (pie), bydate (line+bar)

function BugOverview() {
  const { data: dataOverViewDate, getData: getOvvDate } =
    useApi<{ date: string; bug_reported: number; bug_resolved: number }[]>();
  const { data: dataOverViewStatus, getData: getOvvStatus } = useApi<
    {
      product_id: string;
      severity: string;
      status: string;
      count: number;
    }[]
  >();
  const { data: dataOverViewHanling, getData: getOvvHandling } = useApi<
    {
      user_id: number;
      user_name: string;
      total_assigned: number;
      resolved_on_time: number;
      resolved_late: number;
      unresolved_late: number;
    }[]
  >();
  const [fromDate, setFromDate] = useState<string>(
    toISOString(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, settoDate] = useState<string>(
    toISOString(endOfDay(new Date()))
  );
  const { data: productList, getData: getProducts } =
    useApi<{ id: string; name: string }[]>();
  useEffect(() => {
    const fetchData = async () => {
      await getOvvDate(
        "/bugs/overview/" +
          encodeBase64({
            type: "bug_trend",
            from: toISOString(fromDate),
            to: toISOString(toDate),
          }),
        "reload"
      );
      await getOvvStatus(
        "/bugs/overview/" +
          encodeBase64({
            type: "severity_status",
            from: toISOString(fromDate),
            to: toISOString(toDate),
          }),
        "reload"
      );
      await getOvvHandling(
        "/bugs/overview/" +
          encodeBase64({
            type: "handling_progress",
            from: toISOString(fromDate),
            to: toISOString(toDate),
          }),
        "reload"
      );
    };
    fetchData();
  }, [toDate, fromDate]);
  useEffect(() => {
    getProducts("/system/config/" + encodeBase64({ type: "product" }));
  }, []);
  return (
    <div className="flex flex-col p-2">
      <div className="flex gap-2">
        <div className="flex">
          <span className="label">Từ</span>
          <DateTimePicker
            value={fromDate}
            onChange={setFromDate}
            className="w-full"
          />
        </div>

        <div className="flex">
          <span className="label">Đến</span>
          <DateTimePicker
            value={toDate}
            onChange={settoDate}
            className="w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 p-5">
        <div>
          <h3 className="text-xl font-bold">
            Thống kê tình trạng bug theo từng phần mềm
          </h3>
          {/* Điều chỉnh lại dữ liệu */}
          <GroupProductToChart
            data={dataOverViewStatus || []}
            getProductName={(id) =>
              productList?.find((pd) => pd.id == id)?.name || "Phần mềm " + id
            }
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">Thống kê tiến trình xử lý bug</h3>
          <div className="h-[500px] w-full flex justify-center items-center">
            <RadarChartByUser data={dataOverViewHanling || []} />
            <div>
              Số lượng bug được giao
              <ul className="list">
                {dataOverViewHanling?.map((us) => (
                  <li
                    key={us.user_id + "total_bug"}
                    className="list-row flex justify-between"
                  >
                    <span>{us.user_name}</span> <span>{us.total_assigned}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">Bug theo thời gian</h3>
          <div className="h-[500px] w-full flex justify-center items-center">
            <ChartByDate
              data={
                dataOverViewDate
                  ? dataOverViewDate.map((d) => ({
                      date: d.date,
                      bar_data: d.bug_reported,
                      line_data: d.bug_resolved,
                    }))
                  : []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BugOverview;
