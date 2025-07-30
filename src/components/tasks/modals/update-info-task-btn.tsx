"use client";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { DataRating, ProductModule, Task } from "~/lib/types";
import { format_date, toISOString } from "~/utils/fomat-date";
import SelectInput from "~/components/ui/selectOptions";

interface DataSend {
  task_id: number;
  title: string;
  description: string;
  dead_line: string;
  module: string;
  acceptances?: { title: string; type: string; percent: number }[];
}
interface Criteria {
  id: string;
  title: string;
  type: string;
  percent: number;
}
export default function UpdateInfoTaskModal({
  task_info,
  criteriaType,
  critList,
  onUpdate,
  onClose,
}: {
  task_info: Task;
  critList: DataRating[];
  criteriaType?: { code: string; display: string }[];
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState<string>(task_info.title);
  const [description, setDescription] = useState<string>(task_info.description);
  const [deadline, setDeadline] = useState<string>(
    format_date(task_info.dead_line)
  );
  const [selectModule, setSelectModule] = useState(task_info.module || "");
  const [criteriaList, setCriteriaList] = useState<Criteria[]>(
    critList.length > 0
      ? critList.map((item) => ({
          id: item.code,
          title: item.title,
          type: item.type,
          percent: item.percent ?? 0,
        }))
      : [
          {
            id: Date.now().toString(),
            title: "",
            type: "",
            percent: 100,
          },
        ]
  );
  const { putData, errorData, isLoading } = useApi<string, DataSend>();
  const { data: moduleList, getData: getModules } = useApi<ProductModule[]>();
  useEffect(() => {
    getModules(
      "/product/" +
        encodeBase64({ type: "module", product_id: task_info.product_id }),
      "default"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task_info.product_id]);
  useEffect(() => {
    if (errorData) {
      toast.error(errorData.message);
    }
  }, [errorData]);
  const handleSubmit = async () => {
    const data: DataSend = {
      task_id: task_info.task_id,
      title,
      description,
      module: selectModule,
      dead_line: toISOString(deadline),
      acceptances: criteriaList.map((criteria) => ({
        title: criteria.title,
        type: criteria.type,
        percent: criteria.percent,
      })),
    };
    if (
      data.acceptances &&
      (data.acceptances.length == 0 ||
        (data.acceptances.length == 1 && data.acceptances[0].title == ""))
    )
      delete data.acceptances;
    const re = await putData("/tasks", data);
    if (re == null) return;
    else {
      toast.success("Cập nhật thành công");
      await onUpdate();
      onClose();
    }
  };
  const addCriteria = () => {
    const totalPercent = criteriaList.reduce(
      (sum, item) => sum + Number(item.percent || 0),
      0
    );
    setCriteriaList([
      ...criteriaList,
      {
        id: Date.now().toString(),
        title: "",
        type: "",
        percent: Math.max(0, 100 - totalPercent),
      },
    ]);
  };

  const removeCriteria = (id: string) => {
    setCriteriaList(criteriaList.filter((criteria) => criteria.id !== id));
  };

  const updateCriteria = (id: string, field: keyof Criteria, value: string) => {
    setCriteriaList(
      criteriaList.map((criteria) =>
        criteria.id === id ? { ...criteria, [field]: value } : criteria
      )
    );
  };
  const optionsModule =
    moduleList?.map((mo) => {
      return {
        value: mo.id,
        label: mo.display,
      };
    }) ?? [];
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl w-full">
        <h3 className="font-bold text-lg">Cập nhật thông tin nhiệm vụ</h3>
        <div className="flex flex-col gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Tiêu đề</legend>
            <input
              className="input w-full"
              type="text"
              placeholder="Tiêu đề công việc"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Mô tả</legend>
            <RichTextEditor
              placeholder="Mô tả công việc"
              value={description}
              onChange={setDescription}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Deadline</legend>
            <DateTimePicker
              minDate={new Date()}
              value={deadline}
              onChange={setDeadline}
              className="input-neutral w-full"
            />
          </fieldset>
          <fieldset>
            <legend>Module</legend>
            <SelectInput
              options={optionsModule}
              classNames="join-item"
              placeholder="Chọn module"
              setValue={(e) => setSelectModule(typeof e === "string" ? e : "")}
              singleValue={selectModule}
            />
          </fieldset>
        </div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            <span>Tiêu chí chấp thuận</span>{" "}
            <span onClick={() => addCriteria()} className="btn">
              <Plus />
            </span>
          </legend>
          <div className="flex flex-col gap-1">
            {criteriaList.map((criteria) => (
              <div key={criteria.id} className="join items-center">
                <input
                  type="text"
                  className="input input-bordered w-full join-item "
                  placeholder="Nội dung tiêu chí"
                  value={criteria.title}
                  onChange={(e) =>
                    updateCriteria(criteria.id, "title", e.target.value)
                  }
                />

                <select
                  className="select select-bordered w-full join-item"
                  value={criteria.type}
                  onChange={(e) =>
                    updateCriteria(criteria.id, "type", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Chọn loại tiêu chí
                  </option>
                  {criteriaType &&
                    criteriaType.map((crit) => (
                      <option
                        value={crit.code}
                        key={crit.code + " " + criteria.id}
                      >
                        {crit.display}
                      </option>
                    ))}
                </select>
                <label
                  className="tooltip tooltip-top join-item input"
                  data-tip="Tỉ lệ hoàn thành (%)"
                >
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={criteria.percent}
                    onChange={(e) =>
                      updateCriteria(criteria.id, "percent", e.target.value)
                    }
                  />
                  <span className="label">%</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeCriteria(criteria.id)}
                  className="btn btn-error   join-item "
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Lưu"
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
