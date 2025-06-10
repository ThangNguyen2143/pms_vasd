"use client";
import { Incident } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

interface IncidentRowProps {
  incident: Incident;
  showIncidentDetail: () => void;
}

export default function IncidentRow({
  incident,
  showIncidentDetail,
}: IncidentRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-2">{incident.id}</td>
      <td className="px-4 py-2">
        {incident.title}{" "}
        {incident.status == "NEW" ? (
          <span className="badge badge-primary">{incident.status}</span>
        ) : (
          ""
        )}
      </td>
      <td className="px-4 py-2">{incident.receiver_name || "Không rõ"}</td>
      <td className="px-4 py-2">{format_date(incident.date_create)}</td>
      <td className="px-4 py-2">{incident.type}</td>
      <td className="px-4 py-2">{incident.severtity}</td>
      <td className="px-4 py-2">
        <span onClick={showIncidentDetail} className="btn btn-sm btn-secondary">
          Chi tiết
        </span>
      </td>
    </tr>
  );
}
