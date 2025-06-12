/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import DateTimePicker from "../ui/date-time-picker";
function UpdateWork({
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
    { work_id: number; update_time: string }
  >();
  useEffect(() => {
    if (display && !date) {
      const parsed = parseDisplayToInputFormat(display);
      setDate(parsed);
    }
  }, [display]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const parseDisplayToInputFormat = (value: string) => {
    const parts = value.split(/[/\s:]/); // tách theo /, space và :
    if (parts.length < 6) return "";
    const [day, month, year, hour, minute, second] = parts;
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(
      second
    )}`;
  };

  const pad = (val: string | number) => String(val).padStart(2, "0");
  const handleChange = async (value: string) => {
    const re = await putData("/work/time", {
      work_id: work_id,
      update_time: value,
    });
    if (re != "") return;
    else {
      toast.success("Cập nhật thành công");
      onUpdate(value);
      setDate(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker
        value={date || display || ""}
        placeholder="Chưa cập nhật"
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}

export default UpdateWork;
