"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { ProjectTimeLine } from "~/lib/types";

interface CreateTimeLineData {
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

export default function CreateTimelineForm({
  projectId,
  phaseId,
  timelineList,
  onUpdate,
}: {
  projectId: number;
  phaseId: number;
  timelineList: ProjectTimeLine[];
  onUpdate: (phase_id: number) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weight, setWeight] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [parent, setParent] = useState<number>();
  const { postData, errorData, isLoading } = useApi<
    string,
    CreateTimeLineData
  >();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleSubmit = async () => {
    if (!name || !startDate || !endDate) return;
    const timelineData = {
      project_id: projectId,
      phase_id: phaseId,
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      parent_id: parent && parent > 0 ? parent : undefined,
      weight,
      tags,
    };
    const re = await postData("/project/timeline", timelineData);
    if (re != "") return;
    await onUpdate(phaseId);
    toast.success("Xử lý thành công");
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setWeight(1);
    setParent(0);
    setTags([]);
  };

  return (
    <div className="p-4 border border-dashed rounded-md bg-base-200 mb-4">
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
                  <option key={tl.id + "tl_dep" + phaseId} value={tl.id}>
                    {tl.name}
                  </option>
                ))}
              </>
            ) : (
              <option value="">Chưa có timeline nào</option>
            )}
          </select>
        </label>
      </div>
      <button
        className="btn btn-primary mt-4"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Tạo timeline"
        )}
      </button>
    </div>
  );
}
