"use client";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { Priority } from "~/lib/types";
interface PriorityProps {
  priorityList: Priority[];
  bug_id: number;
  priority: string;
  onUpdate: () => Promise<void>;
}

function UpdatePriorytyComponent({
  priorityList,
  bug_id,
  priority,
  onUpdate,
}: PriorityProps) {
  const [selectPriority, setSelectPriority] = useState<string>(priority);
  const [showUpdatePriority, setshowUpdatePriority] = useState(false);
  const { putData, isLoading, errorData } = useApi<
    "",
    { bug_id: number; priority: string }
  >();

  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerUpdatePriority = async () => {
    const dataSend = {
      bug_id,
      priority: selectPriority,
    };
    const re = await putData("/bugs/priority", dataSend);
    if (re != "") return;
    else {
      toast.success("Cập nhật mức độ ưu tiên thành công");
      setshowUpdatePriority(false);
      await onUpdate();
    }
  };
  return (
    <div className="join p-0.75">
      <label className="join-item swap swap-rotate btn btn-secondary btn-sm btn-ghost">
        <input
          type="checkbox"
          onChange={() => setshowUpdatePriority(!showUpdatePriority)}
          checked={showUpdatePriority}
        />
        <Pencil className="swap-off" />
        <X className="swap-on"></X>
      </label>
      {showUpdatePriority && (
        <>
          <select
            className="select join-item select-sm max-w-20"
            onChange={(e) => setSelectPriority(e.target.value)}
            value={selectPriority}
          >
            {priorityList &&
              priorityList.length > 0 &&
              priorityList.map((st) => {
                if (st.code == priority)
                  return (
                    <option key={st.code} disabled value={st.code}>
                      {st.display}
                    </option>
                  );
                return (
                  <option key={st.code} value={st.code}>
                    {st.display}
                  </option>
                );
              })}
          </select>
          <button
            className="btn join-item btn-sm"
            onClick={() => handlerUpdatePriority()}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Cập nhật"
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default UpdatePriorytyComponent;
