"use client";
import React, { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementDto } from "~/lib/types";

let timeout: NodeJS.Timeout;
interface DataPut {
  type: string;
  task_id: number;
  requirement_id: number[];
}
export default function LinkRequirementModal({
  onClose,
  onUpdate,
  product_id,
  task_id,
}: {
  onClose: () => void;
  onUpdate: () => Promise<void>;
  task_id: number;
  product_id: string;
}) {
  const { getData } = useApi<RequirementDto[]>();
  const [date, setDate] = useState<DateRange | undefined>();
  const [requirementList, setRequirementList] = useState<RequirementDto[]>([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState<number>(0);
  const [linkedRequirements, setLinkedRequirements] = useState<
    RequirementDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { putData, isLoading, errorData } = useApi<string, DataPut>();
  // Gọi API sau 1500ms kể từ khi người dùng thay đổi ngày
  useEffect(() => {
    setLoading(true);
    if (date?.from && date?.to) {
      const from = date.from.toISOString().slice(0, 19).replace("T", " ");
      const to = date.to.toISOString().slice(0, 19).replace("T", " ");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getData(
          "/requirements/" +
            encodeBase64({
              type: "product",
              product_id,
              from,
              to,
            }),
          "reload"
        ).then((res) => {
          if (Array.isArray(res)) {
            setLoading(false);
            setRequirementList(res);
          } else {
            setLoading(false);
            setRequirementList([]);
          }
        });
      }, 1500);
    } else {
      setLoading(false);
      setRequirementList([]);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleAdd = () => {
    const selected = requirementList.find(
      (r) => r.id === selectedRequirementId
    );
    if (selected && !linkedRequirements.some((r) => r.id === selected.id)) {
      setLinkedRequirements((prev) => [...prev, selected]);
    }
  };

  const handleRemove = (id: number) => {
    setLinkedRequirements((prev) => prev.filter((r) => r.id !== id));
  };
  const handleUpdate = async () => {
    let requirement_id: number[] = [];
    if (linkedRequirements.length == 0 && selectedRequirementId != 0) {
      requirement_id.push(selectedRequirementId);
    }
    if (linkedRequirements.length > 0) {
      requirement_id = [...linkedRequirements.map((req) => req.id)];
    }
    if (requirement_id.length == 0) {
      toast.warning("chưa chọn yêu cầu liên kết");
      return;
    }
    const data = {
      type: "add", //add, remove
      task_id,
      requirement_id,
    };
    const re = await putData("/tasks/requirement", data);
    if (!re) return;
    toast.success(re);
    await onUpdate();
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Liên kết yêu cầu</h3>

        {/* Chọn ngày */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Khoảng thời gian</legend>
          <button popoverTarget="rdp-popover" className="input input-border">
            {date
              ? date.from?.toDateString() + " - " + date.to?.toDateString()
              : "Chọn ngày"}
          </button>
          <div popover="auto" id="rdp-popover" className="dropdown">
            <DayPicker
              className="react-day-picker"
              mode="range"
              selected={date}
              onSelect={setDate}
            />
          </div>
        </fieldset>
        {/* Danh sách yêu cầu nếu có */}
        {loading ? (
          <span className="loading loading-ball"></span>
        ) : (
          requirementList.length === 0 &&
          date?.from &&
          date?.to && (
            <p className="text-sm text-red-500 mt-2">
              Không có yêu cầu nào trong khoảng thời gian đã chọn.
            </p>
          )
        )}

        {requirementList.length > 0 && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Yêu cầu</legend>
            <div className="flex gap-2 items-center">
              <select
                className="select"
                value={selectedRequirementId}
                onChange={(e) =>
                  setSelectedRequirementId(Number(e.target.value))
                }
              >
                <option value="">-- Chọn yêu cầu --</option>
                {requirementList.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.title}
                  </option>
                ))}
              </select>
              <button className="btn btn-sm" onClick={handleAdd}>
                Thêm
              </button>
            </div>
          </fieldset>
        )}

        {/* Danh sách các yêu cầu đã chọn */}
        {linkedRequirements.length > 0 && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Đã liên kết</legend>
            <ul className="space-y-1">
              {linkedRequirements.map((req, index) => (
                <li
                  key={req.id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>{req.title}</span>
                  {index > 0 && (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleRemove(req.id)}
                    >
                      Hủy
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </fieldset>
        )}

        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Xác nhận "
            )}
          </button>
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
