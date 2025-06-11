"use client";

import { useActionState, useEffect, useState } from "react";
import { handleAddProduct } from ".";
import ErrorMessage from "../ui/error-message";

function AddProductBtn({ project_id }: { project_id: number }) {
  const [state, action, pending] = useActionState(handleAddProduct, undefined);
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);

  useEffect(() => {
    if (state?.message) {
      setIsOpenErrorDialog(true); // Show error dialog if there is a message
    }
  }, [state?.message]); // Only run when state.message changes
  if (project_id === 0) {
    return (
      <label htmlFor="AddGroupDialog" className="btn btn-info disabled">
        Thêm phần mềm
      </label>
    );
  }
  return (
    <>
      <label htmlFor="AddGroupDialog" className="btn btn-info">
        Thêm phần mềm
      </label>
      <input type="checkbox" id="AddGroupDialog" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box justify-items-center">
          <h3 className="text-xl font-bold p-4">Thêm phần mềm mới</h3>
          <form action={action}>
            <input
              type="hidden"
              name="project_id"
              value={project_id}
              readOnly
            />
            <div className="flex flex-col gap-4 justify-center">
              <label className="input">
                <span className="label">Tên phần mềm</span>
                <input
                  type="text"
                  placeholder="Nhập tên phần mềm"
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
                <span className="label">Mô tả</span>
                <input
                  type="text"
                  placeholder="Nhập mô tả phần mềm"
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
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button className="btn btn-dash">Sao chép module</button>
                  <button className="btn btn-primary">Thêm module</button>
                </div>
              </div>
              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  disabled={pending}
                >
                  {pending ? "Đang xử lý..." : "Thêm"}
                </button>
                <label htmlFor="AddGroupDialog" className="btn btn-error ml-4">
                  Hủy
                </label>
              </div>
            </div>
          </form>

          <label className="modal-backdrop" htmlFor="AddGroupDialog">
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

export default AddProductBtn;
