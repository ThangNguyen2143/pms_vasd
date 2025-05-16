"use client";
import React from "react";

export default function AddAttachmentModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Sửa thông tin yêu cầu</h3>
        <div className="py-4">Form nhập thông tin (TODO)</div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary">Lưu</button>
        </div>
      </div>
    </div>
  );
}
