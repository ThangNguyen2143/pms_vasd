"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, UserDto } from "~/lib/types";
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
  const {
    data: users,
    getData: getUsers,
    errorData: errorUser,
  } = useApi<UserDto[]>();
  useEffect(() => {
    getUsers("/user/" + encodeBase64({ type: "all" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userWithRole = users?.map((us) => ({
    user_id: us.userid,
    display:
      us.userData.display_name + " (" + us.accountData.account_type + ")",
  }));
  const handleSubmit = async () => {
    const re = await postData("/testcase/assign", assignData);
    if (!re) return;
    else {
      const email = re.contact.find((ct) => ct.code == "email")?.value;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.testcase_id,
        name: re.content.test_name,
        massage: re.content.message,
      };
      const link =
        window.location.origin +
          "/bugs/" +
          encodeBase64({ testcase_id: test_id, product_id }) ||
        "https://pm.vasd.vn/";
      if (email)
        sendEmail(content, email, "Thông báo", link, "testcase")
          .then((mes) => toast(mes.message))
          .catch((e) => toast.error(e));

      // if (tele)
      //   sendTelegram(content, tele, "Thông báo", link, "bug")
      //     .then((re) => {
      //       toast.success(re.message);
      //     })
      //     .catch((err) => toast.error(err));

      await onUpdate();
      onClose();
    }
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  if (errorUser) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Lỗi {errorUser.code}</h3>
          <p className="p-4">{errorUser.message}</p>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Giao testcase cho tester</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Người nhận</label>
              <select
                className="select select-bordered w-full"
                value={assignData.assign_to}
                onChange={(e) =>
                  setAssignData({
                    ...assignData,
                    assign_to: parseInt(e.target.value),
                  })
                }
                required
              >
                {userWithRole ? (
                  <>
                    <option value={0} disabled>
                      Chọn nhân viên
                    </option>
                    {userWithRole.map((us) => (
                      <option value={us.user_id} key={us.user_id + "sl"}>
                        {us.display}
                      </option>
                    ))}
                  </>
                ) : (
                  <option>Lỗi tải danh sách người dùng</option>
                )}
              </select>
            </div>
            <div>
              <label className="block mb-1">Deadline</label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={assignData.dead_line}
                onChange={(e) =>
                  setAssignData({ ...assignData, dead_line: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Ghi chú</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={assignData.note}
                onChange={(e) =>
                  setAssignData({ ...assignData, note: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
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
        </form>
      </div>
    </div>
  );
}
