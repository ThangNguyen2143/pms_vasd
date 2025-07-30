"use client";
import { BugOff, BugPlay, RotateCcw, SquareCheckBig, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { BugAssign, Contact } from "~/lib/types";
import { useUser } from "~/providers/user-context";
import { format_date } from "~/utils/fomat-date";
import { sendEmail } from "~/utils/send-notify";
interface ResponseNotify {
  action: string;
  content: {
    bug_id: number;
    bug_name: string;
    message: string;
  };
  contact: Contact[];
}
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
  const user = useUser().user;
  const [confirmDone, setConfirmDone] = useState(false);
  const [noteCommit, setNoteCommit] = useState("");
  const { putData, isLoading, errorData } = useApi<
    string,
    { bug_id: number; status?: string; note?: string }
  >();
  const {
    putData: reOpenBug,
    isLoading: loadingOpen,
    errorData: errorOpen,
  } = useApi<ResponseNotify, { bug_id: number }>();
  const {
    removeData,
    isLoading: loadingDelete,
    errorData: errorRemove,
  } = useApi();
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
    const re = await reOpenBug("/bugs/reopen", {
      bug_id,
    });
    if (!re) return;
    else {
      const email = re.contact.find((ct) => ct.code == "email")?.value;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.bug_id,
        name: re.content.bug_name,
        message: re.content.message,
      };
      const link =
        window.location.origin + "/bug/" + encodeBase64({ bug_id }) ||
        "https://pm.vasd.vn/";
      if (email)
        sendEmail(content, email, "Thông báo", link, "bug", user?.name)
          .then((mes) => {
            if (mes.message != "OK") toast(mes.message);
          })
          .catch((e) => toast.error(e));

      // if (tele)
      //   sendTelegram(content, tele, "Thông báo", link, "bug")
      //     .then((re) => {
      //       toast.success(re.message);
      //     })
      //     .catch((err) => toast.error(err));

      await onUpdate();
      toast.success("Mở lại bug thành công");
    }
  };
  const handleRemoveAssign = async () => {
    if (confirm("Xóa người dùng này?")) {
      if (!bug_id) return;
      const re = await removeData(
        "/bugs/assign/" +
          encodeBase64({
            bug_id,
          })
      );
      if (re != "") return;
      toast.success("Xóa người dùng thành công");
      await onUpdate();
    }
  };
  useEffect(() => {
    if (errorData) {
      toast.error(
        "Có lỗi xảy ra khi cập nhật trạng thái giao việc: " +
          errorData.message || errorData.title
      );
    }
    if (errorRemove) {
      toast.error(
        "Có lỗi xảy ra khi xóa người dùng: " + errorRemove.message ||
          errorRemove.title
      );
    }
  }, [errorData, errorRemove]);
  useEffect(() => {
    if (errorOpen) {
      toast.error(
        "Có lỗi xảy ra khi mở lại bug: " + errorOpen.message || errorOpen.title
      );
    }
  }, [errorOpen]);
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
            disabled={loadingOpen}
          >
            {loadingOpen ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <RotateCcw />
            )}
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
            <div className="join mt-2">
              <button
                className="btn btn-sm btn-primary tooltip tooltip-bottom join-item"
                data-tip="Bắt đầu fix bug"
                onClick={handleStartBug}
                disabled={isLoading}
              >
                <BugPlay />
              </button>

              <button
                className="btn btn-sm btn-outline btn-error tooltip tooltip-bottom join-item"
                data-tip="Xóa người được giao"
                disabled={loadingDelete}
                onClick={handleRemoveAssign}
              >
                <X />
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
