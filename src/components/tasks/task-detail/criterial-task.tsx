"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Star, X, XCircle } from "lucide-react";
import { useApi } from "~/hooks/use-api";
import { format_date } from "~/utils/fomat-date";
import clsx from "clsx";
import { toast } from "sonner";
import { DataRating } from "~/lib/types";
import { encodeBase64 } from "~/lib/services";

interface GroupedRating {
  created_by: number;
  createdBy_name: string;
  created_at: string; // ngày đánh giá
  items: DataRating[];
}
export default function CriteriaTask({
  task_id,
  data,
  critTypes,
  onUpdate,
  onEvaluate,
}: {
  task_id: number;
  data: DataRating[];
  critTypes?: { code: string; display: string }[];
  onUpdate: () => Promise<void>;
  onEvaluate: () => void;
}) {
  const [acceptanceStatus, setAcceptanceStatus] = useState<
    Record<string, boolean>
  >({});
  const [showUpdateStatus, setshowUpdateStatus] = useState<
    Record<string, boolean>
  >({});
  const { removeData, errorData: errorDelete } = useApi();
  const { putData, errorData: errorUpdate } = useApi();

  useEffect(() => {
    if (errorUpdate) toast.error(errorUpdate.message);
    if (errorDelete) toast.error(errorDelete.message);
  }, [errorUpdate, errorDelete]);
  const propress = useRef<number>(0);
  useEffect(() => {
    if (!data) return;

    const initialStatus: Record<string, boolean> = {};
    let total: number = 0;
    data.forEach((item) => {
      initialStatus[item.code] = item.is_accepted;
      if (item.is_accepted && item.percent) total = total + item.percent;
    });
    propress.current = total;

    setAcceptanceStatus(initialStatus);
  }, [data]);

  const groupedData: GroupedRating[] = useMemo(() => {
    if (!data) return [];
    const map = new Map<number, GroupedRating>();

    data.forEach((item) => {
      if (!map.has(item.created_by)) {
        map.set(item.created_by, {
          created_by: item.created_by,
          createdBy_name: item.createdBy_name,
          created_at: item.created_at,
          items: [],
        });
      }
      map.get(item.created_by)!.items.push(item);
    });

    return Array.from(map.values());
  }, [data]);
  const handlerUpdateStatus = async (code: string) => {
    const dataSend = {
      task_id,
      code,
      is_accepted: acceptanceStatus[code],
    };
    const re = await putData("/tasks/acceptance/status", dataSend);
    if (re == "") {
      toast.success("Xử lý thành công");
      setshowUpdateStatus((pre) => ({ ...pre, [code]: false }));
      onUpdate();
    }
  };
  const handlerDeleteAcceptance = async (code: string) => {
    const re = await removeData(
      "/tasks/acceptance/" + encodeBase64({ task_id, code })
    );
    if (re == "") {
      toast.success("Xử lý thành công");
      await onUpdate();
    }
  };
  return (
    <div className="bg-base-200 p-4 rounded-lg flex flex-col gap-2 items-center">
      <div className="flex w-full justify-between">
        <h3 className="text-lg font-semibold text-primary mb-2">
          📌 Tiêu chí đánh giá
        </h3>
        <button
          className="btn btn-sm btn-outline btn-primary tooltip"
          data-tip="Đánh giá"
          onClick={onEvaluate}
        >
          <Star size={16} className="mr-1" />
          Thêm Đánh giá
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <p>Tiến độ hoàn thành</p>
        <progress
          className="progress progress-secondary w-56"
          value={propress.current}
          max="100"
        ></progress>
        <span>{propress.current} %</span>
      </div>
      {groupedData.length > 0 ? (
        groupedData.map((group) => (
          <div
            tabIndex={0}
            key={group.created_by}
            className="p-3 bg-base-100 border-base-300 border w-full rounded-xl"
          >
            <div className="font-semibold flex justify-between">
              <span>{group.createdBy_name}</span>
              <span>
                đánh giá lúc <br />
                {format_date(group.created_at)}
              </span>
            </div>
            <div className="text-sm">
              <ul className="flex flex-col gap-1">
                {group.items.map((content) => (
                  <li
                    key={content.code}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                  >
                    <span>{content.title}</span>
                    <span>
                      {critTypes?.find((crit) => crit.code == content.type)
                        ?.display || content.type}
                    </span>
                    <span>{content.percent}%</span>
                    {
                      <span
                        className={clsx(
                          "badge",
                          content.is_accepted ? "badge-success" : "badge-error"
                        )}
                      >
                        {content.is_accepted ? "Đạt" : "Không Đạt"}
                      </span>
                    }
                    <div
                      className={clsx("join flex justify-end", "col-span-4")}
                    >
                      <label className="join-item swap swap-rotate btn btn-ghost">
                        <input
                          type="checkbox"
                          onChange={() =>
                            setshowUpdateStatus((pre) => ({
                              ...pre,
                              [content.code]: !pre[content.code],
                            }))
                          }
                          checked={showUpdateStatus[content.code]}
                        />
                        <span className="swap-off">
                          <Pencil></Pencil>
                        </span>
                        <span className="swap-on tooltip" data-tip={"Đóng"}>
                          <X />
                        </span>
                      </label>
                      {showUpdateStatus[content.code] && (
                        <>
                          <div className="flex gap-2 p-2 join-item ">
                            <div className="flex gap-2 w-fit">
                              <input
                                type="radio"
                                className="radio"
                                checked={!!acceptanceStatus[content.code]}
                                onChange={() =>
                                  setAcceptanceStatus((pre) => ({
                                    ...pre,
                                    [content.code]: true,
                                  }))
                                }
                              />
                              <label className="items-center">
                                <span className=" text-sm">Đạt</span>
                              </label>
                            </div>
                            <div className="flex gap-2 w-fit">
                              <input
                                type="radio"
                                className="radio"
                                checked={!acceptanceStatus[content.code]}
                                onChange={() =>
                                  setAcceptanceStatus((pre) => ({
                                    ...pre,
                                    [content.code]: false,
                                  }))
                                }
                              />
                              <label className="items-center">
                                <span className=" text-sm">Không đạt</span>
                              </label>
                            </div>
                          </div>
                          <button
                            className="btn join-item "
                            onClick={() => handlerUpdateStatus(content.code)}
                          >
                            {/* {isLoading ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Cập nhật"
                            )} */}
                            Cập nhật
                          </button>
                        </>
                      )}
                      {!showUpdateStatus[content.code] && (
                        <button
                          className="btn join-item btn-error btn-ghost text-error hover:text-base-100 tooltip tooltip-right"
                          data-tip="Xóa tiêu chí"
                          onClick={() => handlerDeleteAcceptance(content.code)}
                        >
                          <XCircle />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <span>Không có đánh giá nào</span>
      )}
    </div>
  );
}
