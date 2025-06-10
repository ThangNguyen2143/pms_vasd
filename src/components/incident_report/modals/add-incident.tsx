/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { IncidentType, BugSeverity } from "~/lib/types";

interface AddIncidentProps {
  product_id: string;

  onClose: () => void;
  onCreated: () => void;
}

interface DataCreate {
  product_id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  occurred_at: string;
  reporter: string;
  handle: string;
  time_end: string;
}

export default function AddIncidentModal({
  product_id,
  onClose,
  onCreated,
}: AddIncidentProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severitySelect, setSeveritySelected] = useState("");
  const [typeSelected, setTypeSelected] = useState("");
  const [reporter, setReporter] = useState("");
  const [handle, setHandle] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const { postData, isLoading, errorData } = useApi<"", DataCreate>();
  const {
    data: typeList,
    getData: getType,
    errorData: errorType,
  } = useApi<IncidentType[]>();
  const {
    data: severityList,
    getData: getSeverity,
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

  if (!severityList || !typeSelected) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      </div>
    );
  }
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
    const data: DataCreate = {
      product_id,
      title,
      description,
      type: typeSelected,
      severity: severitySelect,
      handle,
      occurred_at: occurredAt,
      reporter,
      time_end: timeEnd,
    };
    const re = await postData("/incident", data);

    if (re != "") return;
    else {
      toast.success("Tạo sự kiện thành công");
      onCreated();
      onClose();
    }
  };

  return (
    <div className="modal modal-open ">
      <div className="modal-box w-96">
        <h3 className="font-bold text-lg pb-2">Báo sự kiện mới</h3>
        <div className="flex flex-col gap-2 px-4">
          <label className="floating-label">
            <span>Tiêu đề</span>
            <input
              type="text"
              className="input input-neutral"
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
          <label className="floating-label">
            <span>Loại sự kiện</span>
            <select
              className="select select-neutral"
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
              className="select select-neutral"
              value={severitySelect}
              onChange={(e) => setSeveritySelected(e.target.value)}
            >
              <option value="" disabled>
                Chọn mức độ
              </option>
              {severityList.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.display}
                </option>
              ))}
            </select>
          </label>
          <label className="floating-label">
            <span className="label"></span>
            <input
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span className="label"></span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span className="label"></span>
            <input
              type="text"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span className="label"></span>
            <input
              type="text"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
            />
          </label>
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
