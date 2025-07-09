"use client";
import { useMemo } from "react"; // <- component bạn đã có
import { StackedBarChart } from "./stack-bar-chart";
function GroupProductToChart({ data, getProductName }: Props) {
  // Nhóm theo product_id
  const groupedData = useMemo(() => {
    const map = new Map<string, BugSeverityStatus[]>();
    data.forEach((item) => {
      if (!map.has(item.product_id)) {
        map.set(item.product_id, []);
      }
      map.get(item.product_id)!.push(item);
    });
    return map;
  }, [data]);
  return (
    <div
      className={
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center"
      }
    >
      {[...groupedData.entries()].map(([productId, productData]) => (
        <div key={productId} className=" flex flex-col gap-4 justify-center">
          <h2 className="text-lg font-semibold my-2">
            {getProductName
              ? getProductName(productId)
              : `Phần mềm ${productId}`}
          </h2>
          <div className="bg-white p-4 rounded-lg shadow max-h-[200px]">
            <StackedBarChart data={productData} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupProductToChart;

type BugSeverityStatus = {
  product_id: string;
  severity: string;
  status: string;
  count: number;
};

type Props = {
  data: BugSeverityStatus[];
  getProductName?: (productId: string) => string; // Optional: đổi tên nếu cần
};
