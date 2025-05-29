"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

interface UpdatePhaseProps {
  phase_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  tags?: string[];
}
interface UpdatePhaseInfoProps {
  phaseInfor: {
    phase_id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    tags?: string[];
  };
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
function UpdatePhaseInfo({
  phaseInfor,
  onClose,
  onUpdate,
}: UpdatePhaseInfoProps) {
  const [name, setName] = useState(phaseInfor.name);
  const [description, setdescription] = useState(phaseInfor.description);
  const [startDate, setStartDate] = useState(phaseInfor.start_date);
  const [endDate, setendDate] = useState(phaseInfor.end_date);
  const [tagsChoose, settagsChoose] = useState<string[]>(phaseInfor.tags || []);
  const [newTag, setNewTag] = useState("");
  const { putData, isLoading, errorData } = useApi<"", UpdatePhaseProps>();
  useEffect(() => {
    if (errorData) {
      toast.error(
        errorData.message || "Lỗi không xác định khi cập nhật giai đoạn."
      );
    }
  }, [errorData]);
  const handleAddTag = () => {
    if (newTag.trim() && !tagsChoose.includes(newTag)) {
      settagsChoose((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    settagsChoose(tagsChoose.filter((tag) => tag !== tagToRemove));
  };
  const handleSubmit = async () => {
    const data: UpdatePhaseProps = {
      phase_id: phaseInfor.phase_id,
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      tags: tagsChoose,
    };
    const re = await putData("/project/phase", data);
    if (re != "") return;
    else {
      toast.success("Xử lý thành công");
      await onUpdate();
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Sửa thông tin giai đoạn</h3>
        <div className="flex flex-col gap-1 px-4">
          <label className="input w-full">
            <span className="label">Tên giai đoạn</span>
            <input
              type="text"
              placeholder="Nhập tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="input w-full">
            <span className="label">Mô tả</span>
            <input
              type="text"
              placeholder="Nhập mô tả yêu cầu"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
          </label>
          <label className="input w-full">
            <span className="label">Ngày bắt đầu</span>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="input w-full">
            <span className="label">Ngày kết thúc</span>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setendDate(e.target.value)}
            />
          </label>
          <label className="join w-full">
            <span className="join-item border w-1/5 text-center items-center">
              Tags
            </span>
            <input
              type="text"
              value={newTag}
              className="join-item input"
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nhập thẻ và nhấn nút Thêm"
            />
            <button
              type="button"
              className="btn btn-outline join-item"
              onClick={handleAddTag}
            >
              Thêm
            </button>
          </label>
          <div className="flex gap-2 flex-wrap">
            {tagsChoose.map((tag, index) => (
              <div key={index} className="badge badge-info gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePhaseInfo;
