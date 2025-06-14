/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TableStatist from "~/components/statistical/table-statist";
import { useApi } from "~/hooks/use-api";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { Config, StatistPara } from "~/lib/types";

function ClientStatisticalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statistTable, setStatistTable] = useState<Config>();
  const { data: configGeneral, getData } = useApi<Config[]>();
  const { getData: getDataTabel } = useApi<any[]>();
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
  useEffect(() => {
    const base64Str = encodeBase64({
      code: statistTable?.code,
      ...filterParas,
    });
    const params = new URLSearchParams();
    if (statistTable) {
      params.set("q", base64Str);
      router.replace(`?${params.toString()}`);
    }
  }, [filterParas, statistTable]);

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
      <div className="drawer-side shadow border-r-1">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {configGeneral ? (
            configGeneral
              .sort((a, b) => a.id - b.id)
              .map((config) => {
                return (
                  <li key={config.id} onClick={() => setStatistTable(config)}>
                    <a
                      className={clsx(
                        "flex",
                        "truncate max-w-[300px]",
                        statistTable?.code === config.code ? "menu-active" : ""
                      )}
                    >
                      <div className="shrink">{config.code}</div>
                      <div className="truncate grow">{config.name}</div>
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
