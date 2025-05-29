"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

interface CreateTimeLineData {
  project_id: number; //ID dự án (truyền từ component cha)
  phase_id: number; //ID giai đoạn (truyền từ component cha)
  name: string; //Tên công việc
  description: string; //Mô tả công việc
  start_date: string; // Ngầy bắt đầu
  end_date: string; //Ngày kết thúc
  weight: number; //Trọng số (Mức độ quan trọng), kiểu Number. Type input range
  tags: string[]; //Nhãn (Để đánh dấu công việc)
}

export default function CreateTimelineForm({
  projectId,
  phaseId,
  onUpdate,
}: {
  projectId: number;
  phaseId: number;
  onUpdate: (phase_id: number) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weight, setWeight] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
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
      weight,
      tags,
    };
    console.log(timelineData);
    const re = await postData("/project/timeline", timelineData);
    if (re != "") return;
    await onUpdate(phaseId);
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setWeight(1);
    setTags([]);
  };

  return (
    <div className="p-4 border border-dashed rounded-md bg-base-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Tên công việc"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mô tả"
          className="input input-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
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
        <input
          type="text"
          placeholder="Nhãn (cách nhau bởi dấu phẩy)"
          className="input input-bordered w-full"
          onChange={(e) =>
            setTags(e.target.value.split(",").map((tag) => tag.trim()))
          }
        />
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
