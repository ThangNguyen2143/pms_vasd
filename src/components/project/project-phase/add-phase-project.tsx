"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
interface AddPhaseData {
  project_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  tags?: string[];
}
interface AddPhaseProjectModalProps {
  project_id: number;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
function AddPhaseProjectModal({
  onClose,
  project_id,
  onUpdate,
}: AddPhaseProjectModalProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [tagsChoose, setTagsChoose] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const { postData, isLoading, errorData } = useApi<"", AddPhaseData>();
  useEffect(() => {
    if (errorData) {
      toast.error(
        errorData.message || "Lỗi không xác định khi thêm giai đoạn."
      );
    }
  }, [errorData]);
  const handleAddTag = () => {
    if (newTag.trim() && !tagsChoose.includes(newTag)) {
      setTagsChoose((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsChoose(tagsChoose.filter((tag) => tag !== tagToRemove));
  };

  const handlerAddPhaseProject = async () => {
    if (!name || !description || !startDate || !endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const dataSend: AddPhaseData = {
      project_id,
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      tags: tagsChoose.length > 0 ? tagsChoose : undefined,
    };
    const res = await postData("/project/phase", dataSend);
    if (res == "") {
      toast.success("Cập nhật thông tin thành công");
      await onUpdate();
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setTagsChoose([]);
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Thêm giai đoạn thực hiện</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tên giai đoạn</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập tên giai đoạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <p className="validator-hint">Tên giai đoạn không được trống</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Mô tả</legend>
          <RichTextEditor
            placeholder="Nhập mô tả giai đoạn"
            value={description}
            onChange={setDescription}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Thời gian bắt đầu</legend>
          <DateTimePicker
            value={startDate}
            onChange={setStartDate}
            className="w-full"
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Thời gian kết thúc</legend>
          <DateTimePicker
            value={endDate}
            onChange={setEndDate}
            className="w-full"
          />
        </fieldset>
        <label className="join w-full">
          <span className="join-item border w-1/5 flex justify-center items-center border-blue-200">
            Tags
          </span>
          <input
            type="text"
            value={newTag}
            className="join-item input"
            onChange={(e) => setNewTag(e.target.value)}
            onKeyUp={(e) => {
              if (e.key == "Enter") handleAddTag();
            }}
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
        <div className="flex gap-2 flex-wrap mt-2">
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
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handlerAddPhaseProject}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Thêm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPhaseProjectModal;
