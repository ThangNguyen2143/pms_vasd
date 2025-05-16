"use client";
import React from "react";

export default function Stakeholder({
  stakeholders,
}: {
  stakeholders: { name: string; email: string; phone?: string }[];
}) {
  if (!stakeholders.length) return null;

  return (
    <div className="bg-base-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-primary mb-2">
        🔗 Bên liên quan
      </h3>
      {stakeholders.map((s, idx) => (
        <div
          key={idx}
          className="bg-base-100 p-3 rounded-lg border-l-4 border-accent mb-2"
        >
          <p>
            <strong>{s.name}</strong>
          </p>
          <p>📧 {s.email}</p>
          {s.phone && <p>📱 {s.phone}</p>}
        </div>
      ))}
    </div>
  );
}
