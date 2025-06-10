"use client";
import { useEffect, useState } from "react";

import { AccountType, Contact, CreateUserDto } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import clsx from "clsx";
import { toast } from "sonner";

function AddUserBtn({
  onUpdate,
  account_type,
}: {
  onUpdate: () => Promise<void>;
  account_type: AccountType[];
}) {
  // const [state, action, pending] = useActionState(HandlerAddUser, undefined);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [accountSelect, setAccountSelect] = useState("");
  const [listContacts, setlistContacts] = useState<Contact[]>([
    { code: "email", value: "" },
  ]);
  const { postData, isLoading, errorData } = useApi<"", CreateUserDto>();
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
  const handleSubmit = async () => {
    const dataSend: CreateUserDto = {
      userData: {
        display_name: name,
        birthday: "2000-01-01",
        gender: "male",
        contact: listContacts,
      },
      accountData: {
        username,
        account_type: accountSelect,
      },
    };
    const re = await postData("/user/create", dataSend);
    if (re == "") {
      toast.success("Thêm tài khoản thành công");
      setShowAddModal(false);
      await onUpdate();
    }
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  return (
    <>
      <label
        htmlFor="AddUserDialog"
        className="btn btn-info"
        onClick={() => setShowAddModal(true)}
      >
        Thêm tài khoản
      </label>
      <div
        className={clsx("modal", showAddModal ? "modal-open" : "")}
        role="dialog"
      >
        <div className="modal-box">
          <h3 className="text-xl font-bold p-4">Thêm tài khoản mới</h3>
          <div>
            <div className="flex flex-col gap-4 justify-center">
              <label className="input w-full">
                <span className="label">Họ tên</span>
                <input
                  type="text"
                  value={name}
                  placeholder="Nhập họ tên"
                  name="display_name"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="input w-full">
                <span className="label">Tài khoản</span>
                <input
                  type="text"
                  placeholder="Nhập tên tài khoản"
                  value={username}
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="select w-full">
                <span className="label">Vai trò</span>
                <select
                  value={accountSelect}
                  onChange={(e) => setAccountSelect(e.target.value)}
                >
                  <option value="" disabled>
                    Chọn loại
                  </option>
                  {account_type?.map((type) => {
                    return (
                      <option value={type.code} key={type.code}>
                        {type.display}
                      </option>
                    );
                  })}
                </select>
              </label>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Liên hệ</legend>
                {listContacts.map((contact, index) => (
                  <label key={index} className="input w-full">
                    <select
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
                      placeholder="Nhập liên hệ"
                      value={contact.value}
                      onChange={(e) =>
                        handleContactChange(index, "value", e.target.value)
                      }
                    />
                    {listContacts.length > 1 && (
                      <button
                        type="button"
                        className="bg-error border rounded-full px-2"
                        onClick={() => handleRemoveContact(index)}
                      >
                        Xoá
                      </button>
                    )}
                  </label>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={handleAddContact}
                >
                  + Thêm liên hệ
                </button>
              </fieldset>
              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Thêm"
                  )}
                </button>
                <label
                  className="btn btn-error ml-4"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </label>
              </div>
            </div>
          </div>
        </div>
        <label
          className="modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          Close
        </label>
      </div>
    </>
  );
}

export default AddUserBtn;
