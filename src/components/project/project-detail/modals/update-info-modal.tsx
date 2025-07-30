"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import { useApi } from "~/hooks/use-api";
import { ProjectDetailDto } from "~/lib/types";
import { format_date, toISOString } from "~/utils/fomat-date";

interface DataUpdateInfoProject {
  id: number;
  seft_code: string;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
}

function UpdateInfoProjectModal({
  info,
  onClose,
}: {
  info: ProjectDetailDto;
  onClose: () => void;
}) {
  const [seftCode, setSeftCode] = useState<string>(info.seft_code || "");
  const [name, setName] = useState<string>(info.name);
  const [description, setDescription] = useState<string>(info.description);
  const [dateStart, setDateStart] = useState<string>(
    format_date(info.start_date)
  );
  const [dateEnd, setDateEnd] = useState<string>(
    info.end_date ? format_date(info.end_date) : ""
  );
  const { putData, errorData, isLoading } = useApi<"", DataUpdateInfoProject>();

  const handlerUpdateInfoProject = async () => {
    const dataSend = {
      id: info.id,
      seft_code: seftCode,
      name,
      description,
      start_date: toISOString(dateStart),
      end_date: dateEnd == "" ? undefined : toISOString(dateEnd),
    };
    if (!dataSend.end_date) delete dataSend.end_date;
    const res = await putData("/project", dataSend);
    if (res == "") {
      toast.success("Cập nhật thông tin thành công");
      onClose();
    } else {
      if (errorData) toast.error(errorData.message);
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Sửa thông tin dự án</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Mã dự án</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập mã dự án"
            name="seft_code"
            value={seftCode}
            onChange={(e) => setSeftCode(e.target.value)}
            required
          />
          <p className="validator-hint">Mã dự án không để trống</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tên dự án</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập tên dự án"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <p className="validator-hint">Tên dự án không được trống</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Mô tả dự án</legend>
          <input
            type="text"
            className="input w-full validator"
            placeholder="Nhập mô tả"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="validator-hint">Mô tả dự án không được trống</p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Bắt đầu</legend>
          <DateTimePicker value={dateStart} onChange={(e) => setDateStart(e)} />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Kết thúc</legend>
          <DateTimePicker value={dateEnd} onChange={(e) => setDateEnd(e)} />
        </fieldset>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handlerUpdateInfoProject}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateInfoProjectModal;
