"use client";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn"; // Ngôn ngữ tiếng Việt

export default function DateTimeRangePick({
  value,
  onChange,
  placeholder = "Chọn khoảng thời gian",
  className = "",
  minDate,
  maxDate,
}: {
  value: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<flatpickr.Instance | null>(null);
  const tempValueRef = useRef<string>("");
  useEffect(() => {
    if (!inputRef.current) return;
    const fp = flatpickr(inputRef.current, {
      mode: "range",
      dateFormat: "d/m/Y",
      locale: Vietnamese, // Vietnamese language
      defaultDate: value || undefined,
      minDate,
      maxDate,

      onChange: (selectedDates, dateStr) => {
        //   onChange(dateStr);
        tempValueRef.current = dateStr; // chỉ lưu tạm, chưa gọi onChange
      },
      onValueUpdate: (selectedDates, dateStr) => {
        tempValueRef.current = dateStr;
      },
      onClose: () => {
        // Khi picker đóng, mới gọi onChange chính thức
        if (tempValueRef.current && tempValueRef.current !== value) {
          onChange(tempValueRef.current);
        }
      },
    });
    fpRef.current = fp;
    return () => {
      fp.destroy();
    };
  }, [value, onChange, minDate, maxDate]);
  useEffect(() => {
    if (value === "") {
      fpRef.current?.clear(); // Clear giao diện của flatpickr
    }
  }, [value]);
  return (
    <label className={`input flex items-center gap-2 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="grow"
        readOnly // Flatpickr sẽ điều khiển input này
      />
    </label>
  );
}
