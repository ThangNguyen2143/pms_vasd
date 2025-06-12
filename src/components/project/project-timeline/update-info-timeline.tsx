"use client";
import { useState } from "react";
import DateTimePicker from "~/components/ui/date-time-picker";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { ProjectTimeLine, ProjectTimeLineDetail } from "~/lib/types";
interface UpdateTimelineData {
  project_id: number; //ID dự án (truyền từ component cha)
  phase_id: number; //ID giai đoạn (truyền từ component cha)
  name: string; //Tên công việc
  description: string; //Mô tả công việc
  start_date: string; // Ngầy bắt đầu
  end_date: string; //Ngày kết thúc
  parent_id?: number;
  weight: number; //Trọng số (Mức độ quan trọng), kiểu Number. Type input range
  tags: string[]; //Nhãn (Để đánh dấu công việc)
}
interface UpdateProps {
  timelineData: ProjectTimeLineDetail;
  timelineList: ProjectTimeLine[];
  onPut: (data: UpdateTimelineData) => Promise<string | null>;
  onClose: () => void;
  isLoading: boolean;
}
function UpdateInfoForm({
  timelineData,
  timelineList,
  onPut,
  onClose,
  isLoading,
}: UpdateProps) {
  const [name, setName] = useState(timelineData.info.name);
  const [description, setDescription] = useState(timelineData.info.description);
  const [startDate, setStartDate] = useState(timelineData.info.start_date);
  const [endDate, setEndDate] = useState(timelineData.info.end_date);
  const [weight, setWeight] = useState(timelineData.info.weight);
  const [tagsChoose, setTagsChoose] = useState<string[]>(
    timelineData.info.tags || []
  );
  const [newTag, setNewTag] = useState<string>("");
  // const [tags, setTags] = useState<string[]>(timelineData.info.tags);
  const [parent, setParent] = useState<number>(timelineData.parent_id || 0);
  const handldUpdate = async () => {
    const parent_id = parent == 0 ? undefined : parent;
    const data = {
      timeline_id: timelineData.id,
      name,
      description,
      end_date: endDate,
      phase_id: timelineData.phase_id,
      project_id: timelineData.project_id,
      start_date: startDate,
      tags: tagsChoose.length > 0 ? tagsChoose : [],
      weight,
      parent_id,
    };
    await onPut(data);
  };
  const handleAddTag = () => {
    if (newTag.trim() && !tagsChoose.includes(newTag)) {
      setTagsChoose((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsChoose(tagsChoose.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="floating-label">
        <span className="label">Tên công việc</span>
        <input
          type="text"
          placeholder="Tên công việc"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <div className="flex gap-2 items-center">
        <label className="label">Trọng số:</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          min={1}
          max={100}
        />
        <input
          type="range"
          min={1}
          max={100}
          className="range"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
      </div>
      <div className="md:col-span-2">
        <label className="floating-label">
          <span className="label">Mô tả</span>
          <RichTextEditor
            placeholder="Mô tả"
            value={description}
            onChange={setDescription}
          />
        </label>
      </div>

      <label className="floating-label">
        <span className="label">Ngày bắt đầu</span>
        <DateTimePicker
          value={startDate}
          placeholder="Ngày bắt đầu"
          onChange={setStartDate}
          className=" w-full"
        />
      </label>
      <label className="floating-label">
        <span className="label">Ngày kết thúc</span>
        <DateTimePicker
          value={endDate}
          onChange={setEndDate}
          placeholder="Ngày kết thúc"
          className=" w-full"
        />
      </label>
      <div>
        <label className="w-full">
          <label className="floating-label">
            <span className="label">Tags</span>
            <input
              type="text"
              value={newTag}
              className="input"
              onChange={(e) => setNewTag(e.target.value)}
              onKeyUp={(e) => {
                if (e.key == "Enter") handleAddTag();
              }}
              placeholder="Nhập thẻ và nhấn enter"
            />
          </label>
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
      </div>

      <label className="floating-label">
        <span className="label">Phụ thuộc</span>
        <select
          className="select w-full"
          title="Timeline cha"
          defaultValue={""}
          value={parent}
          onChange={(e) => setParent(parseInt(e.target.value))}
        >
          <option value={0}>Chọn timeline phụ thuộc</option>
          {timelineList && timelineList.length > 0 ? (
            timelineList.map((tl) => (
              <option key={tl.id + "tl_dep" + timelineData.id} value={tl.id}>
                {tl.name}
              </option>
            ))
          ) : (
            <option value="">Chưa có timeline nào</option>
          )}
        </select>
      </label>
      <div className="modal-action col-span-2">
        <button
          className="btn btn-primary"
          onClick={handldUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Cập nhật"
          )}
        </button>
        <button className="btn btn-dash" onClick={onClose}>
          Hủy
        </button>
      </div>
    </div>
  );
}

export default UpdateInfoForm;
