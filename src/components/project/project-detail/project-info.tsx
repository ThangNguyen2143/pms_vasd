"use client";
import { Activity, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProjectDetailDto, ProjectStatus } from "~/lib/types";
import UpdateInfoProjectModal from "./modals/update-info-modal";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

export default function ProjectInfo({
  info,
  statusList,
}: {
  info: ProjectDetailDto;
  statusList: ProjectStatus[] | null;
}) {
  const [showUpdateInfoModal, setShowModal] = useState<boolean>(false);
  const [statusListShow, setStatusList] = useState<ProjectStatus[]>([]);
  const [selectStatus, setSelectStatus] = useState("");
  const { putData, errorData, isLoading } = useApi<
    "",
    { project_id: number; status: string }
  >();
  useEffect(() => {
    if (statusList) setStatusList([...statusList]);
    setSelectStatus(info.status);
  }, [statusList, info.status]);
  const handlerUpdateStatus = async () => {
    await putData("/project/status", {
      project_id: info.id,
      status: selectStatus,
    });
    if (errorData) toast.error(errorData.message);
    else toast.success("Cập nhật trạng thái dự án thành công");
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
            <span className="font-bold">Ngày tạo:</span> {info.create_at}
          </p>
          <p>
            <span className="font-bold">Bắt đầu:</span> {info.start_date}
          </p>
          <p>
            <span className="font-bold">Kết thúc dự kiến:</span> {info.end_date}
          </p>
          <p>
            <span className="font-bold">Kết thúc thực tế:</span>{" "}
            {info.actual_end_date || "-"}
          </p>
        </div>
        <div className="flex justify-end gap-1">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Pencil />
          </button>
          <div className="collapse w-fit ">
            <input type="checkbox" />
            <div className="relative row-start-1 col-start-1 btn btn-outline btn-secondary">
              <Activity />
            </div>
            <div className="collapse-content">
              <div className="join">
                <select
                  className="select join-item"
                  onChange={(e) => setSelectStatus(e.target.value)}
                  value={selectStatus}
                >
                  {statusListShow.length > 0 &&
                    statusListShow.map((st) => {
                      if (st.code == info.status)
                        return (
                          <option key={st.code} disabled value={st.code}>
                            {st.display}
                          </option>
                        );
                      return (
                        <option
                          key={st.code}
                          value={st.code}
                          // defaultChecked={st.code == info.status}
                        >
                          {st.display}
                        </option>
                      );
                    })}
                </select>
                <button
                  className="btn join-item"
                  onClick={() => handlerUpdateStatus()}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Cập nhật"
                  )}
                </button>
              </div>
            </div>
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
