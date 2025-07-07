"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, ProjectMember } from "~/lib/types";
import { toISOString } from "~/utils/fomat-date";
import { sendEmail } from "~/utils/send-notify";
import Select from "react-select";
interface ResponseNotify {
  action: string;
  content: {
    testcase_id: number;
    test_name: string;
    message: string;
  };
  contact: Contact[];
}
export default function AssignTestcaseModal({
  test_id,
  product_id,
  isOpen,
  onClose,
  onUpdate,
}: {
  product_id: string;
  test_id: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const [assignData, setAssignData] = useState<{
    test_id: number;
    assign_to: number;
    dead_line: string;
    note: string;
  }>({
    test_id,
    assign_to: 0,
    dead_line: "",
    note: "",
  });
  const { postData, isLoading, errorData } = useApi<
    ResponseNotify,
    typeof assignData
  >();
  const { data: users, getData: getUsers } = useApi<ProjectMember[]>();
  useEffect(() => {
    getUsers(
      "/system/config/" + encodeBase64({ type: "project_member", product_id })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);

  const handleSubmit = async () => {
    const re = await postData("/testcase/assign", {
      ...assignData,
      dead_line: toISOString(assignData.dead_line),
    });
    if (!re) return;
    else {
      const email = re.contact.find((ct) => ct.code == "email")?.value;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.testcase_id,
        name: re.content.test_name,
        message: re.content.message,
      };
      const link =
        window.location.origin +
          "/test_case/" +
          encodeBase64({ testcase_id: test_id }) || "https://pm.vasd.vn/";
      if (email)
        sendEmail(content, email, "Thông báo", link, "testcase")
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
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
    console.log("Payload:", assignData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorData]);
  if (!isOpen) return null;
  const options =
    users?.map((user) => ({
      value: user.id,
      label: user.name,
    })) ?? [];
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Giao testcase cho tester</h2>
        <div>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Người nhận</label>
              <Select
                className="w-full"
                placeholder="Chọn người thực hiện"
                value={
                  options.find((opt) => opt.value === assignData.assign_to) ||
                  null
                }
                onChange={(selected) =>
                  setAssignData({
                    ...assignData,
                    assign_to: selected?.value ?? 0,
                  })
                }
                options={options}
                isClearable
              />
            </div>
            <div>
              <label className="block mb-1">Deadline</label>
              <DateTimePicker
                value={assignData.dead_line}
                onChange={(e) => setAssignData({ ...assignData, dead_line: e })}
                className="input-neutral w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Ghi chú</label>
              <RichTextEditor
                value={assignData.note}
                onChange={(note) => setAssignData({ ...assignData, note })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Giao việc"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
