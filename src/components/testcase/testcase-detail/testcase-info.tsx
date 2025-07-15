"use client";
import {
  CheckCircle,
  EqualApproximately,
  FileCheck,
  FileX,
  Wrench,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { useApi } from "~/hooks/use-api";
import { ProductModule, TestcaseDetail } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import { status_with_color_badge } from "~/utils/status-with-color";

function TestcaseInfo({
  testcase,
  modules,
  openUpdate,
  onUpdate,
}: {
  testcase: TestcaseDetail;
  modules?: ProductModule[];
  openUpdate: () => void;
  onUpdate: () => Promise<void>;
}) {
  const { putData, errorData } = useApi();
  useEffect(() => {
    if (errorData) {
      console.error("Error updating testcase status:", errorData);
      toast.error(
        `Lỗi cập nhật trạng thái testcase: ${
          errorData.message || "Không rõ lỗi"
        }`
      );
      // Handle error appropriately, e.g., show a notification
    }
  }, [errorData]);
  const handleStatusChange = async (newStatus: string) => {
    if (!testcase.id) return;
    if (testcase.status === newStatus) {
      toast.info("Trạng thái đã được cập nhật.");
      return;
    }
    const response = await putData(`/testcase/status`, {
      status: newStatus,
      testcase_id: testcase.id,
    });

    if (response != "") {
      return;
    }
    toast.success("Cập nhật trạng thái thành công!");
    await onUpdate();
  };
  return (
    <div className="bg-base-100 shadow p-4 rounded-lg">
      <div className="flex justify-between border-l-4 border-green-500 pl-3">
        <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
        <div className="items-center">
          {testcase.status === "DRAFT" && (
            <button
              className="btn btn-outline btn-primary tooltip mr-2"
              data-tip={"Sẵn sàng giao cho tester"}
              onClick={() => handleStatusChange("READY")}
            >
              <span className="flex items-center">
                <span>
                  <FileCheck />
                </span>
              </span>
            </button>
          )}
          {testcase.status === "READY" && (
            <button
              className="btn btn-outline btn-accent tooltip mr-2"
              data-tip={"Đánh dấu đang thực hiện"}
              onClick={() => handleStatusChange("INPROGRESS")}
            >
              <span className="flex items-center">
                <EqualApproximately />
              </span>
            </button>
          )}
          {testcase.status === "INPROGRESS" && (
            <>
              <button
                className="btn btn-outline btn-success tooltip mr-2"
                data-tip={"Đánh dấu đã kiểm tra"}
                onClick={() => handleStatusChange("PASSED")}
              >
                <span className="flex items-center">
                  <span>
                    <CheckCircle />
                  </span>
                </span>
              </button>
              <button
                className="btn btn-ouline btn-error tooltip mr-2"
                data-tip={"Đánh dấu thất bại"}
                onClick={() => handleStatusChange("FAILED")}
              >
                <span className="flex items-center">
                  <span>
                    <FileX />
                  </span>
                </span>
              </button>
            </>
          )}
          {testcase.status === "PASSED" && (
            <button
              className="btn btn-success tooltip mr-2"
              data-tip={"Đánh dấu đã hoàn thành "}
              onClick={() => handleStatusChange("DONE")}
            >
              <span className="flex items-center">
                <span>
                  <FileCheck />
                </span>
              </span>
            </button>
          )}
          <button
            className="btn btn-outline btn-info tooltip"
            data-tip={"Cập nhật thông tin"}
            onClick={openUpdate}
          >
            <Wrench />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p>
          <strong>Tên:</strong> {testcase.name}{" "}
          <span className={status_with_color_badge[testcase.status]}>
            {testcase.status}
          </span>
        </p>
        <div>
          <strong>Mô tả:</strong> <SafeHtmlViewer html={testcase.description} />
        </div>
        <p>
          <strong>Module:</strong>
          {modules
            ? modules.find((m) => m.id == testcase.module)?.display
            : testcase.module}
        </p>
        <p>
          <strong>Tags:</strong>
          {testcase.tags.map((tag) => (
            <span key={tag} className="badge badge-primary ml-2">
              {tag}
            </span>
          ))}
        </p>
        <p>
          <strong>Môi trường:</strong> {testcase.environment}
        </p>
        <p>
          <strong>Ngày tạo:</strong> {format_date(testcase.create_date)}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {testcase.time_end ? format_date(testcase.time_end) : "N/A"}
        </p>
        <p>
          <strong>Đầu vào:</strong> {testcase.test_data || "-"}
        </p>
      </div>
    </div>
  );
}

export default TestcaseInfo;
