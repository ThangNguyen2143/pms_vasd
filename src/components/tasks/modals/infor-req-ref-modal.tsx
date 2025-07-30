"use client";
import { useEffect } from "react";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementDetail } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import { status_with_color_badge } from "~/utils/status-with-color";

function InforReqRefModal({
  req_id,
  onClose,
}: {
  req_id: number;
  onClose: () => void;
}) {
  const { data, getData, isLoading } = useApi<RequirementDetail>();
  //   const { data: statusList, getData: getStatus } = useApi<BugStatus[]>();
  useEffect(() => {
    getData("/requirements/detail/" + encodeBase64({ requirement_id: req_id }));
    //  getStatus("/system/config/eyJ0eXBlIjoiYnVnX3N0YXR1cyJ9", "default");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req_id]);
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="mockup-browser border-base-300 border w-full">
          <div className="mockup-browser-toolbar">
            <div className="input">Thông tin yêu cầu</div>
          </div>
          {isLoading && <span className="loading loading-infinity"></span>}
          {data && (
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="space-y-2">
                <p>
                  <span className="font-bold">Tiêu đề:</span> {data.title}{" "}
                  <span className={status_with_color_badge[data.status]}>
                    {data.status}
                  </span>
                </p>
                <div>
                  <span className="font-bold">Mô tả:</span>{" "}
                  <SafeHtmlViewer html={data.description} />
                </div>
                <p>
                  <span className="font-bold">Ưu tiên:</span>{" "}
                  <span className="text-error font-semibold">
                    {data.priority}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Loại yêu cầu:</span> {data.type}
                </p>
                <p>
                  <span className="font-bold">Ngày tạo:</span>{" "}
                  {format_date(data.date_create)}
                </p>
                <p>
                  <span className="font-bold">Ngày tiếp nhận:</span>{" "}
                  {format_date(data.date_receive)}
                </p>
                <p>
                  <span className="font-bold">Thời gian hoàn thành:</span>{" "}
                  {data.date_end ? format_date(data.date_end) : "-"}
                </p>
                <p>
                  <span className="font-bold">Từ khóa:</span>{" "}
                  {data.tags.map((tag) => (
                    <span key={tag + "tags"} className="badge badge-info mr-1">
                      {tag}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
}

export default InforReqRefModal;
