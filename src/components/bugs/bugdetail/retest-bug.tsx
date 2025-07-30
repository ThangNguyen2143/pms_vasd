"use client";
import clsx from "clsx";
import { CheckCircle, RotateCcw, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
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
  const [retestList, setRetestList] = useState(retests ?? []);
  const { postData, isLoading, errorData } = useApi<
    string,
    { bug_id: number; assign_code: string; note: string; result: boolean }
  >();
  const {
    putData,
    errorData: errorReopen,
    isLoading: loadingPut,
    removeData: deleteData,
  } = useApi();
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

    if (re != "") return;
    await onUpdate();
    setConfirmDone("");
    setNoteCommit("");
  };
  const handleReOpenTest = async (code: string) => {
    if (!bug_id) return;
    const re = await putData("/bugs/retesting/reopen", {
      bug_id,
      assign_code: code,
    });
    if (re == null) return;
    toast.success("Xử lý thành công");
    await onUpdate();
  };
  const handleDeleteRetest = async (code: string) => {
    if (!bug_id) return;
    const re = await deleteData(
      "/bugs/retesting/" +
        encodeBase64({
          bug_id,
          code,
        })
    );
    if (re == null) return;
    toast.success("Xử lý thành công");
    // await onUpdate();
    setRetestList((pre) => pre.filter((p) => p.code != code));
  };
  useEffect(() => {
    if (errorData) {
      toast.error(
        "Có lỗi xảy ra khi cập nhật trạng thái: " + errorData.message ||
          errorData.title
      );
    }
    if (errorReopen) {
      toast.error(errorReopen.message || errorReopen.title);
    }
  }, [errorData, errorReopen]);
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">🧪 Re-test</h3>
        <button className="btn btn-sm btn-primary" onClick={setReTestAssign}>
          + Thêm
        </button>
      </div>
      {retestList.length > 0 ? (
        <ul className="list w-full max-h-[400px] overflow-y-auto">
          {retestList.map((r) => (
            <li className="p-2 w-full " key={r.code + "Retest" + r.create_at}>
              <div className="flex flex-col w-full">
                <div className="text-sm text-gray-600 flex justify-between w-full ">
                  <span>{r.assignToName}</span>
                  {r.result != null && (
                    <div
                      className="tooltip tooltip-left"
                      tabIndex={0}
                      data-tip={"Xóa kết quả re-test"}
                    >
                      <button
                        className="btn btn-xs btn-circl"
                        onClick={() => handleReOpenTest(r.code)}
                        disabled={loadingPut}
                      >
                        {loadingPut ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <RotateCcw />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <div>Hạn chót: {format_date(r.deadline)}</div>
                {r.result != null && (
                  <div>
                    <div>
                      Kết thúc: {r.time_end ? format_date(r.time_end) : ""}
                    </div>
                    <div>
                      <span>Kết quả:</span>
                      <div
                        className={clsx(
                          "badge",
                          `badge-${r.result ? "success" : "error"}`,
                          "text-sm"
                        )}
                      >
                        {r.result ? "Đạt" : "Không đạt"}
                      </div>
                    </div>

                    <div className="shadow max-w-[300px]">
                      Ghi chú: &quot;{r.note}&quot;
                    </div>
                  </div>
                )}
                {!r.note && r.result == null && confirmDone != r.code && (
                  <div className="flex justify-between">
                    <button
                      className="btn tooltip tooltip-right btn-xs"
                      data-tip="Hoàn tất re-test"
                      onClick={() => {
                        setConfirmDone(r.code);
                      }}
                    >
                      <CheckCircle />
                    </button>
                    <button
                      className="btn tooltip btn-outline btn-error tooltip-left btn-xs"
                      data-tip="Xóa re-test"
                      onClick={() => handleDeleteRetest(r.code)}
                    >
                      <X />
                    </button>
                  </div>
                )}
                {confirmDone == r.code && (
                  <div>
                    {/* Confirm done have 2 field: input to write note and button confirm */}
                    <div className="mb-2 px-4 flex justify-between">
                      <div className="flex gap-2">
                        <input
                          type="radio"
                          className="radio radio-success"
                          name="result"
                          onChange={() => setRetestResult(true)}
                        />
                        <label className="label cursor-pointer">
                          <span className="label-text text-green-500">
                            Đã fix
                          </span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="radio"
                          className="radio radio-error"
                          name="result"
                          defaultChecked
                          onChange={() => setRetestResult(false)}
                        />
                        <label className="label">
                          <span className="label-text text-red-500">
                            Chưa fix
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="label">
                        <span className="label-text">
                          Ghi chú khi kết thúc:
                        </span>
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
                          handleConfirmDone(
                            confirmDone,
                            noteCommit,
                            retestResult
                          )
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
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-500">Chưa có lần re-test nào.</p>
      )}
    </div>
  );
}
