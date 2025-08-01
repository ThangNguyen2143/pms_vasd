/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import clsx from "clsx";
import {
  Bug,
  ChartNoAxesCombined,
  ClipboardPen,
  File,
  FileUser,
  Globe,
  Hourglass,
  TestTube,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TableStatist from "~/components/statistical/table-statist";
import { useApi } from "~/hooks/use-api";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { Config, StatistPara } from "~/lib/types";
import { toISOString } from "~/utils/fomat-date";

function ClientStatisticalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statistTable, setStatistTable] = useState<Config>();
  const { data: configGeneral, getData } = useApi<Config[]>();
  const { getData: getDataTabel, errorData } = useApi<any[]>();
  const initialFilterParas: Record<string, any> = (() => {
    const q = searchParams.get("q");
    if (!q) return {};

    try {
      return decodeBase64(q); // Phải trả về object từ chuỗi encodeBase64()
    } catch (err) {
      console.warn("Không thể decode 'q'", err);
      return {};
    }
  })();
  useEffect(() => {
    if (errorData) {
      console.log(errorData);
    }
  }, [errorData]);
  const [filterParas, setFilterParas] =
    useState<Record<string, any>>(initialFilterParas);
  useEffect(() => {
    const query = searchParams.get("q");
    if (!query) return;
    try {
      const { code } = decodeBase64(query) as { code: string; any: any };
      if (code && configGeneral) {
        const found = configGeneral.find((c) => c.code === code);
        if (found) {
          setStatistTable(found);
        }
      }
    } catch (e) {
      console.warn("Không thể decode 'q'", e);
      return;
    }
  }, [configGeneral, searchParams]);
  const encodebase = useMemo(() => {
    if (statistTable) {
      const fullParams = {
        code: statistTable.code,
        ...filterParas,
      };
      return encodeBase64(fullParams);
    }
    return "";
  }, [statistTable?.code, JSON.stringify(filterParas)]);

  useEffect(() => {
    if (statistTable) {
      const newQ = encodebase;
      const currentQ = searchParams.get("q");
      if (newQ && currentQ !== newQ) {
        const params = new URLSearchParams();
        params.set("q", newQ);
        router.push(`?${params.toString()}`);
      }
    }
  }, [encodebase]);
  useEffect(() => {
    if (statistTable) {
      // Optional: Reset filterParas khi table thay đổi
      setFilterParas((prev) => ({
        ...prev,
        code: statistTable.code,
      }));
    }
  }, [statistTable]);

  // useEffect(() => {
  //   const base64Str = encodebase;
  //   if (statistTable) {
  //     const params = new URLSearchParams();
  //     params.set("q", base64Str);
  //     console.log("code=", statistTable.code);
  //     console.log(params.toString());
  //     router.push(`?${params.toString()}`);
  //   }
  // }, [filterParas, statistTable]);

  useEffect(() => {
    getData("/statistic");
  }, []);
  const fetchStatisticData = async (
    config: Config,
    paras: StatistPara[],
    extraParams: Record<string, any> = {}
  ) => {
    const queryObj: Record<string, any> = {};
    if (statistTable) {
      paras.forEach((para) => {
        const { field, type } = para;
        const rawValue = extraParams[field] || config[field as keyof Config];
        switch (type) {
          case "number":
          case "int":
            queryObj[field] = rawValue;
            break;
          case "boolean":
            queryObj[field] = Boolean(rawValue);
            break;
          case "datetime": {
            if (!rawValue) {
              queryObj[field] = null;
              break;
            }
            queryObj[field] = toISOString(rawValue);
            break;
          }
          case "string":
          default:
            queryObj[field] = String(rawValue);
            break;
        }
      });
      //Kiểm tra queryObj có đầy đủ các trường trong paras hay không?
      //Nếu không có trả về null
      const isMissingField = paras.some((para) => {
        const val = queryObj[para.field];
        return val === null || val === undefined || val === "";
      });

      if (isMissingField) {
        return null;
      }
      const encoded = encodeBase64(queryObj);
      const endpoint = `/statistic/${encoded}`;
      return await getDataTabel(endpoint, "reload");
    }
    return null;
  };
  const selectIcon = (name: string) => {
    let icon;
    switch (name) {
      case "sta_0001":
        icon = <File />;
        break;
      case "sta_0002":
        icon = <Bug />;
        break;
      case "sta_0003":
        icon = <TestTube />;
        break;
      case "sta_0004":
        icon = <ClipboardPen />;
        break;
      case "sta_0005":
        icon = <Hourglass />;
        break;
      case "sta_0006":
        icon = <ChartNoAxesCombined />;
        break;
      case "sta_0007":
        icon = <FileUser />;
        break;
      default:
        icon = <Globe />; // Default icon if no match
    }
    return icon;
  };
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Page content here */}
        {statistTable ? (
          <TableStatist
            key={statistTable.id}
            config={statistTable}
            filterParas={filterParas}
            setFilterParas={setFilterParas}
            fetchData={(paras, extra) => {
              return fetchStatisticData(statistTable, paras, extra);
            }}
          />
        ) : (
          <div className="flex items-center justify-center">
            Vui lòng chọn báo cáo
          </div>
        )}

        {/* <div>Content here</div> */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Mở
        </label>
      </div>
      <div
        className="drawer-side shadow border-r-1"
        style={{ overflow: "visible" }}
      >
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-24 p-4">
          {/* Sidebar content here */}
          {configGeneral ? (
            configGeneral
              .sort((a, b) => a.id - b.id)
              .map((config) => {
                return (
                  <li
                    key={config.id}
                    onClick={() => setStatistTable(config)}
                    className="tooltip tooltip-right"
                    data-tip={config.name}
                  >
                    <a
                      className={clsx(
                        "flex",
                        "truncate max-w-[300px] justify-center",
                        statistTable?.code === config.code ? "menu-active" : ""
                      )}
                    >
                      {selectIcon(config.code)}
                    </a>
                  </li>
                );
              })
          ) : (
            <li>Không tải được danh sách</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ClientStatisticalPage;
