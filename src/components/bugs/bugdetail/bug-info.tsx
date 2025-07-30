"use client";
import {
  CheckCheck,
  CirclePlay,
  Info,
  Link2,
  Lock,
  LucideIcon,
  Pencil,
  UserPlus,
  X,
} from "lucide-react";
import React, { useEffect } from "react";
import UpdatePriorytyComponent from "../modal/update-priority-btn";
import UpdateSeverityComponent from "../modal/update-severity-btn";
import { BugSeverity, BugStatus, Priority } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { toast } from "sonner";
import { format_date } from "~/utils/fomat-date";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { status_with_color_badge } from "~/utils/status-with-color";

type BugInfoProps = {
  bug: {
    id: number;
    title: string;
    description: string;
    priority: string;
    severity: string;
    is_update: boolean;
    reported_at: string;
    reporter_name: string;
    tags: string[];
    status: string;
    log: string;
  };
};

export default function BugInfo({
  bug,
  bug_status,
  onEdit,
  onLinkRequirement,
  onAssign,
  onUpdate,
  hiddenButton,
}: {
  bug: BugInfoProps["bug"];
  bug_status: BugStatus[];
  onEdit: () => void;
  onLinkRequirement: () => void;
  onAssign: () => void;
  onUpdate: () => Promise<void>;
  hiddenButton?: boolean;
}) {
  const { putData, errorData } = useApi<
    string,
    { bug_id: number; status: string }
  >();
  const {
    data: priorityList,
    getData: getPriority,
    errorData: errorPriority,
  } = useApi<Priority[]>();
  const {
    data: severityList,
    getData: getSeverity,
    errorData: errorSeverity,
  } = useApi<BugSeverity[]>();
  useEffect(() => {
    getPriority("/system/config/eyJ0eXBlIjoicHJpb3JpdHkifQ==");
    getSeverity("/system/config/eyJ0eXBlIjoiYnVnX3NldmVyaXR5In0=");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleStatusChange = async (code: string) => {
    // const newStatus = selectStatus;
    if (code === bug.status) return; // No change, do nothing
    try {
      const re = await putData("/bugs/status", {
        bug_id: bug.id,
        status: code,
      });
      if (re != "") return;
      await onUpdate(); // Call the onUpdate function to refresh data
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại sau.");
      console.error("Error updating bug status:", error);
      // Handle error, e.g., show a notification or alert
    }
  };
  useEffect(() => {
    if (errorData) {
      toast.error(
        "Cập nhật trạng thái thất bại: " + errorData.message || errorData.title
      );
    }
  }, [errorData]);
  const priority = priorityList?.find((pri) => pri.code == bug.priority);
  const severity = severityList?.find((ser) => ser.code == bug.severity);
  const GroupBtnNew = (
    <div className="tooltip" data-tip="Chỉnh sửa thông tin">
      <button onClick={onEdit} className="btn btn-circle btn-sm">
        <Pencil />
      </button>
    </div>
  );
  const RenderBtnByStatus = ({ currentStatus }: { currentStatus: string }) => {
    const allowStatus = bug_status.find(
      (st) => st.code == currentStatus
    )?.allowed_transitions;

    return (
      <div className="join">
        {allowStatus &&
          allowStatus.map((st) => {
            let Icon: LucideIcon = Info;
            switch (st) {
              case "CONFIRMED":
                Icon = CheckCheck;
                break;
              case "REJECTED":
                Icon = X;
                break;
              case "INPROGRESS":
                Icon = CirclePlay;
                break;
              case "CLOSED":
                Icon = Lock;
                break;
            }
            return (
              <button
                key={st}
                className={`btn btn-sm tooltip btn-circle btn-ghost`}
                data-tip={bug_status.find((s) => st == s.code)?.description}
                onClick={() => handleStatusChange(st)}
              >
                <Icon />
              </button>
            );
          })}
      </div>
    );
  };
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="indicator">
          <span
            className={`indicator-item ${status_with_color_badge[bug.status]}`}
          >
            {bug.status}
          </span>
          <h2 className="text-lg font-bold text-primary w-56">
            🐞 Thông tin Bug
          </h2>
        </div>

        {!hiddenButton ? (
          <div className="flex gap-2">
            <div
              className="tooltip"
              data-tip="Liên kết task, testcase liên quan"
            >
              <button
                onClick={onLinkRequirement}
                className="btn btn-circle btn-ghost btn-sm"
              >
                <Link2 />
              </button>
            </div>
            <div className="tooltip" data-tip="Giao việc">
              <button
                onClick={onAssign}
                className="btn btn-sm btn-circle btn-ghost "
              >
                <UserPlus />
              </button>
            </div>
            {bug.status == "NEW" && GroupBtnNew}

            <RenderBtnByStatus currentStatus={bug.status} />
            {/* <div className="join">
              <div className="select join-item select-sm">
                <select
                  name=""
                  id=""
                  value={selectStatus}
                  onChange={(e) => setSelectStatus(e.target.value)}
                >
                  <option value="" disabled>
                    Chọn trạng thái
                  </option>
                  {bug_status.map((status) => (
                    <option
                      key={status.code}
                      value={status.code}
                      className={`${
                        status.code === bug.status
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      disabled={status.code === bug.status}
                    >
                      {status.description}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="join-item btn btn-sm"
                onClick={handleStatusChange}
                disabled={isLoading || selectStatus === bug.status}
              >
                Cập nhật
              </button>
            </div> */}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="space-y-2">
        <p>
          <strong className="w-36">Tiêu đề:</strong> {bug.title} - (#{bug.id})
        </p>
        <div>
          <strong className="w-36">Mô tả:</strong>{" "}
          <SafeHtmlViewer className="m-2" html={bug.description} />
        </div>
        <div className="flex gap-2">
          <p className="tooltip tooltip-bottom" data-tip={priority?.hints}>
            <strong className="w-36">Ưu tiên:</strong>{" "}
            {priority?.display || bug.priority}
          </p>
          {hiddenButton || errorPriority
            ? ""
            : priorityList && (
                <UpdatePriorytyComponent
                  priorityList={priorityList}
                  bug_id={bug.id}
                  onUpdate={onUpdate}
                  priority={bug.priority}
                />
              )}
        </div>
        <div className="flex gap-2">
          <p className="tooltip tooltip-bottom" data-tip={severity?.hints}>
            <strong className="w-36">Ảnh hưởng:</strong>{" "}
            {severity?.display || bug.severity}
          </p>
          {hiddenButton || errorSeverity
            ? ""
            : severityList && (
                <UpdateSeverityComponent
                  severityList={severityList}
                  bug_id={bug.id}
                  onUpdate={onUpdate}
                  severity={bug.severity}
                />
              )}
        </div>

        <p>
          <strong className="w-36">Đã cập nhật:</strong>{" "}
          {bug.is_update ? "Có" : "Chưa"}
        </p>
        <p>
          <strong className="w-36">Người báo cáo:</strong> {bug.reporter_name}
        </p>
        <p>
          <strong className="w-36">Thời gian báo cáo:</strong>{" "}
          {format_date(bug.reported_at)}
        </p>
        <p>
          <strong className="w-36">Tag:</strong>{" "}
          {bug.tags.map((t) => (
            <span key={t} className="badge badge-outline mx-1 badge-primary">
              {t}
            </span>
          ))}
        </p>
        <div>
          <strong className="w-36">Log:</strong>
          <SafeHtmlViewer className="m-2" html={bug.log} />
        </div>
      </div>
    </div>
  );
}
