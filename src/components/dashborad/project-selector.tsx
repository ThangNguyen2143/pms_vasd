"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";

export default function ProjectSelector({
  selected,
  onChange,
}: {
  selected: number | null;
  onChange: (id: number) => void;
}) {
  const { data, getData } = useApi<{ id: number; name: string }[]>();
  useEffect(() => {
    getData("/system/config/eyJ0eXBlIjoicHJvamVjdCJ9");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex justify-end">
      <select
        className="select select-bordered"
        value={selected ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="" disabled>
          Chọn dự án
        </option>
        {data ? (
          data.map((pj) => (
            <option key={pj.id} value={pj.id}>
              {pj.name}
            </option>
          ))
        ) : (
          <option disabled>Chưa tham gia dự án nào</option>
        )}
      </select>
    </div>
  );
}
