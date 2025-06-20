import { useEffect, useState } from "react";
import Dialog from "../ui/dialog";
import { Priority, WorkType } from "~/lib/types";
// import { HandlerAddWork } from "./action";
import DateTimePicker from "../ui/date-time-picker";
import { CreateWorkSchema } from "~/lib/definitions";
import { useApi } from "~/hooks/use-api";
import { toast } from "sonner";
interface FormWorkData {
  title: string;
  priority: string;
  project_id: number;
  type: string;
  request_at: string;
  deadline: string;
  pic: string;
}
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
  const [formData, setFormData] = useState<FormWorkData>({
    deadline: "",
    pic: "",
    priority: "",
    project_id: 0,
    request_at: "",
    title: "",
    type: "",
  });
  const { postData, isLoading, errorData } = useApi<string, FormWorkData>();
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
  }, [errorData]);
  const handleSubmit = async () => {
    setErrors(null);
    setMessage(null);
    const validatedFields = CreateWorkSchema.safeParse({
      title: formData.title,
      priority: formData.priority,
      type: formData.type,
      request_at: formData.request_at as string,
      deadline: formData.deadline as string,
      project_id: Number(project_id),
      pic: formData.pic,
    });
    if (validatedFields.error) {
      setErrors(validatedFields.error.flatten().fieldErrors);
      return;
    }
    const dataSend = {
      ...validatedFields.data,
    };
    // 3. Insert the user call an Auth Library's API
    const data = await postData("/work", dataSend);
    if (data == "") {
      toast.success("Xử lý thành công");
      await onSuccess();
      document.getElementById("AddWorkBtn")?.click();
    }
    // Đóng dialog nếu cần hoặc reset form
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
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tiêu đề</legend>
          <input
            type="text"
            placeholder="Tên công việc"
            className="input"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, title: e.target.value }))
            }
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
            value={formData.priority}
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, priority: e.target.value }))
            }
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
            value={formData.type}
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, type: e.target.value }))
            }
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
          <input
            type="date"
            className="input"
            name="request_at"
            required
            value={formData.request_at}
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, request_at: e.target.value }))
            }
          />
          {errors?.request_at && (
            <label className="label text-red-500">{errors.request_at}</label>
          )}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Hạn chót</legend>
          <DateTimePicker
            value={formData.deadline}
            onChange={(e) => setFormData((pre) => ({ ...pre, deadline: e }))}
            className="input-neutral w-full"
          />
          {errors?.deadline && (
            <label className="label text-red-500">{errors.deadline}</label>
          )}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Chịu trách nhiệm</legend>
          <input
            type="text"
            className="input"
            name="pic"
            required
            value={formData.pic}
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, pic: e.target.value }))
            }
          />
          {errors?.pic && (
            <label className="label text-red-500">{errors.pic}</label>
          )}
        </fieldset>
        <div className="flex justify-evenly w-full max-w-xs mt-3">
          <button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Đang xử lý..." : "Thêm công việc"}
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
      </div>
    </Dialog>
  );
}

export default AddWorkBtn;
