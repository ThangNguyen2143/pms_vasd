"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, ProjectMember } from "~/lib/types";
import { sendEmail } from "~/utils/send-notify";
import Select from "react-select";
import { format_date, toISOString } from "~/utils/fomat-date";
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
  deadline_task = "",
  product_id,
  onClose,
  onUpdate,
}: {
  task_id: number;
  deadline_task: string;
  product_id: string;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [selectUser, setSelectUser] = useState(0);
  const [deadline, setDeadline] = useState(format_date(deadline_task) || "");
  const { putData, isLoading, errorData } = useApi<ResponseNotify, DataSend>();
  const {
    data: users,
    getData: getUsers,
    errorData: errorUser,
  } = useApi<ProjectMember[]>();
  useEffect(() => {
    getUsers(
      "/system/config/" + encodeBase64({ type: "project_member", product_id })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);
  useEffect(() => {
    if (errorUser) toast.error(errorUser.message);
  }, [errorUser]);
  const handleSubmit = async () => {
    const data = {
      task_id,
      user_id: selectUser,
      cur_deadLine: toISOString(deadline) || "",
    };
    const re = await putData("/tasks/assign", data);
    console.log(data, re);
    if (!re) return;
    else {
      const email = re.contact.find((ct) => ct.code == "email")?.value;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.task_id,
        name: re.content.task_name,
        message: re.content.message,
      };
      const link =
        window.location.origin + "/task/" + encodeBase64({ task_id }) ||
        "https://pm.vasd.vn/";
      if (email)
        sendEmail(content, email, "Thông báo task", link, "Task")
          .then((mes) => {
            if (mes.message != "OK") toast(mes.message);
          })
          .catch((e) => toast.error(e));
      // if (tele)
      //   sendTelegram(content, tele, "Thông báo", link, "task")
      //     .then((re) => {
      //       toast.success(re.message);
      //     })
      //     .catch((err) => toast.error(err));

      await onUpdate();
      toast.success("xử lí thành công");
      onClose();
    }
  };
  useEffect(() => {
    if (errorData) {
      toast.error(errorData.message || errorData.title);
      console.log("PayLoad:", {
        task_id,
        user_id: selectUser,
        cur_deadLine: toISOString(deadline) || "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorData]);
  const options =
    users?.map((user) => ({
      value: user.id,
      label: user.name,
    })) ?? [];
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md w-full overflow-visible">
        <h3 className="font-bold text-lg">Giao việc</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Người thực hiện</legend>
          <Select
            className="w-full"
            placeholder="Chọn người thực hiện"
            value={options.find((opt) => opt.value === selectUser) || null}
            onChange={(selected) => setSelectUser(selected?.value ?? 0)}
            options={options}
            isClearable
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Deadline</legend>
          <DateTimePicker
            value={deadline}
            onChange={setDeadline}
            className="input-neutral w-full"
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
