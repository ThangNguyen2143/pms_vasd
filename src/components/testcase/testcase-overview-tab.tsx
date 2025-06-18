/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { endOfDay, startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { toISOString } from "~/utils/fomat-date";
import DateTimePicker from "../ui/date-time-picker";
import { ProductModule } from "~/lib/types";
import { StackedBarChartByModule } from "../tasks/charts/group-chart-status";
import StackBarChartHorizonal from "../ui/chart/stack-chart-horizonal";
import PieChartComp from "../ui/chart/pie-chart";
import TableTestNeverRun from "./test-never-run-table";

function TestcaseOverView() {
  const [productSelect, setproductSelect] = useState<string>("");

  const { data: moduleProduct, getData: getModules } =
    useApi<ProductModule[]>();

  const { data: dataOverViewDate, getData: getOvvDate } =
    useApi<{ result: string; count: number }[]>();
  const { data: dataOverViewStatus, getData: getOvvStatus } = useApi<
    {
      module: string;
      status: string;
      count: number;
    }[]
  >();
  const { data: dataOverViewHanling, getData: getOvvHandling } = useApi<
    {
      user_id: number;
      name: string;
      testcase_created: number;
      testcase_executed: number;
    }[]
  >();
  const { data: dataTestNeverRun, getData: getDataTestNeverRun } = useApi<
    {
      id: number;
      name: string;
      creater_name: string;
      create_date: string;
      module: string;
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
        "/testcase/overview/" +
          encodeBase64({
            type: "result_inrange",
            product_id: productSelect,
            from: toISOString(fromDate),
            to: toISOString(toDate),
          }),
        "reload"
      );
    };
    fetchData();
  }, [toDate, fromDate, productSelect]);
  useEffect(() => {
    getOvvHandling(
      "/testcase/overview/" +
        encodeBase64({
          type: "activity",
          from: toISOString(fromDate),
          to: toISOString(toDate),
        }),
      "reload"
    );
  }, [toDate, fromDate]);
  useEffect(() => {
    if (productSelect == "") return;
    getOvvStatus(
      "/testcase/overview/" +
        encodeBase64({
          type: "overview_status",
          product_id: productSelect,
        }),
      "reload"
    );
    getModules(
      "/product/" + encodeBase64({ type: "module", product_id: productSelect })
    );
  }, [productSelect]);
  useEffect(() => {
    getProducts("/system/config/" + encodeBase64({ type: "product" }));
    getDataTestNeverRun(
      "/testcase/overview/" + encodeBase64({ type: "never_run" })
    );
  }, []);
  console.log(dataOverViewDate);
  return (
    <div className="flex flex-col p-2">
      <div className="flex gap-2">
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
        <div className="grid grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">Thống kê tình trạng testcase</h3>
            {/* Điều chỉnh lại dữ liệu */}
            <div className="h-[500px] w-full flex justify-center items-center">
              {productSelect != "" ? (
                <StackedBarChartByModule
                  data={dataOverViewStatus || []}
                  moduleProduct={moduleProduct || []}
                />
              ) : (
                <p className="text-center mt-4">Vui lòng chọn phần mềm</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold">Kết quả test theo thời gian</h3>
            <div className="h-[500px] w-full flex justify-center items-center">
              <PieChartComp
                data={
                  dataOverViewDate
                    ? dataOverViewDate.map((d) => ({
                        label: d.result,
                        count: d.count,
                      }))
                    : []
                }
                valueKey="count"
              />
            </div>
          </div>
        </div>
        <div className="">
          <div>
            <h3 className="text-xl font-bold">
              Thống kê testcase đang hoạt động
            </h3>
            <div className="h-[500px] w-full flex justify-center items-center">
              <StackBarChartHorizonal
                data={
                  dataOverViewHanling
                    ? dataOverViewHanling.map((data) => ({
                        label: data.name,
                        ...data,
                      }))
                    : []
                }
                type={["testcase_created", "testcase_executed"]}
              />
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div>
        <h3 className="text-xl font-bold">Danh sách testcase chưa được test</h3>
        <div>
          <TableTestNeverRun
            data={dataTestNeverRun || []}
            getModuleName={(id) =>
              moduleProduct?.find((mo) => mo.id == id)?.display
            }
          />
        </div>
      </div>
    </div>
  );
}

export default TestcaseOverView;
