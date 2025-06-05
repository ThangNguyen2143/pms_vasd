"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

function CreateTaskForm({
  product_id,
  onSuccess,
}: {
  product_id: string;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const { postData, isLoading } = useApi<"">();

  const handleSubmit = async () => {
    const data = {
      product_id,
      title,
      description,
      dead_line: deadline,
    };
    const result = await postData("/tasks", data);
    if (result !== null) {
      toast.success("Tạo công việc thành công");
      onSuccess(); // gọi lại TaskList để reload
      setTitle("");
      setDescription("");
      setDeadline("");
    }
  };
  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 rounded-lg">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Tiêu đề</legend>
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Tiêu đề công việc"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Deadline</legend>
        <input
          className="input input-bordered w-full"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset md:col-span-2 ">
        <legend className="fieldset-legend">Mô tả</legend>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Mô tả công việc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Liên kết yêu cầu</legend>
        <select className="select">
          <option value="">Yêu cầu</option>
        </select>
      </fieldset>
      <fieldset className="fieldset md:col-span-2">
        <legend className="fieldset-legend">
          <span>Tiêu chí chấp thuận</span> <span onClick={() => {}}>+</span>
        </legend>
        <div>
          <label className="input">
            <span className="label">Tiêu chí:</span>
            <input type="text" placeholder="Nội dung" />
            <select>
              <option value="">Chọn loại</option>
            </select>
          </label>
        </div>
      </fieldset>
      <div className="flex justify-between md:col-span-2">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Đang tạo..." : "Tạo công việc"}
        </button>
        <button
          className="btn btn-outline btn-accent"
          onClick={() => handleReset()}
        >
          Làm mới
        </button>
      </div>
    </div>
  );
}

export default CreateTaskForm;
