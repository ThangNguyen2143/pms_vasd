/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
function UpdateDeadline({
  display,
  work_id,
  onUpdate,
}: {
  display?: string;
  work_id: number;
  onUpdate: (value: string) => void;
}) {
  const [date, setDate] = useState<string>();
  const { putData, errorData } = useApi<
    "",
    { work_id: number; deadline: string }
  >();
  useEffect(() => {
    if (display && !date) {
      const parsed = parseDisplayToInputFormat(display);
      setDate(parsed);
    }
  }, [display]);

  const parseDisplayToInputFormat = (value: string) => {
    const parts = value.split(/[/\s:]/); // tách theo /, space và :
    if (parts.length < 6) return "";
    const [day, month, year, hour, minute, second] = parts;
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(
      second
    )}`;
  };

  const pad = (val: string | number) => String(val).padStart(2, "0");
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    await putData("/work/time", {
      work_id: work_id,
      deadline: value,
    });
    if (errorData)
      alert("Đã có lỗi xảy ra trong quá trình cập nhật deadline công việc");
    else {
      onUpdate(value);
      setDate(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="datetime-local"
        id={work_id + "deadline"}
        className="input"
        value={date || display || ""}
        onChange={handleChange}
      />
    </div>
  );
}

export default UpdateDeadline;
