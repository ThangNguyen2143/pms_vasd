"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { BugSeverity, Priority } from "~/lib/types";
interface BugMatrixDataType {
  priority: string;
  severity: string;
  duration_hours: number;
}
function ClientMatrixBug() {
  const { data: severity, getData: getSeverity } = useApi<BugSeverity[]>(); //type Severity {code:string, display:string}
  const { data: priority, getData: getPriority } = useApi<Priority[]>(); //type Priority {code:string, display:string}
  const { data, getData: getMatrixBug } = useApi<BugMatrixDataType[]>();
  const { putData, errorData } = useApi();
  const [editableData, setEditableData] = useState<BugMatrixDataType[]>([]);
  useEffect(() => {
    getPriority("/system/config/eyJ0eXBlIjoicHJpb3JpdHkifQ==");
    getSeverity("/system/config/eyJ0eXBlIjoiYnVnX3NldmVyaXR5In0=");
    getMatrixBug("/setting/eyJ0eXBlIjoiYnVnX21hdHJpeCJ9");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (data) {
      setEditableData(data);
    }
  }, [data]);
  useEffect(() => {
    if (errorData) {
      toast.error(errorData.message || errorData.title);
    }
  }, [errorData]);
  const handleChange = (
    priorityCode: string,
    severityCode: string,
    value: string
  ) => {
    setEditableData((prev) =>
      prev.map((item) =>
        item.priority === priorityCode && item.severity === severityCode
          ? { ...item, duration_hours: parseFloat(value) }
          : item
      )
    );
  };
  const handleBlur = async (priorityCode: string, severityCode: string) => {
    const item = editableData.find(
      (i) => i.priority === priorityCode && i.severity === severityCode
    );
    const original = data?.find(
      (i) => i.priority === priorityCode && i.severity === severityCode
    );
    if (!original || !item) return;

    // So sánh, chỉ cập nhật nếu giá trị thay đổi
    if (original.duration_hours !== item.duration_hours) {
      const re = await putData("/setting/bug/matrix", item);
      if (re != null) {
        toast.success("Xử lý thành công");
      }
    }
  };
  const getDuration = (priorityCode: string, severityCode: string): string => {
    const found = editableData.find(
      (d) => d.priority === priorityCode && d.severity === severityCode
    );
    return found ? String(found.duration_hours) : "";
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Ma trận xử lý bug (giờ)</h2>
      <div className="overflow-auto border rounded-lg">
        <table className="table table-zebra w-full min-w-max text-sm">
          <thead>
            <tr>
              <th>Priority / Severity</th>
              {severity?.map((se) => (
                <th key={se.code} className="text-center">
                  {se.display}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priority?.map((prio) => (
              <tr key={prio.code}>
                <td className="font-medium">{prio.display}</td>
                {severity?.map((se) => (
                  <td key={se.code + "-" + prio.code} className="text-center">
                    <input
                      type="number"
                      step="1"
                      min={0}
                      className="input input-sm input-bordered w-20 text-center"
                      value={getDuration(prio.code, se.code)}
                      onChange={(e) =>
                        handleChange(prio.code, se.code, e.target.value)
                      }
                      onBlur={() => handleBlur(prio.code, se.code)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientMatrixBug;
