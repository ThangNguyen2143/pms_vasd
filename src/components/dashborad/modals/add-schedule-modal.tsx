"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";
function AddScheduleModal({
  month,
  year,
  onClose,
  onUpdate,
}: {
  month: number;
  year: number;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const isDark = Cookies.get("theme") == "night";
  const { data: users, getData: getUser } =
    useApi<{ user_id: number; user_name: string }[]>();
  const { postData, errorData: errorPost } = useApi<string>();
  const [userSelect, setUserSelect] = useState<{ user_id: number }[]>([]);
  useEffect(() => {
    const endpointUser = "/schedule/" + encodeBase64({ type: "user_list" });
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
      month,
      year,
      users: userSelect,
    };
    const re = await postData("/schedule", data);
    if (re == null) return;
    await onUpdate();
    toast.success(re);
    onClose();
  };
  const options =
    users?.map((us) => {
      return {
        value: us.user_id,
        label: us.user_name,
      };
    }) ?? [];
  return (
    <div className="modal modal-open">
      <div className="modal-box h-96">
        <h2 className="text-xl font-bold">
          Phân công trực tháng {month}/{year}
        </h2>
        <Select
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
          onChange={(selected) =>
            setUserSelect(selected.map((us) => ({ user_id: us.value })) ?? [])
          }
          options={options}
          isClearable
          isMulti
        />
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

export default AddScheduleModal;
