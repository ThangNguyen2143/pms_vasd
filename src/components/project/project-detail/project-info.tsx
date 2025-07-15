"use client";
import { Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProjectDetailDto, ProjectStatus } from "~/lib/types";
import UpdateInfoProjectModal from "./modals/update-info-modal";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { status_with_color_badge } from "~/utils/status-with-color";
import { format_date } from "~/utils/fomat-date";

export default function ProjectInfo({
  info,
  statusList,
  onUpdate,
}: {
  info: ProjectDetailDto;
  statusList: ProjectStatus[] | null;
  onUpdate: () => Promise<void>;
}) {
  const [showUpdateInfoModal, setShowModal] = useState<boolean>(false);
  const [showUpdateStatus, setshowUpdateStatus] = useState(false);
  const [selectStatus, setSelectStatus] = useState(info.status);
  const { putData, errorData, isLoading } = useApi<
    "",
    { project_id: number; status: string }
  >();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerUpdateStatus = async () => {
    const re = await putData("/project/status", {
      project_id: info.id,
      status: selectStatus,
    });
    if (re != "") return;
    else {
      await onUpdate();
      setshowUpdateStatus(false);
      toast.success("Cập nhật trạng thái dự án thành công");
    }
  };
  return (
    <>
      <div className="bg-base-200 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold text-primary border-b pb-2 mb-4">
          📁 Thông tin dự án
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-bold">Mã dự án:</span> {info.seft_code}
          </p>
          <p>
            <span className="font-bold">Tên:</span> {info.name}
          </p>
          <p>
            <span className="font-bold">Mô tả:</span> {info.description}
          </p>
          <p>
            <span className="font-bold">Ngày tạo:</span>{" "}
            {format_date(info.create_at)}
          </p>
          <p>
            <span className="font-bold">Bắt đầu:</span>{" "}
            {format_date(info.start_date)}
          </p>
          <p>
            <span className="font-bold">Kết thúc dự kiến:</span>{" "}
            {format_date(info.end_date)}
          </p>
          <p>
            <span className="font-bold">Kết thúc thực tế:</span>{" "}
            {info.actual_end_date ? format_date(info.actual_end_date) : "-"}
          </p>
          <p>
            <span className="font-bold">Trạng thái:</span>
            <span className={status_with_color_badge[info.status]}>
              {statusList?.find((st) => st.code == info.status)?.display}
            </span>
          </p>
        </div>
        <div className="flex justify-end gap-1">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Pencil />
          </button>
          <div className="join">
            <label className="join-item swap swap-rotate btn btn-secondary btn-outline">
              <input
                type="checkbox"
                onChange={() => setshowUpdateStatus(!showUpdateStatus)}
                checked={showUpdateStatus}
              />
              <span className="swap-off">Trạng thái</span>
              <span className="swap-on tooltip" data-tip={"Đóng"}>
                <X></X>
              </span>
            </label>
            {showUpdateStatus && (
              <>
                <select
                  className="select join-item max-w-50"
                  onChange={(e) => setSelectStatus(e.target.value)}
                  value={selectStatus}
                >
                  {statusList &&
                    statusList.length > 0 &&
                    statusList.map((st) => {
                      if (st.code == info.status)
                        return (
                          <option key={st.code} disabled value={st.code}>
                            {st.display}
                          </option>
                        );
                      return (
                        <option key={st.code} value={st.code}>
                          {st.display}
                        </option>
                      );
                    })}
                </select>
                <button
                  className="btn join-item "
                  onClick={() => handlerUpdateStatus()}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Cập nhật"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showUpdateInfoModal && (
        <UpdateInfoProjectModal
          onClose={() => setShowModal(false)}
          info={info}
        />
      )}
    </>
  );
}
