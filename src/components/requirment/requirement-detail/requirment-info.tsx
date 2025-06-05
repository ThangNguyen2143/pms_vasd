/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Activity, Pencil, X } from "lucide-react";
import clsx from "clsx";
import { status_with_color } from "~/utils/status-with-color";
import { useApi } from "~/hooks/use-api";
import { RequirementStatus } from "~/lib/types";
import { toast } from "sonner";
import { format_date } from "~/utils/fomat-date";

export default function RequirementInfo({
  info,
  onEdit,
  onUpdate,
}: {
  info: {
    id: number;
    title: string;
    status: string;
    description: string;
    priority?: string;
    date_create: string;
    date_receive: string;
    date_end?: string;
    tags: string[];
    type: string;
  };
  onEdit: () => void;
  onUpdate: () => Promise<void>;
}) {
  const [selectStatus, setSelectStatus] = useState<string>(info.status);
  const [showUpdateStatus, setshowUpdateStatus] = useState(false);
  const {
    data: statusList,
    getData: getStatus,
    errorData: errorStatus,
  } = useApi<RequirementStatus[]>();
  const { putData, isLoading, errorData } = useApi<
    "",
    { id: number; status: string }
  >();
  useEffect(() => {
    getStatus(
      "/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfc3RhdHVzIn0=",
      "force-cache"
    );
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerUpdateStatus = async () => {
    const dataSend = {
      id: info.id,
      status: selectStatus,
    };
    const re = await putData("/requirements/status", dataSend);
    if (re != "") return;
    else {
      toast.success("Cập nhật trạng thái thành công");
      setshowUpdateStatus(false);
      await onUpdate();
    }
  };
  if (errorStatus) toast.error(errorStatus.message);
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">
          📌 Thông tin yêu cầu
        </h3>
        <div className="items-center">
          <button
            className="btn btn-sm btn-ghost tooltip"
            data-tip="Chỉnh sửa"
            onClick={onEdit}
          >
            <Pencil />
          </button>
          <div className="join">
            <label className="join-item swap swap-rotate btn btn-secondary btn-sm btn-ghost">
              <input
                type="checkbox"
                onChange={() => setshowUpdateStatus(!showUpdateStatus)}
                checked={showUpdateStatus}
              />
              <Activity className="swap-off" />
              <X className="swap-on" />
            </label>
            {showUpdateStatus && (
              <>
                <select
                  className="select join-item select-sm max-w-20"
                  onChange={(e) => setSelectStatus(e.target.value)}
                  value={selectStatus}
                >
                  {!errorStatus &&
                    statusList &&
                    statusList.length > 0 &&
                    statusList.map((st) => {
                      if (st.code == info.status)
                        return (
                          <option key={st.code} disabled value={st.code}>
                            {st.description}
                          </option>
                        );
                      return (
                        <option key={st.code} value={st.code}>
                          {st.description}
                        </option>
                      );
                    })}
                </select>
                <button
                  className="btn join-item btn-sm"
                  onClick={() => handlerUpdateStatus()}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Cập nhật"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-bold">Tiêu đề:</span> {info.title}{" "}
          <span
            className={clsx("badge", `badge-${status_with_color(info.status)}`)}
          >
            {info.status}
          </span>
        </p>
        <p>
          <span className="font-bold">Mô tả:</span> {info.description}
        </p>
        <p>
          <span className="font-bold">Ưu tiên:</span>{" "}
          <span className="text-error font-semibold">{info.priority}</span>
        </p>
        <p>
          <span className="font-bold">Loại yêu cầu:</span> {info.type}
        </p>
        <p>
          <span className="font-bold">Ngày tạo:</span>{" "}
          {format_date(info.date_create)}
        </p>
        <p>
          <span className="font-bold">Ngày tiếp nhận:</span>{" "}
          {format_date(info.date_receive)}
        </p>
        <p>
          <span className="font-bold">Thời gian hoàn thành:</span>{" "}
          {info.date_end ? format_date(info.date_end) : "-"}
        </p>
        <p>
          <span className="font-bold">Từ khóa:</span>{" "}
          {info.tags.map((tag) => (
            <span key={tag + "tags"} className="badge badge-info mr-1">
              {tag}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
