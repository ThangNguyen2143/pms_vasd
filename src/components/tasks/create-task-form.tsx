"use client";
import { useState } from "react";
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
      alert("Tạo công việc thành công");
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
    <div className="flex flex-col gap-2 p-4 rounded-lg">
      <input
        className="input input-bordered"
        type="text"
        placeholder="Tiêu đề công việc"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered"
        placeholder="Mô tả công việc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="input input-bordered"
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <div className="flex justify-between">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Đang tạo..." : "Tạo công việc"}
        </button>
        <button
          className="btn btn-outline btn-accent"
          onClick={() => handleReset}
        >
          Làm mới
        </button>
      </div>
    </div>
  );
}

export default CreateTaskForm;
