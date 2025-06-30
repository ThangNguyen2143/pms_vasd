/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ExcelViewer({ file }: { file: File }) {
  const [rows, setRows] = useState<any[][]>([]);

  const handleRead = async () => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    setRows(jsonData as any[][]);
  };

  useEffect(() => {
    handleRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-auto rounded-box border border-base-content/5 bg-base-100">
      <table
        className={clsx(
          "table table-zebra w-full",
          rows.length > 200 ? "table-xs" : ""
        )}
      >
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
