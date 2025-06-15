"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { Contact } from "~/lib/types";
interface AddStakeholderData {
  project_id: number;
  name: string;
  description: string;
  contact?: Contact[];
}
function AddStakeholderModal({
  project_id,
  onUpdate,
  onClose,
}: {
  onUpdate: () => Promise<void>;
  project_id: number;
  onClose: () => void;
}) {
  const nameRegex = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;
  const [name, setName] = useState<string>("");
  const [ErrorName, setErrorName] = useState<string>();
  const [description, setDescription] = useState<string>("");
  const [listContacts, setlistContacts] = useState<Contact[]>([
    { code: "email", value: "" },
  ]);
  const { postData, errorData, isLoading } = useApi<"", AddStakeholderData>();
  const handleBlur = () => {
    const trimmed = name.trim();
    if (!nameRegex.test(trimmed)) {
      setErrorName(
        "Tên không hợp lệ! Chỉ chứa chữ cái, không bao gồm số hoặc ký tự đặc biệt."
      );
    } else {
      setErrorName(undefined);
    }
  };
  const handleAddContact = () => {
    setlistContacts([...listContacts, { code: "email", value: "" }]);
  };
  const handleRemoveContact = (index: number) => {
    setlistContacts(listContacts.filter((_, i) => i !== index));
  };
  const handleContactChange = (
    index: number,
    field: keyof Contact,
    value: string
  ) => {
    const newContacts = [...listContacts];
    newContacts[index][field] = value;
    setlistContacts(newContacts);
  };

  const handlerUpdateInfoProject = async () => {
    const dataSend: AddStakeholderData = {
      name,
      description,
      project_id,
      contact: listContacts,
    };

    const res = await postData("/project/stakeholders", dataSend);

    if (res == "") {
      toast.success("Xử lý thành công");
      await onUpdate();
      onClose();
    } else {
      toast.error(errorData?.message);
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Thêm người liên quan vào dự án</h3>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Họ tên người liên quan</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập họ tên"
            onBlur={handleBlur}
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (ErrorName) setErrorName(undefined);
            }}
          />
          <p className="validator-hint">Tên không được trống</p>
          {ErrorName && <p className="text-error">{ErrorName}</p>}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Mô tả</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập mô tả"
            value={description}
            minLength={1}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="validator-hint">Mô tả không được trống</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Liên hệ</legend>
          {listContacts.map((contact, index) => (
            <div key={index} className="join">
              <select
                className="select join-item"
                value={contact.code}
                onChange={(e) =>
                  handleContactChange(index, "code", e.target.value)
                }
              >
                <option value="email">Email</option>
                <option value="phone">Số điện thoại</option>
                <option value="zalo">Zalo</option>
                <option value="telegram">Telegram</option>
                <option value="other">Khác</option>
              </select>
              <input
                type="text"
                className="input join-item"
                placeholder="Nhập liên hệ"
                value={contact.value}
                onChange={(e) =>
                  handleContactChange(index, "value", e.target.value)
                }
              />
              {listContacts.length > 1 && (
                <button
                  type="button"
                  className="btn btn-error join-item"
                  onClick={() => handleRemoveContact(index)}
                >
                  Xoá
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={handleAddContact}
          >
            + Thêm liên hệ
          </button>
        </fieldset>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handlerUpdateInfoProject}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStakeholderModal;
