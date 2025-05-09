"use client";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function PickDayInput({ name, display }: { name: string; display: string }) {
  const [date, setDate] = useState<Date | undefined>();
  function formatDate(date: Date): string {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  return (
    <>
      <label className="input">
        <span className="label">{display}</span>
        <input
          popoverTarget={name + "rdp-popover"}
          style={{ anchorName: "--rdp" } as React.CSSProperties}
          name={name}
          value={date ? formatDate(date) : ""}
          placeholder="Chọn ngày"
          readOnly
          type="button"
        />
      </label>

      <div
        popover="auto"
        id={name + "rdp-popover"}
        className="dropdown"
        style={{ positionAnchor: "--rdp" } as React.CSSProperties}
      >
        <DayPicker
          className="react-day-picker"
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </div>
    </>
  );
}
export default PickDayInput;
