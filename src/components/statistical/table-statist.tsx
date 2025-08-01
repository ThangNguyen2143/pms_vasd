/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { Config, ProjectMember, StatistPara, UserDto } from "~/lib/types";
import DateTimePicker from "../ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { format_date } from "~/utils/fomat-date";
import { endOfDay, startOfDay, subDays } from "date-fns";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function TableStatist({
  config,
  fetchData,
  filterParas,
  setFilterParas,
}: {
  config: Config;
  fetchData: (
    paras: StatistPara[],
    extraParams?: Record<string, any>
  ) => Promise<any[] | null>;
  filterParas: Record<string, any>;
  setFilterParas: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) {
  const hasFrom = config.statisticParas.some(
    (p) => p.field === "from" && p.type === "datetime"
  );
  const hasTo = config.statisticParas.some(
    (p) => p.field === "to" && p.type === "datetime"
  );
  const hasProduct = config.statisticParas.some(
    (p) => p.field == "product_id" && p.type === "string"
  );
  const hasProject = config.statisticParas.some(
    (p) => p.field == "project_id" && p.type === "int"
  );
  const hasUser = config.statisticParas.some(
    (p) => p.field == "user_id" && p.type === "int"
  );
  useEffect(() => {
    if (hasFrom && !filterParas["from"]) {
      setFilterParas((pre) => ({
        ...pre,
        from: format_date(startOfDay(subDays(new Date(), 7))),
      }));
    }
    if (hasTo && !filterParas["to"]) {
      setFilterParas((pre) => ({
        ...pre,
        to: format_date(endOfDay(new Date())),
      }));
    }
    if (hasProject && !filterParas["project_id"]) {
      setFilterParas((pre) => ({ ...pre, project_id: 0 }));
    }
    if (hasProduct && !filterParas["product_id"]) {
      setFilterParas((pre) => ({ ...pre, product_id: "" }));
    }
  }, [hasFrom, hasTo, hasProject, hasProduct, setFilterParas]);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: dataSystem, getData } = useApi<any[]>();
  useEffect(() => {
    if (hasProject)
      getData("/system/config/" + encodeBase64({ type: "project" }));
    if (hasProduct)
      getData("/system/config/" + encodeBase64({ type: "product" }));
    if (hasUser) getData("/user/" + encodeBase64({ type: "all" }));
  }, [hasProject, hasProduct, hasUser]);
  useEffect(() => {
    if (!config) return;
    const loadData = async () => {
      setLoading(true);
      const extra: Record<string, any> = {};

      if (hasFrom) extra["from"] = filterParas["from"];
      if (hasTo) extra["to"] = filterParas["to"];
      if (hasProject) extra["project_id"] = filterParas["project_id"];
      if (hasProduct) extra["product_id"] = filterParas["product_id"];
      if (hasUser) extra["user_id"] = filterParas["user_id"];
      const res = await fetchData(config.statisticParas, extra);
      if (res != null) setData(res);
      else setData([]);
      setLoading(false);
    };
    loadData();
  }, [config, filterParas]);
  if (!config) return <div>Không tải được dữ liệu</div>;
  return (
    <div className="my-6 p-4 mx-2 rounded-lg bg-base-100 shadow-md">
      <h2 className="text-xl font-bold mb-4">{config.name}</h2>
      {(hasFrom || hasTo || hasProject || hasProduct || hasUser) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {hasFrom && (
            <div>
              <label className="label">
                <span className="label-text">Từ ngày</span>
                <DateTimePicker
                  value={filterParas["from"] || ""}
                  onChange={(val) =>
                    setFilterParas((prev) => ({ ...prev, from: val }))
                  }
                  className="w-full"
                />
              </label>
            </div>
          )}
          {hasTo && (
            <div>
              <label className="label">
                <span className="label-text">Đến ngày</span>
                <DateTimePicker
                  value={filterParas["to"] || ""}
                  onChange={(val) =>
                    setFilterParas((prev) => ({ ...prev, to: val }))
                  }
                  className="w-full"
                />
              </label>
            </div>
          )}
          {hasProject && (
            <div>
              <label className="label">
                <span>Chọn dự án</span>
                <select
                  value={filterParas["project_id"] || 0}
                  className="select w-full"
                  onChange={(e) =>
                    setFilterParas((prev) => ({
                      ...prev,
                      project_id: Number(e.target.value),
                    }))
                  }
                >
                  <option value={0} disabled>
                    Chọn Dự án
                  </option>
                  {dataSystem &&
                  dataSystem.some((t) => typeof t.id == "number") ? (
                    dataSystem.map((project: ProjectMember) => {
                      return (
                        <option
                          key={"projectStatist" + project.id}
                          value={project.id}
                        >
                          {project.name}
                        </option>
                      );
                    })
                  ) : (
                    <option>Lỗi tải dữ liệu</option>
                  )}
                </select>
              </label>
            </div>
          )}
          {hasProduct && (
            <div>
              <label className="label">
                <span>Chọn phần mềm</span>
                <select
                  value={filterParas["product_id"] || ""}
                  className="select"
                  onChange={(e) =>
                    setFilterParas((prev) => ({
                      ...prev,
                      product_id: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Chọn phần mềm
                  </option>
                  {dataSystem &&
                  dataSystem.some((t) => typeof t.id == "string") ? (
                    dataSystem.map((product) => {
                      return (
                        <option
                          key={"productStatist" + product.id}
                          value={product.id}
                        >
                          {product.name}
                        </option>
                      );
                    })
                  ) : (
                    <option>Lỗi tải dữ liệu</option>
                  )}
                </select>
              </label>
            </div>
          )}
          {hasUser && (
            <div>
              <label className="label">
                <span>Chọn người dùng</span>
                <select
                  value={filterParas["user_id"] || 0}
                  className="select w-full"
                  onChange={(e) =>
                    setFilterParas((prev) => ({
                      ...prev,
                      user_id: Number(e.target.value),
                    }))
                  }
                >
                  <option value={0} disabled>
                    Chọn người dùng
                  </option>
                  {dataSystem &&
                  dataSystem.some((t) => typeof t.userid == "number") ? (
                    dataSystem.map((user: UserDto) => {
                      return (
                        <option
                          key={"userWork" + user.userid}
                          value={user.userid}
                        >
                          {user.userData.display_name}
                        </option>
                      );
                    })
                  ) : (
                    <option>Lỗi tải dữ liệu</option>
                  )}
                </select>
              </label>
            </div>
          )}
        </div>
      )}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-auto max-h-[600px]">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {config.statisticColumns.map((col) => {
                  return <th key={col.code}>{col.display}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <tr key={idx}>
                    {config.statisticColumns.map((col) => {
                      let display = row[col.code];
                      if (display == null) {
                        return <td key={col.code}>-</td>;
                      }

                      if (!isNaN(Number(display)) && !/^-?\d+$/.test(display))
                        display = Number(display).toFixed(2);
                      if (
                        col.code == "isDone" &&
                        typeof row[col.code] === "boolean"
                      ) {
                        return (
                          <td key={col.code}>
                            {row[col.code]
                              ? "Đã hoàn thành"
                              : "Chưa hoàn thành"}
                          </td>
                        );
                      }
                      if (
                        col.code == "name" &&
                        config.statisticColumns.some((r) => r.code == "id")
                      ) {
                        const link =
                          row["type"] == "Task"
                            ? `/task/${encodeBase64({ task_id: row["id"] })}`
                            : row["type"] == "Testcase"
                            ? `/test_case/${encodeBase64({
                                testcase_id: row["id"],
                              })}`
                            : `/bug/${encodeBase64({ bug_id: row["id"] })}`;
                        return (
                          <td key={col.code} className="flex">
                            {display}{" "}
                            <Link href={link}>
                              <ArrowRight />
                            </Link>
                          </td>
                        );
                      }

                      return <td key={col.code}>{display ?? "-"}</td>;
                    })}
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
