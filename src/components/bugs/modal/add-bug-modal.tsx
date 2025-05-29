/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { BugSeverity, Priority } from "~/lib/types";

interface AddBugProps {
  product_id: string;

  onClose: () => void;
  onCreated: () => void;
}

interface DataCreate {
  product_id: string;
  title: string;
  description: string;
  priority: string;
  severity: string;
  tags: string[];
}

export default function AddBugModal({
  product_id,
  onClose,
  onCreated,
}: AddBugProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severitySelect, setSeveritySelected] = useState("");
  const [prioritySelected, setPrioritySelected] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const { postData, isLoading, errorData } = useApi<"", DataCreate>();
  const {
    data: severityList,
    getData: getSeverity,
    errorData: errorSeverity,
  } = useApi<BugSeverity[]>();
  const {
    data: priorityList,
    getData: getPriority,
    errorData: errorType,
  } = useApi<Priority[]>();
  useEffect(() => {
    getPriority("/system/config/eyJ0eXBlIjoicHJpb3JpdHkifQ==", "force-cache");
    getSeverity(
      "/system/config/eyJ0eXBlIjoiYnVnX3NldmVyaXR5In0=",
      "force-cache"
    );
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  if (!severityList || !priorityList) {
    if (errorSeverity) toast.error(errorSeverity.message);
    if (errorType) toast.error(errorType.message);
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      </div>
    );
  }
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!title || !description || !severitySelect || !prioritySelected) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const data: DataCreate = {
      product_id,
      title,
      description,
      priority: prioritySelected,
      tags,
      severity: severitySelect,
    };
    const re = await postData("/bugs", data);

    if (re != "") return;
    else {
      toast.success("Tạo yêu cầu thành công");
      onCreated();
      onClose();
    }
  };

  return (
    <div className="modal modal-open ">
      <div className="modal-box w-96">
        <h3 className="font-bold text-lg pb-2">Báo bug mới</h3>
        <div className="flex flex-col gap-2 px-4">
          <label className="floating-label">
            <span>Tiêu đề</span>
            <input
              type="text"
              className="input input-neutral"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Mô tả</legend>
            <textarea
              className="textarea textarea-neutral"
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </fieldset>
          <label className="floating-label">
            <span>Mức độ ưu tiên</span>
            <select
              className="select select-neutral"
              value={prioritySelected}
              onChange={(e) => setPrioritySelected(e.target.value)}
            >
              <option value="" disabled>
                Chọn mức độ
              </option>
              {priorityList.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.display}
                </option>
              ))}
            </select>
          </label>
          <label className="floating-label">
            <span>Mức độ nghiêm trọng</span>
            <select
              className="select select-neutral"
              value={severitySelect}
              onChange={(e) => setSeveritySelected(e.target.value)}
            >
              <option value="" disabled>
                Chọn mức độ
              </option>
              {severityList.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.display}
                </option>
              ))}
            </select>
          </label>

          <div className="join w-full">
            <input
              type="text"
              className="input join-item input-neutral"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyUp={(e) => {
                if (e.key == "Enter") handleAddTag();
              }}
              placeholder="Nhập thẻ và nhấn Thêm"
            />
            <button
              type="button"
              className="btn join-item btn-outline btn-neutral"
              onClick={handleAddTag}
            >
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <div key={idx} className="badge badge-info gap-2">
                {tag}
                <button
                  type="button"
                  className="text-xs ml-1"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Tệp đính kèm</legend>
            <input type="file" className="file-input" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Test case liên quan</legend>
            <select disabled>
              <option value="">Chọn test case liên kết</option>
            </select>
          </fieldset>
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
