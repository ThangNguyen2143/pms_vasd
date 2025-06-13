"use client";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { BugSeverity } from "~/lib/types";
interface SeverityProps {
  severityList: BugSeverity[];
  bug_id: number;
  severity: string;
  onUpdate: () => Promise<void>;
}

function UpdateSeverityComponent({
  severityList,
  bug_id,
  severity,
  onUpdate,
}: SeverityProps) {
  const [selectSeverity, setSelectSeverity] = useState<string>(severity);
  const [showUpdateSeverity, setshowUpdateSeverity] = useState(false);
  const { putData, isLoading, errorData } = useApi<
    "",
    { bug_id: number; severity: string }
  >();

  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
  }, [errorData]);
  const handlerUpdateSeverity = async () => {
    const dataSend = {
      bug_id,
      severity: selectSeverity,
    };
    const re = await putData("/bugs/severity", dataSend);
    if (re != "") return;
    else {
      toast.success("Cập nhật mức độ ưu tiên thành công");
      setshowUpdateSeverity(false);
      await onUpdate();
    }
  };
  return (
    <div className="join p-0.75">
      <label className="join-item swap swap-rotate btn btn-secondary btn-sm btn-ghost">
        <input
          type="checkbox"
          onChange={() => setshowUpdateSeverity(!showUpdateSeverity)}
          checked={showUpdateSeverity}
        />
        <Pencil className="swap-off" />
        <X className="swap-on"></X>
      </label>
      {showUpdateSeverity && (
        <>
          <select
            className="select join-item select-sm max-w-20"
            onChange={(e) => setSelectSeverity(e.target.value)}
            value={selectSeverity}
          >
            {severityList &&
              severityList.length > 0 &&
              severityList.map((st) => {
                if (st.code == severity)
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
            onClick={() => handlerUpdateSeverity()}
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

export default UpdateSeverityComponent;
