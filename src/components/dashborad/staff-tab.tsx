"use client";
import React, { useState } from "react";
import { WorkOverviewDTO } from "~/lib/types";
import StaffWorkGroup from "./staff-work-group";

export default function StaffTabs({ data }: { data: WorkOverviewDTO[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (index: number) => setSelectedIndex(index);
  const selectedUser = data[selectedIndex];

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-primary mb-4">
        🧑‍💻 Phân công theo nhân sự
      </h3>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-4 overflow-x-auto whitespace-nowrap">
        {data.map((user, idx) => (
          <a
            key={user.user_id}
            className={`tab ${idx === selectedIndex ? "tab-active" : ""}`}
            onClick={() => handleSelect(idx)}
          >
            {user.user_name || `Nhân sự ${user.user_id}`}
          </a>
        ))}
      </div>

      {/* Tab content */}
      <StaffWorkGroup user={selectedUser} />
    </div>
  );
}
