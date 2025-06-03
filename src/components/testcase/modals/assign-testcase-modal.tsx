/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function AssignTestcaseModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [assignData, setAssignData] = useState({
    assign_to: "",
    dead_line: "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(assignData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Giao testcase cho tester</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Người nhận</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={assignData.assign_to}
                onChange={(e) =>
                  setAssignData({ ...assignData, assign_to: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Deadline</label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={assignData.dead_line}
                onChange={(e) =>
                  setAssignData({ ...assignData, dead_line: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Ghi chú</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={assignData.note}
                onChange={(e) =>
                  setAssignData({ ...assignData, note: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Giao việc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
