/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TableStatist from "~/components/statistical/table-statist";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Config, StatistPara } from "~/lib/types";
// import { toISOString } from "~/utils/fomat-date";

function ClientStatisticalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statistTable, setStatistTable] = useState<Config>();
  const { data: configGeneral, getData } = useApi<Config[]>();
  const { getData: getDataTabel } = useApi<any[]>();
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && configGeneral) {
      const found = configGeneral.find((c) => c.code === code);
      if (found) {
        setStatistTable(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configGeneral]);
  useEffect(() => {
    getData("/statistic");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSelectReport = (config: Config) => {
    setStatistTable(config);
    const newUrl = `?code=${encodeURIComponent(config.code)}`;
    router.replace(newUrl); // dùng replace để không thêm vào history stack
  };
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
        console.log("field:", field, "value:", rawValue);
        switch (type) {
          case "number":
            queryObj[field] = Number(rawValue);
            break;
          case "boolean":
            queryObj[field] = Boolean(rawValue);
            break;
          case "datetime":
            queryObj[field] = rawValue;
          case "string":
          default:
            queryObj[field] = String(rawValue);
            break;
        }
      });

      const encoded = encodeBase64(queryObj);
      const endpoint = `/statistic/${encoded}`;
      return await getDataTabel(endpoint, "reload");
    }
    return null;
  };
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Page content here */}
        {statistTable ? (
          <TableStatist
            key={statistTable?.id}
            config={statistTable}
            fetchData={(paras, extra) =>
              fetchStatisticData(statistTable, paras, extra)
            }
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
      <div className="drawer-side shadow border-r-1">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {configGeneral ? (
            configGeneral.map((config) => {
              return (
                <li key={config.id} onClick={() => handleSelectReport(config)}>
                  <a
                    className={clsx(
                      "flex",
                      "truncate max-w-[300px]",
                      statistTable?.code === config.code ? "menu-active" : ""
                    )}
                  >
                    <div className="grow">{config.code}</div>
                    <div className="truncate">{config.name}</div>
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
