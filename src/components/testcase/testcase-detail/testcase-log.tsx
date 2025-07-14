import { TestLog } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import { formatContent } from "~/utils/format-content";

function TestcaseLog({ testLogs }: { testLogs: TestLog[] }) {
  return (
    <div className=" p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
        Nhật ký hoạt động
      </h2>
      <div className="overflow-y-auto max-h-96">
        {testLogs.length > 0 ? (
          <ul className="space-y-3 flex flex-col gap-2">
            {testLogs
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((log: TestLog, index) => (
                <li
                  key={log.id + " " + log.date + " " + index}
                  className="flex items-start"
                >
                  <span className="mr-2">🕓</span>
                  <div>
                    <strong>{format_date(log.date)}</strong> -{" "}
                    <em>{log.name}</em>
                    :
                    <br />
                    {formatContent(log.content)}
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có nhật ký hoạt động</p>
        )}
      </div>
    </div>
  );
}

export default TestcaseLog;
