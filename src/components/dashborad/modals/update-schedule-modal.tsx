"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { useApi } from "~/hooks/use-api";
import { UserDto } from "~/lib/types";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";
function UpdateScheduleModal({
  day,
  month,
  year,
  currentUser,
  onClose,
  onUpdate,
}: {
  day: number;
  month: number;
  year: number;
  currentUser: string;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const date = day + "/" + month + "/" + year;
  const isDark = Cookies.get("theme") == "night";
  const { data: users, getData: getUser } = useApi<UserDto[]>();
  const { putData, errorData: errorPost } = useApi<string>();
  const [note, setNote] = useState("");
  const [userSelect, setUserSelect] = useState(0);
  useEffect(() => {
    const endpointUser = "/user/" + encodeBase64({ type: "all" });
    getUser(endpointUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorPost) {
      toast.error(errorPost.title || errorPost.message);
      console.log(errorPost);
    }
  }, [errorPost]);
  const handleSubmit = async () => {
    const data = {
      date:
        year +
        "-" +
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0"),
      user_id: userSelect,
      note,
    };
    console.log(data);
    const re = await putData("/schedule", data);
    if (re == null) return;
    await onUpdate();
    toast.success(re);
    onClose();
  };
  const options =
    users?.map((us) => {
      return {
        value: us.userid,
        label: us.userData.display_name,
      };
    }) ?? [];
  return (
    <div className="modal modal-open">
      <div className="modal-box h-96">
        <h3>Đổi người trực ngày {date}</h3>
        <div className="gap-2 flex flex-col">
          <label className="input">
            <span className="label">Hiện tại</span>
            <input type="text" disabled value={currentUser} readOnly />
          </label>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Đổi thành</legend>
            <Select
              className="w-full"
              styles={{
                control: (styles) => ({
                  ...styles,
                  backgroundColor: isDark ? "#0f172a" : "white",
                }),
                option: (styles, { isFocused, isSelected }) => {
                  let backgroundColor = isDark ? "#1e293b" : "#ffffff";
                  let color = isDark ? "#f1f5f9" : "#111827";

                  if (isSelected) {
                    backgroundColor = isDark ? "#2563eb" : "#3b82f6"; // blue-600 | blue-500
                    color = "#ffffff";
                  } else if (isFocused) {
                    backgroundColor = isDark ? "#334155" : "#e5e7eb"; // slate-700 | gray-200
                  }

                  return {
                    ...styles,
                    backgroundColor,
                    color,
                    cursor: "pointer",
                  };
                },
                menuList: (styles) => ({
                  ...styles,
                  maxHeight: "200px", // 👈 Chiều cao tối đa của menu
                  overflowY: "auto", // 👈 Hiển thị scroll khi vượt giới hạn
                }),
              }}
              placeholder="Chọn người phân công"
              //   value={options.find((opt) => opt.value === taskSelected) || null}
              onChange={(selected) => setUserSelect(selected?.value ?? 0)}
              options={options}
              isClearable
            />
          </fieldset>
          <label className="input w-full">
            <span className="label">Ghi chú</span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateScheduleModal;
