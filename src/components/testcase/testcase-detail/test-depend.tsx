import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { TestcaseDependType, TestcaseDto } from "~/lib/types";

function TestDependComp({
  product_id,
  testcase_id,
  testDepend,
  onUpdate,
}: {
  product_id: string;
  testcase_id: number;
  onUpdate: () => Promise<void>;
  testDepend: { id: number; name: string; relation_type: string }[];
}) {
  const { data, getData } = useApi<TestcaseDependType[]>();
  const { data: listTest, getData: getListTest } = useApi<TestcaseDto[]>();
  const { postData, errorData, removeData } = useApi();
  const [showAddDepend, setshowAddDepend] = useState(false);
  const [selectedDependType, setSelectedDependType] = useState("");
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);
  useEffect(() => {
    getData("/system/config/eyJ0eXBlIjoiZGVwZW5kX3R5cGUifQ==");
    getListTest(`/testcase/${encodeBase64({ product_id })}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);
  useEffect(() => {
    if (errorData) {
      toast.error(errorData.message);
    }
  }, [errorData]);
  const handleAddDepend = async () => {
    const body = {
      test_id: testcase_id,
      depend_id: selectedTestCase,
      type: selectedDependType,
    };
    try {
      const re = await postData("/testcase/depend", body);
      if (re != "") {
        return;
      }
      await onUpdate();
      toast.success("Thêm Testcase phụ thuộc thành công");
      setshowAddDepend(false);
    } catch (error) {
      console.error("Error adding dependency:", error);
    }
  };
  const handleRemoveDepend = async (dependId: number) => {
    try {
      const re = await removeData(
        `/testcase/depend/${encodeBase64({ depend_id: dependId, testcase_id })}`
      );
      if (re != "") {
        return;
      }
      await onUpdate();
      toast.success("Xoá Testcase phụ thuộc thành công");
    } catch (error) {
      console.error("Error removing dependency:", error);
      toast.error("Xoá Testcase phụ thuộc thất bại");
    }
  };
  const findType = (code: string) => {
    return data?.find((item) => item.code === code);
  };
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="mt-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Testcase phụ thuộc</h3>
          <button
            className="btn btn-ghost"
            onClick={() => setshowAddDepend(!showAddDepend)}
          >
            {showAddDepend ? "Đóng" : <Plus></Plus>}
          </button>
        </div>
        <ul className="list-disc pl-5">
          {testDepend.length > 0 ? (
            testDepend.map((depend) => (
              <li key={depend.id} className="mb-2 flex">
                -
                <div className="truncate max-w-36">
                  <span className="font-semibold">{depend.name}</span>
                </div>{" "}
                <span
                  className="text-sm text-gray-500 tooltip"
                  data-tip={findType(depend.relation_type)?.description}
                >
                  {data
                    ? findType(depend.relation_type)?.display
                    : depend.relation_type}
                </span>
                <Link
                  href={
                    "/test_case/" + encodeBase64({ testcase_id: depend.id })
                  }
                  className="btn btn-info ml-2"
                >
                  Chi tiết
                </Link>
                <button
                  className="btn btn-ghost btn-error ml-2"
                  onClick={() => handleRemoveDepend(depend.id)}
                >
                  <span className="text-xs">Xoá</span>
                </button>
              </li>
            ))
          ) : (
            <li className="mb-2 text-gray-500">Không có Testcase phụ thuộc</li>
          )}
        </ul>
      </div>
      {showAddDepend && (
        <div className="mt-4 flex flex-col gap-2">
          <h4 className="text-md font-semibold">Thêm Testcase phụ thuộc</h4>

          <label className="select w-full max-w-xs">
            <span className="label">Chọn loại phụ thuộc</span>
            <select
              className="w-full"
              value={selectedDependType}
              onChange={(e) => setSelectedDependType(e.target.value)}
            >
              <option value="" disabled>
                Chọn loại phụ thuộc
              </option>
              {data?.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.display}
                </option>
              ))}
            </select>
          </label>
          <label className="select w-full max-w-xs">
            <span className="label">Chọn Testcase</span>
            <select
              className="w-full"
              value={selectedTestCase ?? ""}
              onChange={(e) => setSelectedTestCase(Number(e.target.value))}
            >
              <option value="" disabled>
                Chọn Testcase
              </option>
              {listTest?.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary mt-2" onClick={handleAddDepend}>
            Thêm
          </button>
        </div>
      )}
    </div>
  );
}

export default TestDependComp;
