"use client";
import { useState } from "react";
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
  const [tags, setTags] = useState<string[]>(timelineData.info.tags);
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
      tags,
      weight,
      parent_id,
    };
    await onPut(data);
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
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label className="floating-label">
        <span className="label">Ngày kết thúc</span>
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          placeholder="Ngày kết thúc"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>

      <label className="floating-label">
        <span className="label">Tags</span>
        <input
          type="text"
          placeholder="Nhãn (cách nhau bởi dấu phẩy)"
          className="input input-bordered w-full"
          defaultValue={tags}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((tag) => tag.trim()))
          }
        />
      </label>
      <label className="floating-label">
        <span className="label">Phụ thuộc</span>
        <select
          className="select w-full"
          title="Timeline cha"
          defaultValue={""}
          value={parent}
          onChange={(e) => setParent(parseInt(e.target.value))}
        >
          {timelineList && timelineList.length > 0 ? (
            <>
              <option value={0}>Chọn timeline phụ thuộc</option>
              {timelineList.map((tl) => (
                <option key={tl.id + "tl_dep" + timelineData.id} value={tl.id}>
                  {tl.name}
                </option>
              ))}
            </>
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
