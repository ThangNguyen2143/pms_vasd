/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { Config, StatistPara } from "~/lib/types";
import { toISOString } from "~/utils/fomat-date";
import DateTimePicker from "../ui/date-time-picker";

function TableStatist({
  config,
  fetchData,
}: {
  config: Config;
  fetchData: (
    paras: StatistPara[],
    extraParams?: Record<string, any>
  ) => Promise<any[] | null>;
}) {
  const hasFrom = config.statisticParas.some(
    (p) => p.field === "from" && p.type === "datetime"
  );
  const hasTo = config.statisticParas.some(
    (p) => p.field === "to" && p.type === "datetime"
  );

  const [fromDate, setFromDate] = useState<string>(
    toISOString(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, setToDate] = useState<string>(
    toISOString(new Date().toString())
  );
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) return;
    const loadData = async () => {
      setLoading(true);
      const extra: Record<string, any> = {};

      if (hasFrom) extra["from"] = toISOString(fromDate);
      if (hasTo) extra["to"] = toISOString(toDate);

      const res = await fetchData(config.statisticParas, extra);
      if (res != null) setData(res);
      else setData([]);
      setLoading(false);
    };
    loadData();
  }, [config, fromDate, toDate]);
  if (!config) return <div>Không tải được dữ liệu</div>;
  return (
    <div className="my-6 p-4 mx-2 rounded-lg bg-base-100 shadow-md">
      <h2 className="text-xl font-bold mb-4">{config.name}</h2>
      {(hasFrom || hasTo) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {hasFrom && (
            <div>
              <label className="label">
                <span className="label-text">Từ ngày</span>
              </label>
              <DateTimePicker
                value={fromDate}
                onChange={setFromDate}
                className="w-full"
              />
            </div>
          )}
          {hasTo && (
            <div>
              <label className="label">
                <span className="label-text">Đến ngày</span>
              </label>
              <DateTimePicker
                value={toDate}
                onChange={setToDate}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {config.statisticColumns.map((col) => (
                  <th key={col.code}>{col.display}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <tr key={idx}>
                    {config.statisticColumns.map((col) => (
                      <td key={col.code}>{row[col.code] ?? "-"}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={config.statisticColumns.length}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default TableStatist;
