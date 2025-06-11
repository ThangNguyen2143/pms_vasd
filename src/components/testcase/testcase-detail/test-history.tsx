import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { TestcaseDetail } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

function TestHistory({ testcase }: { testcase: TestcaseDetail }) {
  return (
    <div className="bg-base-200 shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
        Lịch sử kiểm thử
      </h2>

      {testcase.testCaseAssigns.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người thực hiện</th>
                <th>Kết quả từng bước</th>
                <th>Kết quả</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {testcase.testCaseAssigns.flatMap((assign) =>
                assign.testRunInfo.map((run) => (
                  <tr key={run.code}>
                    <td>{format_date(run.run_at)}</td>
                    <td>{assign.assignInfo.assign_name}</td>
                    <td>
                      <div className="text-sm space-y-1">
                        {run.step_results?.map((step) => (
                          <div key={step.code}>
                            <div>
                              <span className="text-gray-500">
                                Bước {step.step_index}:
                              </span>
                              🔹 <strong>{step.step_name}</strong>:{" "}
                              {step.result ? "✅" : "❌"}
                            </div>
                            {step.note && (
                              <div className="text-gray-500">
                                Ghi chú: {step.note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{run.result ? "✅ Pass" : "❌ Fail"}</td>
                    <td>
                      <SafeHtmlViewer html={run.tester_note || "-"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">Chưa có lịch sử kiểm thử</p>
      )}
    </div>
  );
}

export default TestHistory;
