"use client";
import clsx from "clsx";
import { CirclePlay, FileBadge, Plus, SquareCheckBig } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { TestAssign } from "~/lib/types";

function AssignedUser({
  assignTo,
  testcase_id,
  onUpdate,
  openAddTest,
  openAssign,
}: {
  assignTo: TestAssign[];
  testcase_id: number;
  onUpdate: () => Promise<void>;
  openAddTest: (code: string) => void;
  openAssign: () => void;
}) {
  const { putData, errorData } = useApi<
    "",
    { testcase_id: number; assign_code: string; status: string }
  >();
  const handleSubmit = async (assign_code: string, status: string) => {
    const re = await putData("/testcase/testing/status", {
      testcase_id,
      assign_code,
      status,
    });
    if (re == "") {
      await onUpdate();
      toast.success("Xử lý thành công");
    }
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">👥 Người được giao</h3>
        <div className="tooltip" data-tip="Giao test">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => openAssign()}
          >
            <FileBadge />
          </button>
        </div>
      </div>
      {assignTo && assignTo.length > 0 ? (
        assignTo.map(({ assignInfo, code, status }) => (
          <div
            className="bg-base-100 p-3 rounded-lg border-l-4 border-info"
            key={code}
          >
            <p>
              <strong>{assignInfo.assign_name}</strong>{" "}
              <span className="badge badge-info">{status}</span>
            </p>
            <p>Ngày giao: {assignInfo.assigned_at}</p>
            <p>
              Deadline:{" "}
              <span
                className={clsx(assignInfo.is_late ? "badge badge-error" : "")}
              >
                {assignInfo.dead_line}
              </span>
            </p>
            {assignInfo.start_at ? (
              <p>Bắt đầu: {assignInfo.start_at}</p>
            ) : (
              <p>Người dùng chưa bắt đầu</p>
            )}
            {assignInfo.end_at ? <p>Kết thúc: {assignInfo.end_at}</p> : ""}
            <div className="flex justify-end gap-2">
              <div className="join">
                {status == "ASSIGNED" && (
                  <button
                    className="btn btn-primary btn-outline join-item tooltip"
                    onClick={() => handleSubmit(code, "START")}
                    data-tip={"Bắt đầu"}
                  >
                    <CirclePlay />
                  </button>
                )}
                {status == "INPROGRESS" && (
                  <button
                    className="join-item btn btn-outline btn-info tooltip"
                    data-tip="Ghi nhận test"
                    onClick={() => openAddTest(code)}
                  >
                    <Plus></Plus>
                  </button>
                )}
                {status == "INPROGRESS" && (
                  <button
                    className="btn btn-outline join-item btn-success tooltip"
                    onClick={() => handleSubmit(code, "END")}
                    data-tip={"Hoàn thành"}
                  >
                    <SquareCheckBig />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>Công việc chưa được giao cho ai</div>
      )}
    </div>
  );
}

export default AssignedUser;
