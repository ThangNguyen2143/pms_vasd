/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { Pencil } from "lucide-react";
import {
  status_color_btn,
  status_with_color_badge,
} from "~/utils/status-with-color";
import { useApi } from "~/hooks/use-api";
import { RequirementStatus } from "~/lib/types";
import { toast } from "sonner";
import { format_date } from "~/utils/fomat-date";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import clsx from "clsx";

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
  // const [selectStatus, setSelectStatus] = useState<string>(info.status);
  // const [showUpdateStatus, setshowUpdateStatus] = useState(false);
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
    getStatus("/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfc3RhdHVzIn0=");
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerUpdateStatus = async (status: string) => {
    const dataSend = {
      id: info.id,
      status,
    };
    const re = await putData("/requirements/status", dataSend);
    if (re != "") return;
    else {
      toast.success("Cập nhật trạng thái thành công");
      // setshowUpdateStatus(false);
      await onUpdate();
    }
  };
  const RenderStatusGroup = ({
    list,
    currentStatus,
  }: {
    list: RequirementStatus[];
    currentStatus: string;
  }) => {
    const allowStatus = list.find(
      (st) => st.code == currentStatus
    )?.allow_transit;

    return (
      <div className="join">
        {allowStatus &&
          allowStatus.map((st) => {
            const color = status_color_btn[st];
            const isOutline = st == "DELAY" || st == "CONFLICT";
            return (
              <button
                key={st}
                className={clsx(
                  `btn btn-sm btn-${color} join-item tooltip`,
                  isOutline ? "btn-outline" : ""
                )}
                data-tip={list.find((s) => st == s.code)?.description}
                onClick={() => handlerUpdateStatus(st)}
              >
                {st}
              </button>
            );
          })}
      </div>
    );
  };
  if (errorStatus) toast.error(errorStatus.message);
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex flex-col mb-2">
        <div className="flex flex-col xl:flex-row justify-end">
          <button
            className="btn btn-sm btn-ghost tooltip"
            data-tip="Chỉnh sửa"
            onClick={onEdit}
          >
            <Pencil />
          </button>
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <RenderStatusGroup
              currentStatus={info.status}
              list={statusList || []}
            />
          )}
        </div>
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-bold">Tiêu đề:</span> {info.title}{" "}
          <span className={status_with_color_badge[info.status]}>
            {info.status}
          </span>
        </p>
        <div>
          <span className="font-bold">Mô tả:</span>{" "}
          <SafeHtmlViewer html={info.description} />
        </div>
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
