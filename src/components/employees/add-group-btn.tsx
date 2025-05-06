"use client";
import { useActionState, useEffect, useState } from "react";
import { HandleAddGroup } from "./actions";
import ErrorMessage from "../ui/error-message";

function AddGroupBtn() {
  const [state, action, pending] = useActionState(HandleAddGroup, undefined);
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);

  useEffect(() => {
    if (state?.message) {
      setIsOpenErrorDialog(true); // Show error dialog if there is a message
    }
  }, [state?.message]); // Only run when state.message changes
  return (
    <>
      <label htmlFor="AddGroupDialog" className="btn btn-info">
        Thêm nhóm
      </label>
      <input type="checkbox" id="AddGroupDialog" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box justify-items-center">
          <h3 className="text-xl font-bold p-4">Thêm nhóm mới</h3>
          <form action={action}>
            <div className="flex flex-col gap-4 justify-center">
              <label className="input">
                <span className="label">Tên nhóm</span>
                <input
                  type="text"
                  placeholder="Nhập tên nhóm"
                  name="group_name"
                  min={1}
                />
              </label>
              {state?.errors?.group_name && (
                <div className="validator-hint text-error">
                  {state.errors.group_name}
                </div>
              )}
              <label className="input">
                <span className="label">Mô tả</span>
                <input
                  type="text"
                  placeholder="Nhập mô tả nhóm"
                  name="group_description"
                  className="validator"
                  minLength={2}
                />
              </label>
              {state?.errors?.group_description && (
                <div className="validator-hint text-error">
                  {state.errors.group_description}
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

export default AddGroupBtn;
