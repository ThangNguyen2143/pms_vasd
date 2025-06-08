"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

interface Criteria {
  id: string;
  title: string;
  type: string;
}
function AddCriterialModal({
  task_id,
  onClose,
  onUpdate,
}: {
  task_id: number;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([
    {
      id: Date.now().toString(),
      title: "",
      type: "",
    },
  ]);
  const { data: criteriaType, getData: getCriterial } =
    useApi<{ code: string; display: string }[]>();
  const { postData, errorData, isLoading } = useApi();
  useEffect(() => {
    getCriterial(
      "/system/config/eyJ0eXBlIjoiY3JpdGVyaWFfdHlwZSJ9",
      "force-cache"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const addCriteria = () => {
    setCriteriaList([
      ...criteriaList,
      {
        id: Date.now().toString(),
        title: "",
        type: "",
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
  const handlePost = async () => {
    if (criteriaList.length == 0) {
      toast.warning("Bạn chưa có tiêu chí nào");
      return;
    }
    const data = {
      task_id,
      acceptances: criteriaList.map((crit) => ({
        type: crit.type,
        title: crit.title,
      })),
    };
    const re = await postData("/tasks/acceptance", data);
    if (re != "") return;
    toast.success("Xử lý thành công");
    await onUpdate();
    onClose();
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-lg text-bold">Thêm tiêu chí đánh giá</h2>
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
                  <option value="">Chọn loại tiêu chí</option>
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
        <div className="flex justify-between md:col-span-2">
          <button
            className="btn btn-primary"
            onClick={handlePost}
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo..." : "Thêm tiêu chí"}
          </button>
          <button
            className="btn btn-outline btn-accent"
            onClick={() => onClose()}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCriterialModal;
