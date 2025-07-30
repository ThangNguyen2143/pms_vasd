"use client";
import { useState } from "react";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { StepResult, TestcaseDetail } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

function TestHistory({ testcase }: { testcase: TestcaseDetail }) {
  let allRunsSorted: {
    code: string;
    run_at: string;
    commit_at: string;
    assign_name: string;
    step_results: StepResult[];
    result: boolean;
    tester_note: string;
    log?: string;
  }[] = [];
  if (testcase.testCaseAssigns.length > 0)
    allRunsSorted = testcase.testCaseAssigns
      .flatMap((assign) => {
        return assign.testRunInfo.map((run) => ({
          assign_code: assign.code,
          assign_name: assign.assignInfo.assign_name,
          ...run,
        }));
      })
      .sort(
        (a, b) =>
          new Date(b.commit_at).getTime() - new Date(a.commit_at).getTime()
      );
  const [showLogBug, setShowLogBug] = useState<string | undefined>();
  return (
    <div className="bg-base-200 shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
        Lịch sử kiểm thử
      </h2>

      {testcase.testCaseAssigns.length > 0 ? (
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người thực hiện</th>
                <th>Kết quả từng bước</th>
                <th>Kết quả</th>
                <th>Ghi chú</th>
                <th>Log</th>
              </tr>
            </thead>
            <tbody>
              {allRunsSorted.map((run) => {
                return (
                  <tr key={run.code}>
                    <td className="max-w-1/12">{format_date(run.commit_at)}</td>
                    <td className="max-w-2/12">{run.assign_name}</td>
                    <td className="max-w-4/12">
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
                    <td className="max-w-2/12">
                      {run.result ? "✅ Pass" : "❌ Fail"}
                    </td>
                    <td className="max-w-3/12">
                      <SafeHtmlViewer html={run.tester_note || "-"} />
                    </td>
                    <td>
                      <div className="tooltip">
                        <div className="tooltip-content">
                          <div className="text-xs max-w-xl break-words">
                            Xem log
                          </div>
                        </div>
                        <button
                          className="btn p-1"
                          onClick={() => setShowLogBug(run.log)}
                        >
                          Log
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">Chưa có lịch sử kiểm thử</p>
      )}
      {showLogBug && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl w-full">
            <h2 className="text-xl font-bold text-center">Log</h2>
            <p className="max-w-full break-words">{showLogBug}</p>
          </div>
          <div className="modal-backdrop">
            <button onClick={() => setShowLogBug(undefined)}></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestHistory;
