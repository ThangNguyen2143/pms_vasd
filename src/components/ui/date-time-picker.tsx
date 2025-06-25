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
}: {
  value: string;
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
      dateFormat: "Y-m-d H:i",
      time_24hr: true, // 24-hour format
      locale: Vietnamese, // Vietnamese language
      defaultDate: value || undefined,
      onChange: (selectedDates, dateStr) => {
        tempValueRef.current = dateStr; // chỉ lưu tạm, chưa gọi onChange
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
  }, [value, onChange]);

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
