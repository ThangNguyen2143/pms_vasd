"use client";
import React from "react";

export default function UpdateInfoTaskModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cập nhật thông tin nhiệm vụ</h3>
        <p className="py-4">Form cập nhật nội dung tại đây (TODO)</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
