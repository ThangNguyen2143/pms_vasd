import { encodeBase64 } from "~/lib/services";
import { BugDto } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { useEffect } from "react";
import BugRow from "./bug-row";
interface BugListProps {
  product_id: string;
  externalBugCreated?: BugDto;
}
function BugList({ product_id, externalBugCreated }: BugListProps) {
  const endpoint = "/bugs/" + encodeBase64({ product_id });

  const { data: bugList, getData: getBugList, errorData } = useApi<BugDto[]>();

  useEffect(() => {
    if (product_id != "") getBugList(endpoint, "reload");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);

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
              <BugRow key={"bug" + bug.bug_id} bug={bug} />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                {errorData
                  ? errorData.message
                  : product_id == ""
                  ? "Chưa chọn phần mềm nào"
                  : "Đang tải..."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BugList;
