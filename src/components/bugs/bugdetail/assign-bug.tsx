"use client";
import { BugOff, BugPlay, RotateCcw, SquareCheckBig } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { BugAssign } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

type AssignBugProps = {
  bug_id?: number;
  assignee: BugAssign | null;
  onUpdate: () => Promise<void>;
};

export default function AssignBug({
  bug_id,
  assignee,
  onUpdate,
}: AssignBugProps) {
  const [confirmDone, setConfirmDone] = useState(false);
  const [noteCommit, setNoteCommit] = useState("");
  const { putData, isLoading, errorData } = useApi<
    string,
    { bug_id: number; status?: string; note?: string }
  >();
  const handleConfirmDone = async (note: string) => {
    if (!bug_id) return;
    const re = await putData("/bugs/assign/status", {
      bug_id,
      status: "END",
      note,
    });
    if (re != "") return;
    await onUpdate();
    setConfirmDone(false);
    setNoteCommit("");
  };
  const handleStartBug = async () => {
    if (!bug_id) return;
    const re = await putData("/bugs/assign/status", {
      bug_id,
      status: "START",
      note: "",
    });
    if (re != "") return;
    await onUpdate();
  };
  const handleReopen = async () => {
    if (!bug_id) return;
    const re = await putData("/bugs/reopen", {
      bug_id,
    });
    if (re != "") return;
    await onUpdate();
  };

  useEffect(() => {
    if (errorData) {
      toast.error(
        "Có lỗi xảy ra khi cập nhật trạng thái giao việc: " + errorData.message
      );
    }
  }, [errorData]);
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary mb-2">
          👨‍💻 Giao việc
        </h3>
        <div className="tooltip" data-tip="Mở lại bug">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handleReopen()}
          >
            <RotateCcw />
          </button>
        </div>
      </div>
      {assignee ? (
        <div>
          <p>
            <strong>Người phụ trách:</strong>
            <br /> {assignee.assigned_name}
          </p>
          <p>
            <strong>Bắt đầu lúc:</strong>
            {assignee.time_start ? format_date(assignee.time_start) : "-"}
          </p>
          <p>
            <strong>Hạn chót:</strong> {format_date(assignee.deadline)}
          </p>
          {assignee.resolved_at && (
            <p>
              <strong>Hoàn thành lúc:</strong>{" "}
              {format_date(assignee.resolved_at)}
            </p>
          )}
          {assignee.resolution_note && (
            <p>
              <strong>Ghi chú:</strong> {assignee.resolution_note}
            </p>
          )}
          {assignee.time_start && !assignee.resolved_at && (
            <div className="tooltip tooltip-bottom" data-tip="Kết thúc fix bug">
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={() => setConfirmDone(true)}
              >
                <SquareCheckBig />
              </button>
            </div>
          )}
          {!assignee.time_start && (
            <div className="tooltip tooltip-bottom" data-tip="Bắt đầu fix bug">
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={handleStartBug}
                disabled={isLoading}
              >
                <BugPlay />
              </button>
            </div>
          )}
          {assignee.resolved_at && (
            <div className="tooltip tooltip-bottom" data-tip="Đã hoàn thành">
              <button className="btn btn-sm btn-success mt-2" disabled={true}>
                <BugOff />
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="italic text-gray-500">Chưa được giao</p>
      )}
      {confirmDone && (
        <div>
          {/* Confirm done have 2 field: input to write note and button confirm */}
          <div className="mb-2">
            <label className="label">
              <span className="label-text">Ghi chú khi kết thúc:</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Nhập ghi chú..."
              value={noteCommit}
              onChange={(e) => setNoteCommit(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary mr-2"
              onClick={() => handleConfirmDone(noteCommit)}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setConfirmDone(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
