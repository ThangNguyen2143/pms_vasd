/* eslint-disable react-hooks/exhaustive-deps */
import { endOfDay, startOfDay, subDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import DateTimePicker from "~/components/ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectMember } from "~/lib/types";
import { toISOString } from "~/utils/fomat-date";
import { ChartByLocation } from "./horizonal-chart";
import { ChartByDate } from "./bar-line-chart";
import { ChartByStatus } from "./vertical-chart";
import { ChartByType } from "./stack-chart";
import clsx from "clsx";

type EnumTab = "reqByLocation" | "reqByStatus" | "reqByDate" | "reqByType";
interface ChartOverviewProps {
  tab: EnumTab;
  paraTab: {
    product_id: boolean;
    project_id: boolean;
    from: boolean;
    to: boolean;
  };
}
type ReqByLocation = {
  location_id: number;
  location_name: string;
  total: number;
  statuses: {
    code: string;
    quantity: number;
  }[];
};
function ChartOverviewRequirement({ tab, paraTab }: ChartOverviewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dataOverView, getData } = useApi<any[]>();
  const [fromDate, setFromDate] = useState<string>(
    toISOString(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, settoDate] = useState<string>(
    toISOString(endOfDay(new Date()))
  );
  const [productSelect, setproductSelect] = useState<string>("");
  const [projectSelect, setprojectSelect] = useState<number>(0);
  const { data: projectList, getData: getProjectJoin } =
    useApi<ProjectMember[]>();
  const { data: productList, getData: getProducts } =
    useApi<{ id: string; name: string }[]>();
  const titleReport = useRef("");
  useEffect(() => {
    const fetchData = async () => {
      if (tab == "reqByLocation" && paraTab.project_id)
        await getData(
          "/requirements/location/" +
            encodeBase64({ project_id: projectSelect }),
          "reload"
        );
      if (
        tab == "reqByDate" &&
        paraTab.from &&
        paraTab.to &&
        paraTab.product_id
      ) {
        await getData(
          "/requirements/overview/" +
            encodeBase64({
              type: "requirements_progress",
              product_id: productSelect,
              from: toISOString(fromDate),
              to: toISOString(toDate),
            }),
          "reload"
        );
      }
      if (tab == "reqByStatus" && paraTab.product_id)
        await getData(
          "/requirements/overview/" +
            encodeBase64({
              type: "overview_status",
              product_id: productSelect,
            }),
          "reload"
        );
      if (tab == "reqByType" && paraTab.product_id)
        await getData(
          "/requirements/overview/" +
            encodeBase64({
              type: "status_matrix",
              product_id: productSelect,
            }),
          "reload"
        );
    };
    fetchData();
    switch (tab) {
      case "reqByDate":
        //Lấy theo product_id, from, to
        titleReport.current = "Số lượng yêu cầu ghi nhận/xử lý theo thời gian";
        break;
      case "reqByLocation":
        // Không có fillter. get by project_id
        titleReport.current = "Số lượng yêu cầu theo khoa/phòng";
        break;
      case "reqByStatus":
        //Lấy theo product_id
        titleReport.current = "Số lượng yêu cầu theo trạng thái";
        break;
      case "reqByType":
        //Lấy theo product_id
        titleReport.current = "Số lượng yêu cầu theo loại";
        break;
      default:
        break;
    }
  }, [tab, productSelect, projectSelect, toDate, fromDate, paraTab]);
  useEffect(() => {
    getProjectJoin("/system/config/" + encodeBase64({ type: "project" }));
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
        {paraTab.project_id && (
          <select
            name="project"
            className="select"
            value={projectSelect}
            onChange={(e) => setprojectSelect(Number.parseInt(e.target.value))}
          >
            <option value={0} disabled>
              Chọn dự án
            </option>
            {projectList?.map((pj) => {
              return (
                <option value={pj.id} key={"project_" + pj.id}>
                  {pj.name}
                </option>
              );
            })}
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
      {tab == "reqByLocation" &&
        dataOverView &&
        dataOverView.length > 0 &&
        projectSelect != 0 && (
          <div className={clsx("grid gap-2", `grid-cols-3`)}>
            {Object.hasOwn(dataOverView[0], "location_id") &&
              dataOverView.map((data: ReqByLocation) => {
                const dataOnChart = data.statuses.map((st) => ({
                  label: st.code,
                  value: st.quantity,
                }));
                return (
                  <div className="w-full" key={data.location_id}>
                    <ChartByLocation
                      data={dataOnChart}
                      name={data.location_name}
                    />
                  </div>
                );
              })}
          </div>
        )}
      {tab == "reqByDate" && productSelect != "" && (
        <div className="mt-6">
          <ChartByDate
            data={
              dataOverView
                ? dataOverView.map((d) => ({
                    date: d.date,
                    bar_data: d.created_count,
                    line_data: d.resolved_count,
                  }))
                : []
            }
          />
        </div>
      )}
      {tab == "reqByStatus" && productSelect != "" && (
        <div className="mt-6">
          <ChartByStatus data={dataOverView || []} />
        </div>
      )}
      {tab == "reqByType" && productSelect != "" && (
        <ChartByType data={dataOverView || []} />
      )}
    </div>
  );
}

export default ChartOverviewRequirement;
