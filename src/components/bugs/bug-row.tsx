import clsx from "clsx";
import Link from "next/link";
import { encodeBase64 } from "~/lib/services";
import { BugDto } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import { status_with_color } from "~/utils/status-with-color";

interface BugRowProps {
  bug: BugDto;
  product_id: string;
  select: () => void;
  unSelect: () => void;
}

export default function BugRow({
  bug,
  product_id,
  select,
  unSelect,
}: BugRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-2">{bug.bug_id}</td>
      <td className="px-4 py-2">{bug.name}</td>
      <td className="px-4 py-2">{bug.create_by || "Không rõ"}</td>
      <td className="px-4 py-2">{format_date(bug.date_create)}</td>
      <td className="px-4 py-2">
        {bug.dead_line ? format_date(bug.dead_line) : "-"}
      </td>
      <td className="px-4 py-2">
        <span
          className={clsx("badge", `badge-${status_with_color(bug.status)}`)}
        >
          {bug.status}
        </span>
      </td>
      <td className="px-4 py-2">
        {/* Có thể thêm nút sửa/xoá ở đây */}
        <Link
          href={"/bug/" + encodeBase64({ bug_id: bug.bug_id, product_id })}
          className="btn btn-sm btn-secondary"
        >
          Chi tiết
        </Link>
      </td>
      <td className="py-2 px-4">
        <label>
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => {
              if (e.target.checked) select();
              else unSelect();
            }}
          />
        </label>
      </td>
    </tr>
  );
}
