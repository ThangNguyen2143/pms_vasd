import { BugDto } from "~/lib/types";
import BugRow from "./bug-row";
interface BugListProps {
  product_id: string;
  bugList?: BugDto[];
  externalBugCreated?: BugDto;
}
function BugList({ product_id, bugList, externalBugCreated }: BugListProps) {
  const fullBugList = bugList ? [...bugList] : [];
  if (
    externalBugCreated &&
    !fullBugList.find((t) => t.bug_id === externalBugCreated.bug_id)
  ) {
    fullBugList.push(externalBugCreated);
  }
  const fieldTable = [
    { code: "id", display: "ID" },
    { code: "name", display: "Tiêu đề" },
    { code: "create_by", display: "Người tạo" },
    { code: "date_create", display: "Ngày tạo" },
    { code: "dead_line", display: "Deadline" },
    { code: "status", display: "Trạng thái" },
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
          {fullBugList.length > 0 ? (
            fullBugList.map((bug) => (
              <BugRow
                key={"bug" + bug.bug_id}
                bug={bug}
                product_id={product_id}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Chưa có bug nào được báo cáo"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BugList;
