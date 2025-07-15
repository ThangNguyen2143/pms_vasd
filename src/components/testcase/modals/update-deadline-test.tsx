"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact } from "~/lib/types";
import { format_date, toISOString } from "~/utils/fomat-date";
import { sendEmail } from "~/utils/send-notify";

interface ResponseNotify {
  action: string;
  content: {
    testcase_id: number;
    test_name: string;
    message: string;
  };
  contact: Contact[];
}
interface PropsModal {
  testcase_id: number;
  assign_code: string;
  deadline_current: string;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}

function UpdateDeadlineTesterModal({
  testcase_id,
  assign_code,
  deadline_current,
  onClose,
  onUpdate,
}: PropsModal) {
  const [newDeadline, setNewDeadline] = useState(
    format_date(deadline_current) || ""
  );
  const { putData, isLoading, errorData } = useApi<ResponseNotify>();
  useEffect(() => {
    if (errorData) {
      toast.error(errorData.message || errorData.title);
      console.log(errorData);
    }
  }, [errorData]);
  const handleSubmit = async () => {
    if (newDeadline == "") return;
    const re = await putData("/testcase/assign", {
      testcase_id,
      assign_code,
      deadline: toISOString(newDeadline),
    });
    if (re == null) return;
    const email = re.contact.find((ct) => ct.code == "email")?.value;
    // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
    const content = {
      id: re.content.testcase_id,
      name: re.content.test_name,
      message: re.content.message,
    };
    const link =
      window.location.origin + "/test_case/" + encodeBase64({ testcase_id }) ||
      "https://pm.vasd.vn/";
    if (email)
      sendEmail(content, email, "Thông báo", link, "testcase")
        .then((mes) => {
          if (mes.message != "OK") toast(mes.message);
        })
        .catch((e) => toast.error(e));
    toast.success("Xử lý thành công");
    await onUpdate();
    onClose();
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3>Điều chỉnh thời gian deadline tester</h3>
        <DateTimePicker value={newDeadline} onChange={setNewDeadline} />
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn btn-primary ml-2"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateDeadlineTesterModal;
