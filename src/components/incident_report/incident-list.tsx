import { Incident } from "~/lib/types";
import IncidentRow from "./incident-row";
interface IncidentListProps {
  product_id: string;
  incidentList?: Incident[];
  showIncidentDetail: (id: number) => void;
}
function IncidentList({
  product_id,
  incidentList,
  showIncidentDetail,
}: IncidentListProps) {
  const fullIncidentList = incidentList ? [...incidentList] : [];
  const fieldTable = [
    { code: "id", display: "ID" },
    { code: "title", display: "Tiêu đề" },
    { code: "receiver_name", display: "Người tạo" },
    { code: "date_create", display: "Ngày tạo" },
    { code: "type", display: "Loại" },
    { code: "severtity", display: "Mức độ" },
    { code: "", display: "Thao tác" },
  ];

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {fieldTable.map((field) => (
              <th key={field.code} className="px-4 py-3">
                {field.display}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fullIncidentList.length > 0 ? (
            fullIncidentList.map((incident) => (
              <IncidentRow
                key={"incident" + incident.id}
                incident={incident}
                showIncidentDetail={() => showIncidentDetail(incident.id)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Chưa có sự kiện/sự cố nào được báo cáo"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentList;
