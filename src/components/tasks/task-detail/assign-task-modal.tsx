"use client";
import React from "react";

export default function AssignUserModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Giao việc</h3>
        <p className="py-4">Chọn người phụ trách để giao việc. (TODO)</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
