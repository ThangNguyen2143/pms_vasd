"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, UserAssignsTask, UserDto } from "~/lib/types";
import { sendEmail, sendTelegram } from "~/utils/send-notify";

interface ResponseNotify {
  action: string;
  content: {
    task_id: number;
    task_name: string;
    message: string;
  };
  contact: Contact[];
}
interface DataSend {
  task_id: number;
  user_id: number;
  cur_deadLine: string;
}
export default function AssignUserModal({
  task_id,
  users,
  hasAssign,
  onClose,
  onUpdate,
}: {
  task_id: number;
  hasAssign: UserAssignsTask[];
  users: UserDto[];
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [selectUser, setSelectUser] = useState(0);
  const [deadline, setDeadline] = useState("");
  const { putData, isLoading, errorData } = useApi<ResponseNotify, DataSend>();
  const userWithRole = users?.map((us) => ({
    user_id: us.userid,
    display:
      us.userData.display_name + " (" + us.accountData.account_type + ")",
  }));
  const handleSubmit = async () => {
    const data = {
      task_id,
      user_id: selectUser,
      cur_deadLine: deadline,
    };
    const re = await putData("/tasks/assign", data);

    if (!re) return;
    else {
      const email = re.contact.find((ct) => ct.code == "email")?.value;
      const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.task_id,
        name: re.content.task_name,
        massage: re.content.message,
      };
      const link =
        window.location.origin + "/tasks/" + encodeBase64({ task_id }) ||
        "https://pm.vasd.vn/";
      if (email)
        toast(
          (await sendEmail(content, email, "Thông báo", link, "task")).message
        );
      if (tele)
        sendTelegram(content, tele, "Thông báo", link, "task")
          .then((re) => {
            toast.success(re.message);
          })
          .catch((err) => toast.error(err));

      await onUpdate();
      onClose();
    }
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);

  return (
    <div className="modal modal-open">
      <div className="modal-box w-1/4">
        <h3 className="font-bold text-lg">Giao việc</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Người thực hiện</legend>
          <select
            className="select"
            value={selectUser}
            onChange={(e) => setSelectUser(parseInt(e.target.value))}
          >
            <option value={0} disabled>
              Chọn người thực hiện
            </option>
            {userWithRole?.map((us) => {
              const alreadyUser = hasAssign.find(
                (alr) => alr.user_id == us.user_id
              );
              if (alreadyUser)
                return (
                  <option value={us.user_id} key={us.user_id} disabled>
                    {us.display}
                  </option>
                );
              return (
                <option value={us.user_id} key={us.user_id}>
                  {us.display}
                </option>
              );
            })}
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Deadline</legend>
          <input
            type="datetime-local"
            value={deadline}
            className="input"
            id=""
            onChange={(e) => setDeadline(e.target.value)}
          />
        </fieldset>
        <div className="modal-action">
          <button
            className="btn btn-secondary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Xác nhận
          </button>
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
