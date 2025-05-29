"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
interface AddGroupData {
  project_id: number;
  display: string;
  type: string;
  value: string;
}
function AddGroupContactModal({
  project_id,
  onClose,
}: {
  project_id: number;
  onClose: () => void;
}) {
  const [type, setType] = useState<string>("");
  const [display, setDisplay] = useState<string>("");
  const [idTelegram, setIdTelegram] = useState<string>("");
  const { putData, errorData, isLoading } = useApi<"", AddGroupData>();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerAddGroupContact = async () => {
    const dataSend = {
      project_id,
      display,
      type,
      value: idTelegram,
    };
    const res = await putData("/project/contacts", dataSend);
    if (res == "") {
      toast.success("Cập nhật thông tin thành công");
      onClose();
    } else {
      return;
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Thêm nhóm liên hệ mới</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Loại nhóm</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập loại nhóm liên hệ"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <p className="validator-hint">Loại nhóm không để trống</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tên nhóm</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập tên nhóm"
            value={display}
            required
            onChange={(e) => setDisplay(e.target.value)}
          />
          <p className="validator-hint">Tên nhóm không được trống</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">ID Telegram</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập id nhóm Telegram"
            value={idTelegram}
            required
            onChange={(e) => setIdTelegram(e.target.value)}
          />
          <p className="validator-hint">Mô tả dự án không được trống</p>
        </fieldset>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary" onClick={handlerAddGroupContact}>
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Thêm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddGroupContactModal;
