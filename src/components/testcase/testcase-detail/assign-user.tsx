"use client";
import clsx from "clsx";
import {
  CirclePlay,
  FileBadge,
  Pencil,
  Plus,
  SquareCheckBig,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import NotifyBtn from "~/components/ui/notify-btn";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { TestAssign } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

function AssignedUser({
  assignTo,
  testcase_id,
  onUpdate,
  openAddTest,
  openAssign,
  openUpdateDeadline,
}: {
  assignTo: TestAssign[];
  testcase_id: number;
  onUpdate: () => Promise<void>;
  openAddTest: (code: string) => void;
  openUpdateDeadline: (code: string, deadline_current: string) => void;
  openAssign: () => void;
}) {
  const { putData, errorData } = useApi<
    "",
    { testcase_id: number; assign_code: string; status: string }
  >();
  const { removeData, errorData: errorRemove } = useApi();
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
  const handleDeleteTester = async (code: string) => {
    const re = await removeData(
      `/testcase/assign/${encodeBase64({
        test_id: testcase_id,
        assign_code: code,
      })}`
    );
    if (re == null) return;
    toast.success("Xử lý thành công");
    await onUpdate();
  };
  const url = window.location.pathname;
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
    if (errorRemove) toast.error(errorRemove.message || errorRemove.title);
  }, [errorData, errorRemove]);
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
      <div className="overflow-y-auto max-h-[400px]">
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
              <p>Ngày giao: {format_date(assignInfo.assigned_at)}</p>
              <p>
                Deadline:{" "}
                <span
                  className={clsx(
                    assignInfo.is_late ? "badge badge-error" : ""
                  )}
                >
                  {format_date(assignInfo.dead_line)}
                </span>
                <button
                  className="btn btn-circle tooltip"
                  data-tip="Chỉnh deadline"
                  onClick={() => {
                    openUpdateDeadline(code, assignInfo.dead_line);
                  }}
                >
                  <Pencil />
                </button>
              </p>
              {assignInfo.start_at ? (
                <p>Bắt đầu: {format_date(assignInfo.start_at)}</p>
              ) : (
                <p>Người dùng chưa bắt đầu</p>
              )}
              {assignInfo.end_at ? (
                <p>Kết thúc: {format_date(assignInfo.end_at)}</p>
              ) : (
                ""
              )}
              <div className="flex justify-between gap-2">
                <div>
                  {(status == "INPROGRESS" || status == "ASSIGNED") && (
                    <NotifyBtn
                      type="Testcase"
                      url={url}
                      content={{
                        id: testcase_id,
                        name: "Nhắc nhở thực hiện testcase",
                        message: "Bạn được nhắc nhở hoàn thành testcase",
                      }}
                      user_id={assignInfo.assign_to}
                    ></NotifyBtn>
                  )}
                </div>

                <div className="join">
                  {status == "ASSIGNED" && (
                    <>
                      <button
                        className="btn btn-primary btn-outline join-item tooltip"
                        onClick={() => handleSubmit(code, "START")}
                        data-tip={"Bắt đầu"}
                      >
                        <CirclePlay />
                      </button>
                      <button
                        className="btn btn-outline btn-error tooltip join-item"
                        data-tip="Xóa tester"
                        onClick={() => handleDeleteTester(code)}
                      >
                        <X />
                      </button>
                    </>
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
    </div>
  );
}

export default AssignedUser;
