"use client";
import { toast } from "sonner";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { IncidentDetail } from "~/lib/types";
import { clsx } from "clsx";
import { Pencil, ShieldCheck } from "lucide-react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { useEffect } from "react";
import { format_date } from "~/utils/fomat-date";

interface IncidentDetailProrps {
  incident?: IncidentDetail;
  isLoading: boolean;
  updateInfo: () => void;
  onRemove: () => Promise<void>;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
function IncidentDetailModal({
  incident,
  isLoading = false,
  updateInfo,
  onClose,
  onRemove,
  onUpdate,
}: IncidentDetailProrps) {
  const { putData, isLoading: putLoading, errorData: errorUpdate } = useApi();
  const handleFinalStatus = async () => {
    if (!incident || isNaN(incident.id)) {
      toast.error("Không tìm thấy dữ liệu");
      return;
    }
    const data = {
      incident_id: incident.id,
      status: "FINAL",
    };
    const endpoint = "/incident/status";
    if (
      confirm(
        `Xác nhận đóng sự kiện:${incident.title}? Hành động này không thể hoàn tác!`
      )
    ) {
      const re = await putData(endpoint, data);
      if (re == "") {
        await onUpdate();
        toast.success("Đã đóng sự kiện");
      }
    }
  };
  const { removeData, errorData } = useApi();
  const handleRemove = async () => {
    if (!incident || incident.id == 0) {
      toast.error("Không tìm thấy dữ liệu");
      return;
    }
    const endpoint = `/incident/${encodeBase64({ incident_id: incident.id })}`;
    if (confirm(`Xác nhận xóa sự kiện:${incident.title}?`)) {
      const re = await removeData(endpoint);
      if (re == "") {
        await onRemove();
        onClose();
        toast.success("xóa sự kiện thành công");
      }
    }
  };

  useEffect(() => {
    if (errorData) toast.error(errorData.message);
    if (errorUpdate) toast.error(errorUpdate.message);
  }, [errorData, errorUpdate]);
  if (isLoading) {
    return (
      <div className="modal-open modal">
        <div className="modal-box">
          <div className="flex justify-center">
            <span className="loading loading-infinity"></span>
          </div>
        </div>
      </div>
    );
  }
  if (!incident) {
    return "";
  }
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Chi tiết sự kiện</h3>
        <div className="card-body">
          <p>
            Tiêu đề: {incident.title}{" "}
            <span
              className={clsx(
                "badge",
                incident.status == "NEW" ? "badge-primary" : "badge-accent"
              )}
            >
              {incident.status == "NEW" ? "Mới" : "Kết thúc"}
            </span>
          </p>
          <div className="flex">
            <span className="shrink-0">Mô tả:</span>
            <SafeHtmlViewer html={incident.description} />
          </div>
          <p>Cách xử lý: {incident.handle}</p>
          <p>
            Mức độ: {incident.severity_display} - Loại sự kiện:{" "}
            {incident.type_display}
          </p>
          <p>Người ghi nhận: {incident.receiver_name}</p>
          <p>Người báo cáo: {incident.reporter}</p>
          <p>Thời gian ghi nhận: {format_date(incident.created_at)}</p>
          <p>Thời gian xảy ra: {format_date(incident.occurred_at)}</p>
          <p>
            Thời gian kết thúc:{" "}
            {incident.time_end ? format_date(incident.time_end) : "-"}
          </p>
        </div>
        {incident.status == "NEW" && (
          <div className="modal-action">
            <span
              className="btn btn-accent tooltip"
              data-tip="Đóng sự kiện"
              onClick={handleFinalStatus}
            >
              {putLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <ShieldCheck />
              )}
            </span>
            <button
              className="btn btn-primary tooltip"
              data-tip="Cập nhật thông tin"
              onClick={updateInfo}
            >
              <Pencil></Pencil>
            </button>
            <button className="btn btn-error btn-ghost" onClick={handleRemove}>
              Xóa sự kiện
            </button>
          </div>
        )}
      </div>
      <div className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </div>
    </div>
  );
}

export default IncidentDetailModal;
