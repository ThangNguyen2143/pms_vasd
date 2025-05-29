import { useState } from "react";
import Dialog from "../ui/dialog";
import { Priority, WorkType } from "~/lib/types";
import { HandlerAddWork } from "./action";

function AddWorkBtn({
  project_id,
  priority,
  typeWork,
  onSuccess,
}: {
  project_id: string;
  priority: Priority[];
  typeWork: WorkType[];
  onSuccess: () => Promise<void>;
}) {
  //fetch data priority
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    setErrors(null);
    setMessage(null);

    const result = await HandlerAddWork(formData);
    setPending(false);

    if (!result.ok) {
      setErrors(result.errors ?? null);
      setMessage(result.message ?? null);
      return;
    }

    await onSuccess();
    // Đóng dialog nếu cần hoặc reset form
    document.getElementById("AddWorkBtn")?.click();
  };
  if (project_id === "0") {
    // If project_id is empty, return a button without opening the modal
    return (
      <label htmlFor="AddWorkDialog" className="btn btn-primary">
        Thêm công việc
      </label>
    );
  }
  // If project_id is not empty, return a button that opens the modal
  return (
    <Dialog
      title="Thêm công việc mới"
      nameBtn={<>+ Thêm công việc</>}
      typeBtn="primary"
      sizeBox="sm"
      id="AddWorkBtn"
    >
      <div className="flex flex-col gap-4">
        <form
          action={handleSubmit}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: vì action không phải form action chuẩn
        >
          <input type="hidden" value={project_id} readOnly name="project_id" />
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Tiêu đề</legend>
            <input
              type="text"
              placeholder="Tên công việc"
              className="input"
              name="title"
            />
            {errors?.title && (
              <label className="label text-red-500">{errors.title}</label>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Mức độ ưu tiên</legend>

            <select
              className="select select-bordered w-full max-w-xs"
              name="priority"
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                Chọn mức độ ưu tiên
              </option>
              {priority.map((item, index) => {
                return (
                  <option key={index} value={item.code}>
                    {item.display}
                  </option>
                );
              })}
            </select>
            {errors?.priority && (
              <label className="label text-red-500">{errors.priority}</label>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Loại công việc</legend>

            <select
              className="select select-bordered"
              name="type"
              required
              defaultValue={""}
            >
              <option disabled value={""}>
                Chọn loại công việc
              </option>
              {typeWork.map((item, index) => {
                return (
                  <option key={index} value={item.code}>
                    {item.display}
                  </option>
                );
              })}
            </select>
            {errors?.type && (
              <label className="label text-red-500">{errors.type}</label>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Thời gian ghi nhận</legend>
            <input type="date" className="input" name="request_at" required />
            {errors?.request_at && (
              <label className="label text-red-500">{errors.request_at}</label>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Hạn chót</legend>
            <input
              type="datetime-local"
              className="input"
              name="deadline"
              required
            />
            {errors?.deadline && (
              <label className="label text-red-500">{errors.deadline}</label>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Chịu trách nhiệm</legend>
            <input type="text" className="input" name="pic" required />
            {errors?.pic && (
              <label className="label text-red-500">{errors.pic}</label>
            )}
          </fieldset>
          <div className="flex justify-evenly w-full max-w-xs mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pending}
            >
              {pending ? "Đang xử lý..." : "Thêm công việc"}
            </button>
            <label htmlFor="AddWorkBtn" className="btn">
              Hủy
            </label>
          </div>
          {message && (
            <div className="alert alert-error shadow-lg mt-4">
              <div>
                <span>{"Lỗi: " + message + " " + message}</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </Dialog>
  );
}

export default AddWorkBtn;
