"use client";
import { useState } from "react";
import { RequirementCritreia } from "~/lib/types";

function UpdateCriteria({
  criterial,
  onClose,
  onUpdate,
}: {
  criterial?: RequirementCritreia;
  onClose: () => void;
  onUpdate: (
    newCriteria: Exclude<RequirementCritreia, "scale">
  ) => Promise<void>;
}) {
  const [newCriteria, setNewCriteria] = useState<
    Exclude<RequirementCritreia, "scale">
  >(
    criterial || {
      code: "",
      description: "",
      is_active: true,
      title: "",
      weight: 1,
    }
  );
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-lg font-bold text-center mb-2">
          Cập nhật tiêu chí
        </h2>
        <div className="flex flex-col gap-4 ">
          <label className="floating-label">
            <span className="label">Code</span>
            <input
              type="text"
              value={newCriteria.code}
              placeholder="Code"
              className="input w-full"
              onChange={(e) =>
                setNewCriteria((pre) => ({
                  ...pre,
                  code: e.target.value,
                }))
              }
            />
          </label>

          <label className="floating-label">
            <span className="label">Tiêu đề</span>
            <input
              type="text"
              value={newCriteria.title}
              placeholder="Tiêu đề"
              className="input w-full"
              onChange={(e) =>
                setNewCriteria((pre) => ({
                  ...pre,
                  title: e.target.value,
                }))
              }
            />
          </label>

          <label className="floating-label">
            <span className="label">Mô tả</span>
            <input
              type="text"
              value={newCriteria.description}
              placeholder="Mô tả"
              className="input w-full"
              onChange={(e) =>
                setNewCriteria((pre) => ({
                  ...pre,
                  description: e.target.value,
                }))
              }
            />
          </label>

          <label className="floating-label">
            <span className="label">Độ ưu tiên</span>
            <input
              type="number"
              value={newCriteria.weight}
              placeholder="Độ ưu tiên"
              className="input w-full"
              min={1}
              onChange={(e) =>
                setNewCriteria((pre) => ({
                  ...pre,
                  weight: parseInt(e.target.value),
                }))
              }
            />
          </label>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-primary btn-outline"
            onClick={() => onUpdate(newCriteria)}
          >
            Sửa
          </button>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateCriteria;
