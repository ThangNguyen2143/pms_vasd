"use client";
import { Link2, Pencil, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import UpdatePriorytyComponent from "../modal/update-priority-btn";
import UpdateSeverityComponent from "../modal/update-severity-btn";
import { BugStatus } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { toast } from "sonner";

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
  const [selectStatus, setSelectStatus] = useState<string>(bug.status);
  const { putData, isLoading, errorData } = useApi<
    string,
    { bug_id: number; status: string }
  >();
  const handleStatusChange = async () => {
    const newStatus = selectStatus;
    if (newStatus === bug.status) return; // No change, do nothing
    try {
      const re = await putData("/bugs/status", {
        bug_id: bug.id,
        status: newStatus,
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
      toast.error("Cập nhật trạng thái thất bại " + errorData.message);
      console.error("Error updating bug status:", errorData);
    }
  }, [errorData]);
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-primary">🐞 Thông tin Bug</h2>
        {!hiddenButton ? (
          <div className="flex gap-2">
            <div className="tooltip" data-tip="Chỉnh sửa thông tin">
              <button onClick={onEdit}>
                <Pencil />
              </button>
            </div>
            <div
              className="tooltip"
              data-tip="Liên kết task, testcase liên quan"
            >
              <button onClick={onLinkRequirement}>
                <Link2 />
              </button>
            </div>
            <div className="tooltip" data-tip="Giao việc">
              <button onClick={onAssign}>
                <UserPlus />
              </button>
            </div>
            <div className="join">
              <div className="select join-item select-sm" data-tip="Bug hợp lệ">
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
                className="tooltip join-item btn btn-sm"
                data-tip="Bug không hợp lệ"
                onClick={handleStatusChange}
                disabled={isLoading || selectStatus === bug.status}
              >
                Cập nhật
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="space-y-2">
        <p>
          <strong>Tiêu đề:</strong> {bug.title}
        </p>
        <p>
          <strong>Mô tả:</strong> {bug.description}
        </p>
        <div className="flex gap-2">
          <p>
            <strong>Ưu tiên:</strong> {bug.priority}
          </p>
          {hiddenButton ? (
            ""
          ) : (
            <UpdatePriorytyComponent
              bug_id={bug.id}
              onUpdate={onUpdate}
              priority={bug.priority}
            />
          )}
        </div>
        <div className="flex gap-2">
          <p>
            <strong>Ảnh hưởng:</strong> {bug.severity}
          </p>
          {hiddenButton ? (
            ""
          ) : (
            <UpdateSeverityComponent
              bug_id={bug.id}
              onUpdate={onUpdate}
              severity={bug.severity}
            />
          )}
        </div>

        <p>
          <strong>Đã cập nhật:</strong> {bug.is_update ? "Có" : "Chưa"}
        </p>
        <p>
          <strong>Người báo cáo:</strong> {bug.reporter_name}
        </p>
        <p>
          <strong>Thời gian:</strong> {bug.reported_at}
        </p>
        <p>
          <strong>Tag:</strong>{" "}
          {bug.tags.map((t) => (
            <span key={t} className="badge badge-outline mx-1 badge-primary">
              {t}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
