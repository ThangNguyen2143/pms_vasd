"use client";
import React from "react";

export default function LinkRequirementModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Liên kết yêu cầu</h3>
        <p className="py-4">
          Chọn yêu cầu để liên kết với nhiệm vụ này. (TODO)
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
