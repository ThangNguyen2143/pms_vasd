/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { IncidentType, BugSeverity, IncidentDetail } from "~/lib/types";

interface AddIncidentProps {
  incident?: IncidentDetail;
  onClose: () => void;
  onCreated: () => Promise<void>;
}

interface DataUpdate {
  id: number;
  title: string;
  description: string;
  type: string;
  severity: string;
  occurred_at: string;
  reporter: string;
  handle: string;
  time_end: string;
}

export default function UpdateIncidentInfoModal({
  incident = {} as IncidentDetail,
  onClose,
  onCreated,
}: AddIncidentProps) {
  const [title, setTitle] = useState(incident.title || "");
  const [description, setDescription] = useState(incident.description || "");
  const [severitySelect, setSeveritySelected] = useState(
    incident.severity || ""
  );
  const [typeSelected, setTypeSelected] = useState(incident.type || "");
  const [reporter, setReporter] = useState(incident.reporter || "");
  const [handle, setHandle] = useState(incident.handle || "");
  const [timeEnd, setTimeEnd] = useState(incident.time_end || "");
  const [occurredAt, setOccurredAt] = useState(incident.occurred_at || "");
  const { putData, isLoading, errorData } = useApi<"", DataUpdate>();
  const {
    data: typeList,
    getData: getType,
    isLoading: loadtype,
    errorData: errorType,
  } = useApi<IncidentType[]>();
  const {
    data: severityList,
    getData: getSeverity,
    isLoading: loadSeverity,
    errorData: errorSeverity,
  } = useApi<BugSeverity[]>();
  useEffect(() => {
    getType("/system/config/eyJ0eXBlIjoiaW5jaWRlbnRfdHlwZSJ9", "force-cache");
    getSeverity(
      "/system/config/eyJ0eXBlIjoiYnVnX3NldmVyaXR5In0=",
      "force-cache"
    );
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
    if (errorType) toast.error(errorType.message);
    if (errorSeverity) toast.error(errorSeverity.message);
  }, [errorData, errorSeverity, errorType]);

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !severitySelect ||
      !typeSelected ||
      !reporter ||
      !handle ||
      !timeEnd ||
      !occurredAt
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const data: DataUpdate = {
      id: incident.id,
      title,
      description,
      type: typeSelected,
      severity: severitySelect,
      handle,
      occurred_at: occurredAt,
      reporter,
      time_end: timeEnd,
    };
    const re = await putData("/incident", data);

    if (re != "") return;
    else {
      toast.success("Tạo sự kiện thành công");
      await onCreated();
      onClose();
    }
  };
  if (loadSeverity || loadtype) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      </div>
    );
  }
  return (
    <div className="modal modal-open ">
      <div className="modal-box max-w-2xl w-full">
        <h3 className="font-bold text-lg pb-2">Báo sự kiện mới</h3>
        <div className="flex flex-col gap-4 px-4">
          <label className="floating-label">
            <span>Tiêu đề</span>
            <input
              type="text"
              className="input input-neutral w-full"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Mô tả</legend>
            <RichTextEditor
              placeholder="Mô tả"
              value={description}
              onChange={setDescription}
            />
          </fieldset>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="floating-label">
              <span>Loại sự kiện</span>
              <select
                className="select select-neutral w-full"
                value={typeSelected}
                onChange={(e) => setTypeSelected(e.target.value)}
              >
                <option value="" disabled>
                  Chọn loại
                </option>
                {typeList?.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.display}
                  </option>
                ))}
              </select>
            </label>
            <label className="floating-label">
              <span>Mức độ nghiêm trọng</span>
              <select
                className="select select-neutral w-full"
                value={severitySelect}
                onChange={(e) => setSeveritySelected(e.target.value)}
              >
                <option value="" disabled>
                  Chọn mức độ
                </option>
                {severityList?.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.display}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="floating-label">
            <span className="label">Người báo cáo</span>
            <input
              type="text"
              className="input input-neutral w-full"
              placeholder="Người báo cáo"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span className="label">Cách xử lý</span>
            <input
              type="text"
              className="input input-neutral w-full"
              placeholder="Cách xử lý"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="floating-label">
              <span className="label">Thời gian xảy ra</span>
              <DateTimePicker
                value={occurredAt}
                onChange={setOccurredAt}
                className="input-neutral w-full"
              />
            </label>
            <label className="floating-label">
              <span className="label">Thời gian hoàn thành</span>
              <DateTimePicker
                value={timeEnd}
                onChange={setTimeEnd}
                className="input-neutral w-full"
              />
            </label>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
