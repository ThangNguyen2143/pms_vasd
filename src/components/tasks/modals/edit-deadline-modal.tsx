"use clinet";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ResopnseInfor } from "~/lib/types";
import { useUser } from "~/providers/user-context";
import { format_date, toISOString } from "~/utils/fomat-date";
import { sendEmail } from "~/utils/send-notify";
type DataSend = {
  task_id: number;
  dead_line: string;
};
function EditDeadlineModal({
  task_id,
  title,
  deadline_task = "",
  onClose,
  onUpdate,
}: {
  task_id: number;
  title: string;
  deadline_task: string;
  product_id: string;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const user = useUser().user;
  const current_date =
    deadline_task == ""
      ? format_date(new Date())
      : new Date(deadline_task).getTime() < new Date().getTime()
      ? format_date(new Date())
      : format_date(deadline_task);
  const [deadline, setDeadline] = useState(current_date);
  const { putData, isLoading, errorData } = useApi<ResopnseInfor, DataSend>();

  const handleSubmit = async () => {
    const data = {
      task_id,
      dead_line: toISOString(deadline) || "",
    };
    const re = await putData("/tasks/deadline", data);
    if (!re) return;
    else {
      const email = re.list_contacts.email;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: task_id,
        name: title,
        message: `Thời gian deadline task đã được cập nhật thành ${deadline}`,
      };
      const link =
        window.location.origin +
          "/task/" +
          encodeBase64({
            task_id: task_id,
          }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(
            content,
            e,
            "Thông báo cập nhật deadline",
            link,
            "task",
            user?.name
          )
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );
      await onUpdate();
      onClose();
      toast.success("Thay đổi deadline thành công");
    }
  };
  useEffect(() => {
    if (errorData) {
      toast.error(errorData.message || errorData.title);
    }
  }, [errorData]);
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md w-full overflow-visible">
        <h3 className="font-bold text-lg">Cập nhật deadline</h3>
        <h4 className="text-center font-bold">{title}</h4>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Deadline mới</legend>
          <DateTimePicker
            minDate={new Date()}
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

export default EditDeadlineModal;
