/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";

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
    <table className="table table-zebra w-full">
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
  );
}
