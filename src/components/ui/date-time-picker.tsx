"use client";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn"; // Ngôn ngữ tiếng Việt

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Chọn ngày và giờ",
  className = "",
  minDate,
}: {
  value: string;
  minDate?: Date;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tempValueRef = useRef<string>("");
  useEffect(() => {
    if (!inputRef.current) return;
    const fp = flatpickr(inputRef.current, {
      enableTime: true,
      dateFormat: "H:i:S d/m/Y",
      time_24hr: true, // 24-hour format
      locale: Vietnamese, // Vietnamese language
      defaultDate: value || undefined,
      minDate,
      onChange: (selectedDates, dateStr) => {
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

    return () => {
      fp.destroy();
    };
  }, [value, onChange, minDate]);

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
