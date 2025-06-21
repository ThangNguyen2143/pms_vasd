"use client";
import { useActionState, useEffect, useState } from "react";
import ErrorMessage from "../ui/error-message";
import { HandleAddProject } from "./actions";
function AddProjectBtn() {
  const [state, action, pending] = useActionState(HandleAddProject, undefined);
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);

  useEffect(() => {
    if (state?.message) {
      setIsOpenErrorDialog(true); // Show error dialog if there is a message
    }
  }, [state?.message]); // Only run when state.message changes

  return (
    <>
      <label htmlFor="AddProjectDialog" className="btn btn-info">
        Thêm dự án
      </label>
      <input type="checkbox" id="AddProjectDialog" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box justify-items-center">
          <h3 className="text-xl font-bold p-4">Thêm dự án mới</h3>
          <form action={action}>
            <div className="flex flex-col gap-4 justify-center">
              <label className="input">
                <span className="label">Tên dự án</span>
                <input
                  type="text"
                  placeholder="Nhập tên dự án"
                  name="name"
                  min={1}
                />
              </label>
              {state?.errors?.name && (
                <div className="validator-hint text-error">
                  {state.errors.name}
                </div>
              )}
              <label className="input">
                <span className="label">Mã tự đặt</span>
                <input
                  type="text"
                  placeholder="Nhập tên dự án"
                  name="seft_code"
                  className="validator"
                  min={1}
                />
              </label>
              {state?.errors?.seft_code && (
                <div className="validator-hint text-error">
                  {state.errors.seft_code}
                </div>
              )}

              <label className="input">
                <span className="label">Mô tả dự án</span>
                <input
                  type="text"
                  placeholder="Nhập mô tả dự án"
                  name="description"
                  className="validator"
                  minLength={2}
                />
              </label>
              {state?.errors?.description && (
                <div className="validator-hint text-error">
                  {state.errors.description}
                </div>
              )}
              <label className="input">
                <span className="label">Ngày bắt đầu</span>
                <input type="date" name="start_date" className="validator" />
              </label>
              {state?.errors?.start_date && (
                <div className="validator-hint text-error">
                  {state.errors.start_date}
                </div>
              )}
              <label className="input">
                <span className="label">Ngày kết thúc</span>
                <input type="date" name="end_date" className="validator" />
              </label>
              {state?.errors?.end_date && (
                <div className="validator-hint text-error">
                  {state.errors.end_date}
                </div>
              )}
              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  disabled={pending}
                >
                  {pending ? "Đang xử lý..." : "Thêm"}
                </button>
                <label
                  htmlFor="AddProjectDialog"
                  className="btn btn-error ml-4"
                >
                  Hủy
                </label>
              </div>
            </div>
          </form>

          <label className="modal-backdrop" htmlFor="AddProjectDialog">
            Close
          </label>
        </div>
      </div>
      {state?.message && (
        <ErrorMessage
          isOpen={isOpenErrorDialog}
          onOpenChange={setIsOpenErrorDialog}
          errorData={{
            message: state.message.message,
            code: state.message.code,
            hint: state.message.hint,
            status: "error",
            value: "",
          }}
        />
      )}
    </>
  );
}

export default AddProjectBtn;
