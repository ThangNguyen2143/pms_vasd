"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { RequirementDetail, RequirementType } from "~/lib/types";

interface EditRequestInfoProps {
  requiredInfor: RequirementDetail;
  typeList: RequirementType[];
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
interface DataUpdate {
  product_id: string;
  id: number;
  title: string;
  description: string;
  type: string;
  // type: string;
  date_receive: string;
  tags: string[];
}
export default function EditRequirementModal({
  typeList,
  requiredInfor,
  onUpdate,
  onClose,
}: EditRequestInfoProps) {
  const [title, settitle] = useState(requiredInfor.title);
  const [description, setdescription] = useState(requiredInfor.description);
  const [typeSelected, settypeSelected] = useState(requiredInfor.type || "");
  const [dateReceive, setdateReceive] = useState(requiredInfor.date_create);
  const [tagsChoose, settagsChoose] = useState<string[]>(
    requiredInfor.tags || []
  );
  const [newTag, setNewTag] = useState("");
  const { putData, isLoading, errorData } = useApi<"", DataUpdate>();
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
    const data: DataUpdate = {
      product_id: requiredInfor.product_id,
      date_receive: dateReceive,
      description,
      id: requiredInfor.id,
      type: typeSelected,
      // priority: prioritySelected,
      tags: tagsChoose,
      title,
    };
    await putData("/requirements/info", data);
    if (errorData) toast.error(errorData.message);
    else {
      toast.success("Xử lý thành công");
      await onUpdate();
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Sửa thông tin yêu cầu</h3>
        <div className="flex flex-col gap-1 px-4">
          <label className="input w-full">
            <span className="label">Tiêu đề</span>
            <input
              type="text"
              placeholder="Nhập tiêu đề"
              value={title}
              onChange={(e) => settitle(e.target.value)}
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
          <label className="select w-full">
            <span className="label">Loại yêu cầu</span>
            <select
              name="type_requirement"
              id=""
              value={typeSelected}
              onChange={(e) => settypeSelected(e.target.value)}
            >
              <option value="" disabled>
                Chọn loại yêu cầu
              </option>
              {typeList.map((type) => {
                return (
                  <option value={type.code} key={"typeUpdate" + type.code}>
                    {type.display}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="input w-full">
            <span className="label">Ngày ghi nhận</span>
            <input
              type="datetime-local"
              value={dateReceive}
              onChange={(e) => setdateReceive(e.target.value)}
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
          <div className="flex gap-2">
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
