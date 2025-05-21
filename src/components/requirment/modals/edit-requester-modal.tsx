"use client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { ProjectLocation, RequirementDetail } from "~/lib/types";
import AddLocationModal from "./add-location-modal";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

interface EditRequesterProps {
  requiredInfor: RequirementDetail;
  location: ProjectLocation[];
  project_id: number;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
interface DataUpdateRequester {
  project_id: number;
  id: number;
  requester: {
    location_id: number;
    name: string;
    role: string;
  };
}
export default function EditRequesterModal({
  requiredInfor,
  project_id,
  location,
  onUpdate,
  onClose,
}: EditRequesterProps) {
  const [nameRequireter, setNameRequireter] = useState(
    requiredInfor.requesters.requester
  );
  const [loacationSelect, setLoacationSelect] = useState(
    requiredInfor.requesters.location_id
  );
  const [role, setRole] = useState(requiredInfor.requesters.role);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const { putData, errorData, isLoading } = useApi<"", DataUpdateRequester>();
  const handleSubmit = async () => {
    if (
      nameRequireter == requiredInfor.requesters.requester &&
      loacationSelect == requiredInfor.requesters.location_id &&
      role == requiredInfor.requesters.role
    ) {
      toast.info("Thông tin không có thay đổi");
      return;
    }
    const dataSend: DataUpdateRequester = {
      project_id,
      id: requiredInfor.id,
      requester: {
        location_id: loacationSelect,
        role,
        name: nameRequireter,
      },
    };
    await putData("/requirements/requester", dataSend);
    if (errorData) toast.error(errorData.message);
    else {
      toast.success("Cập nhật thành công");
      await onUpdate();
      onClose();
    }
  };
  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Sửa thông tin người yêu cầu</h3>
          <div className="flex flex-col gap-2 p-4">
            <div className="join w-full">
              <label className="select join-item w-full">
                <span className="label">Khoa/phòng</span>
                <select
                  name="division"
                  value={loacationSelect}
                  onChange={(e) =>
                    setLoacationSelect(Number.parseInt(e.target.value))
                  }
                >
                  <option value="" disabled>
                    Chọn khoa/phòng
                  </option>
                  {location.length > 0 ? (
                    location.map((local) => {
                      return (
                        <option
                          value={local.id}
                          key={"locationUpdate" + local.id}
                        >
                          {local.name}
                        </option>
                      );
                    })
                  ) : (
                    <option value="">Chưa có khoa phòng nào</option>
                  )}
                </select>
              </label>
              <div
                className="label tooltip join-item btn"
                data-tip={"Thêm khoa/phòng mới"}
              >
                <Plus onClick={() => setShowAddLocationModal(true)}></Plus>
              </div>
            </div>

            <label className="input w-full">
              <span className="label flex-1/3">Người yêu cầu</span>
              <input
                type="text"
                placeholder="Nhập tên người yêu cầu"
                value={nameRequireter}
                required
                title="Tên người yêu cầu không bỏ trống"
                onChange={(e) => setNameRequireter(e.target.value)}
              />
            </label>

            <label className="input w-full">
              <span className="label flex-1/3">Vai trò</span>
              <input
                type="text"
                value={role}
                required
                title="Vai trò không được trống"
                onChange={(e) => setRole(e.target.value)}
              />
            </label>
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={onClose}>
              Đóng
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-ring loading-sm"></span>
              ) : (
                "Lưu"
              )}
            </button>
          </div>
        </div>
      </div>
      {showAddLocationModal && (
        <AddLocationModal
          onClose={() => setShowAddLocationModal(false)}
          project_id={project_id}
        />
      )}
    </>
  );
}
