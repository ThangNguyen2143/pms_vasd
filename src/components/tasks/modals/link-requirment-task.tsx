"use client";
import React, { useEffect, useState } from "react";
// import { DateRange, DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementTask } from "~/lib/types";

// let timeout: NodeJS.Timeout;
interface DataPut {
  type: string;
  task_id: number;
  requirement_id: number[];
}
type LinkRequirement = {
  id: number;
  title: string;
};
export default function LinkRequirementModal({
  onClose,
  onUpdate,
  product_id,
  task_id,
  linked,
}: {
  onClose: () => void;
  onUpdate: () => Promise<void>;
  task_id: number;
  product_id: string;
  linked?: RequirementTask[];
}) {
  const { getData, isLoading: loadData } = useApi<LinkRequirement[]>();
  // const [date, setDate] = useState<DateRange | undefined>();
  const [requirementList, setRequirementList] = useState<LinkRequirement[]>([]);

  const [selectedRequirementId, setSelectedRequirementId] = useState<number>(0);
  const [linkedRequirements, setLinkedRequirements] = useState<
    LinkRequirement[] | undefined
  >(
    linked?.map((linkRe) => ({
      id: linkRe.requirement_id,
      title: linkRe.requirement_title,
    }))
  );
  // Nếu có yêu cầu liên kết từ props, sử dụng nó
  const [selectedRequirement, setSelectedRequirement] = useState<
    LinkRequirement[]
  >([]);
  // const [loading, setLoading] = useState(false);
  const {
    putData: updateLinkRemove,
    isLoading,
    errorData: errorRemove,
  } = useApi<string, DataPut>();

  const { putData: updateLinkAdd, errorData: errorAdd } = useApi<
    string,
    DataPut
  >();
  // Gọi API sau 1500ms kể từ khi người dùng thay đổi ngày
  useEffect(() => {
    getData(
      "/requirements/list/" +
        encodeBase64({
          product_id,
        }),
      "reload"
    ).then((res) => {
      if (Array.isArray(res)) {
        setRequirementList(res);
      } else {
        setRequirementList([]);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorAdd) toast.error(errorAdd.message);
    if (errorRemove) toast.error(errorRemove.message);
  }, [errorAdd, errorRemove]);
  const handleAdd = () => {
    const selected = requirementList.find(
      (r) => r.id === selectedRequirementId
    );
    if (
      selected &&
      !selectedRequirement.some((r) => r.id === selected.id) &&
      !linkedRequirements?.some((r) => r.id === selected.id)
    ) {
      setSelectedRequirement((prev) => [...prev, selected]);
    }
  };

  const handleRemove = (id: number) => {
    setSelectedRequirement((prev) => prev.filter((r) => r.id !== id));
  };
  const handleRemoveLinked = (id: number) => {
    setLinkedRequirements((prev) =>
      prev ? prev.filter((r) => r.id !== id) : []
    );
  };
  const handleUpdate = async () => {
    let requirement_id: { requirement: number; type: string }[] = [];
    // if (selectedRequirement.length == 0 && selectedRequirementId != 0) {
    //   requirement_id.push({ requirement: selectedRequirementId, type: "add" });
    // }
    if (selectedRequirement.length > 0) {
      requirement_id = [
        ...selectedRequirement.map((req) => {
          return { requirement: req.id, type: "add" };
        }),
      ];
    }
    if (
      linkedRequirements &&
      linked &&
      linkedRequirements.length < linked.length
    ) {
      requirement_id = [
        ...requirement_id,
        ...linked.map((req) => {
          if (linkedRequirements.some((r) => r.id === req.requirement_id)) {
            return { requirement: req.requirement_id, type: "keep" };
          }
          return { requirement: req.requirement_id, type: "remove" };
        }),
      ];
    }
    if (requirement_id.length == 0) {
      toast.warning("chưa có thay đổi nào");
      return;
    }
    const dataAdd = {
      type: "add", //add, remove
      task_id,
      requirement_id: requirement_id
        .filter((req) => req.type === "add")
        .map((req) => req.requirement),
    };
    const dataRemove = {
      type: "remove", //add, remove
      task_id,
      requirement_id: requirement_id
        .filter((req) => req.type === "remove")
        .map((req) => {
          return req.requirement;
        }),
    };
    if (dataRemove.requirement_id.length > 0) {
      console.log("re:", dataRemove);
      const re = await updateLinkRemove("/tasks/requirement", dataRemove);
      if (!re) return;
      toast.success(re);
    }

    if (dataAdd.requirement_id.length > 0) {
      const re = await updateLinkAdd("/tasks/requirement", dataAdd);
      if (re != "") return;
      toast.success("Thêm yêu cầu thành công");
    }
    await onUpdate();
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Liên kết yêu cầu</h3>
        {loadData && (
          <span className="loading loading-infinity loading-xl"></span>
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
        {/* Danh sách các yêu cầu đã có sẵn */}
        {linkedRequirements && linkedRequirements.length > 0 && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Đã liên kết</legend>
            <ul className="space-y-1">
              {linkedRequirements.map((req) => (
                <li
                  key={req.id}
                  className="flex justify-between items-center bg-base-100 p-2 rounded"
                >
                  <span>{req.title}</span>
                  {
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleRemoveLinked(req.id)}
                    >
                      Hủy
                    </button>
                  }
                </li>
              ))}
            </ul>
          </fieldset>
        )}
        {/* Danh sách các yêu cầu đã chọn */}
        {selectedRequirement.length > 0 && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Đã chọn</legend>
            <ul className="space-y-1">
              {selectedRequirement.map((req) => (
                <li
                  key={req.id}
                  className="flex justify-between items-center bg-base-100 p-2 rounded"
                >
                  <span>{req.title}</span>
                  {
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleRemove(req.id)}
                    >
                      Hủy
                    </button>
                  }
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
