"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";
import SelectInput from "~/components/ui/selectOptions";
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
        value: us.user_id.toString(),
        label: us.user_name,
      };
    }) ?? [];
  return (
    <div className="modal modal-open">
      <div className="modal-box h-96">
        <h2 className="text-xl font-bold">
          Phân công trực tháng {month}/{year}
        </h2>
        <SelectInput
          placeholder="Chọn người phân công"
          setValue={(selected) =>
            setUserSelect(
              Array.isArray(selected)
                ? selected.map((v) => ({ user_id: Number(v) }))
                : []
            )
          }
          options={options}
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
