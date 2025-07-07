"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, OptionType, ProjectMember } from "~/lib/types";
import { sendEmail } from "~/utils/send-notify";
import Select from "react-select";
import { toISOString } from "~/utils/fomat-date";
interface ResponseNotify {
  action: string;
  content: {
    bug_id: number;
    bug_name: string;
    message: string;
  };
  contact: Contact[];
}
interface DataSend {
  bug_id: number;
  assign_to: number;
  deadline: string;
}
export default function AssignBugModal({
  bug_id,
  product_id,
  onClose,
  onUpdate,
}: {
  bug_id: number;
  product_id: string;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [selectUser, setSelectUser] = useState<string>("");
  const [deadline, setDeadline] = useState("");
  const { postData, isLoading, errorData } = useApi<ResponseNotify, DataSend>();
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

  const handleSubmit = async () => {
    const data: DataSend = {
      bug_id,
      assign_to: Number(selectUser),
      deadline: toISOString(deadline) || "",
    };
    const re = await postData("/bugs/assign", data);
    if (!re) return;
    else {
      const email = re.contact.find((ct) => ct.code == "email")?.value;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.bug_id,
        name: re.content.bug_name,
        message: re.content.message,
      };
      const link =
        window.location.origin +
          "/bug/" +
          encodeBase64({ bug_id, product_id }) || "https://pm.vasd.vn/";
      if (email)
        sendEmail(content, email, "Thông báo", link, "bug")
          .then((mes) => {
            if (mes.message != "OK") toast(mes.message);
          })
          .catch((e) => toast.error(e));

      // if (tele)
      //   sendTelegram(content, tele, "Thông báo", link, "bug")
      //     .then((re) => {
      //       toast.success(re.message);
      //     })
      //     .catch((err) => toast.error(err));

      await onUpdate();
      toast.success("Giao việc thành công");
      onClose();
    }
  };
  const options: OptionType[] =
    users?.map((user) => ({
      value: user.id.toString(),
      label: user.name,
    })) ?? [];
  useEffect(() => {
    if (errorData) {
      toast.error(errorData.message || errorData.title);
      console.log("Data: ", {
        bug_id,
        assign_to: selectUser,
        deadline: toISOString(deadline) || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorData]);
  if (errorUser) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Lỗi {errorUser.code}</h3>
          <p className="p-4">{errorUser.message || errorUser.title}</p>
        </div>
        <button className="modal-backdrop" onClick={onClose}>
          Đóng
        </button>
      </div>
    );
  }
  return (
    <div className="modal modal-open">
      <div className="modal-box w-1/4">
        <h3 className="font-bold text-lg">Giao việc</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Người thực hiện</legend>
          <Select
            className="w-full"
            placeholder="Chọn người thực hiện"
            value={options.find((opt) => opt.value === selectUser) || null}
            onChange={(selected) => setSelectUser(selected?.value ?? "")}
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
