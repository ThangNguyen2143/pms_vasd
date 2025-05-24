"use client";
import React from "react";

export default function ReTestList({ retests }: { retests: string[] }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">🧪 Re-test</h3>
        <button className="btn btn-sm btn-primary">+ Thêm</button>
      </div>
      {retests.length > 0 ? (
        <ul className="list-disc list-inside">
          {retests.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-500">Chưa có lần re-test nào.</p>
      )}
    </div>
  );
}
