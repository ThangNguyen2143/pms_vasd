import { useRouter } from "next/navigation";
import { encodeBase64 } from "~/lib/services";
import { BugDto } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import { status_with_color_badge } from "~/utils/status-with-color";

interface BugRowProps {
  bug: BugDto;
  product_id: string;
  isSelected?: boolean;
  setSelect?: (id: number, isSelected: boolean) => void;
}

export default function BugRow({
  bug,
  product_id,
  isSelected,
  setSelect,
}: BugRowProps) {
  const router = useRouter();
  const handleClickRow = (bug: BugDto) => {
    router.push("/bug/" + encodeBase64({ bug_id: bug.bug_id, product_id }));
  };
  return (
    <tr
      className="hover:bg-base-300 dark:hover:bg-gray-700"
      onClick={() => handleClickRow(bug)}
    >
      <td className="px-4 py-2">{bug.bug_id}</td>
      <td className="px-4 py-2">{bug.name}</td>
      <td className="px-4 py-2">{bug.create_by || "Không rõ"}</td>
      <td className="px-4 py-2">{format_date(bug.date_create)}</td>
      <td className="px-4 py-2">
        {bug.dead_line ? format_date(bug.dead_line) : "-"}
      </td>
      <td className="px-4 py-2">
        <span className={status_with_color_badge[bug.status]}>
          {bug.status}
        </span>
      </td>
      <td className="py-2 px-4">
        {bug.is_update ? (
          <input
            type="checkbox"
            defaultChecked
            disabled
            className="checkbox checkbox-success"
          />
        ) : (
          <input
            type="checkbox"
            className="checkbox"
            checked={isSelected || false}
            onChange={(e) => {
              if (setSelect) setSelect(bug.bug_id, e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </td>
    </tr>
  );
}
