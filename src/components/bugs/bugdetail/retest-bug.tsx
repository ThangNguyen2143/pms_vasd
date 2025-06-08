"use client";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { ReTesingInfo } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

export default function ReTestList({
  retests,
  setReTestAssign,
  bug_id,
  onUpdate,
}: {
  bug_id: number;
  onUpdate: () => Promise<void>;
  retests: ReTesingInfo[];
  setReTestAssign: () => void;
}) {
  const [confirmDone, setConfirmDone] = useState<string>("");
  const [retestResult, setRetestResult] = useState(false);
  const [noteCommit, setNoteCommit] = useState("");
  const { postData, isLoading, errorData } = useApi<
    string,
    { bug_id: number; assign_code: string; note: string; result: boolean }
  >();
  const handleConfirmDone = async (
    code: string,
    note: string,
    result: boolean
  ) => {
    if (!bug_id) return;
    const re = await postData("/bugs/retesting/status", {
      bug_id,
      note,
      assign_code: code,
      result,
    });
    console.log({
      bug_id,
      note,
      assign_code: code,
      result,
    });
    if (re != "") return;
    await onUpdate();
    setConfirmDone("");
    setNoteCommit("");
  };
  useEffect(() => {
    if (errorData) {
      toast.error(
        "Có lỗi xảy ra khi cập nhật trạng thái: " + errorData.message
      );
    }
  }, [errorData]);
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">🧪 Re-test</h3>
        <button className="btn btn-sm btn-primary" onClick={setReTestAssign}>
          + Thêm
        </button>
      </div>
      {retests.length > 0 ? (
        <ul className="list-disc list-inside list">
          {retests.map((r) => (
            <>
              <li
                key={r.code + "Retest" + r.create_at}
                className="list-row p-2"
              >
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600">{r.assignToName}</div>
                  <div>Hạn chót: {format_date(r.deadline)}</div>
                  {r.result != null && (
                    <div>
                      {" "}
                      Kết quả:
                      <div
                        className={clsx(
                          "badge",
                          `badge-${r.result ? "success" : "error"}`,
                          "text-sm"
                        )}
                      >
                        {r.result ? "Đạt" : "Không đạt"}
                      </div>
                      <div className="shadow">{r.note}</div>
                    </div>
                  )}
                </div>

                {!r.note && r.result == null && (
                  <div
                    className="tooltip tooltip-left"
                    data-tip="Hoàn tất re-test"
                  >
                    <button
                      className="btn"
                      onClick={() => setConfirmDone(r.code)}
                    >
                      <CheckCircle />
                    </button>
                  </div>
                )}
              </li>
              {confirmDone == r.code && (
                <div>
                  {/* Confirm done have 2 field: input to write note and button confirm */}
                  <div className="mb-2 px-4 flex justify-between">
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        className="radio"
                        name="result"
                        onChange={() => setRetestResult(true)}
                      />
                      <label className="label cursor-pointer">
                        <span className="label-text">Đã fix</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        className="radio"
                        name="result"
                        onChange={() => setRetestResult(false)}
                      />
                      <label className="label">
                        <span className="label-text">Chưa fix</span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="label">
                      <span className="label-text">Ghi chú khi kết thúc:</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Nhập ghi chú..."
                      value={noteCommit}
                      onChange={(e) => setNoteCommit(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() =>
                        handleConfirmDone(confirmDone, noteCommit, retestResult)
                      }
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setConfirmDone("")}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-500">Chưa có lần re-test nào.</p>
      )}
    </div>
  );
}
