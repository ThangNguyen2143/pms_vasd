"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";
import SelectInput from "~/components/ui/selectOptions";
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
  const { data: users, getData: getUser } =
    useApi<{ user_id: number; user_name: string }[]>();
  const { putData, errorData: errorPost } = useApi<string>();
  const [note, setNote] = useState("");
  const [userSelect, setUserSelect] = useState(0);
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
      date:
        year +
        "-" +
        month.toString().padStart(2, "0") +
        "-" +
        day.toString().padStart(2, "0"),
      user_id: userSelect,
      note,
    };
    const re = await putData("/schedule", data);
    if (re == null) return;
    await onUpdate();
    toast.success(re);
    onClose();
  };
  const options =
    users?.map((us) => {
      return {
        value: us.user_id.toString(),
        label: us.user_name,
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

            <SelectInput
              placeholder="Chọn người phân công"
              //   value={options.find((opt) => opt.value === taskSelected) || null}
              setValue={(selected) =>
                setUserSelect(
                  typeof selected == "string" ? Number(selected) : 0
                )
              }
              options={options}
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
