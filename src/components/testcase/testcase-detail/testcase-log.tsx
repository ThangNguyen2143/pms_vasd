import { TestLog } from "~/lib/types";

function TestcaseLog({ testLogs }: { testLogs: TestLog[] }) {
  return (
    <div className=" p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
        Nhật ký hoạt động
      </h2>
      {testLogs.length > 0 ? (
        <ul className="space-y-3">
          {testLogs.map((log: TestLog) => (
            <li key={log.id + " " + log.date} className="flex items-start">
              <span className="mr-2">🕓</span>
              <div>
                <strong>{log.date}</strong> - <em>{log.name}</em>:
                <br />
                {log.content}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Chưa có nhật ký hoạt động</p>
      )}
    </div>
  );
}

export default TestcaseLog;
