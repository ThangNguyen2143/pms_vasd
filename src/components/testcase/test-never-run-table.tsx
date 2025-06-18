"use client";

import Link from "next/link";
import { encodeBase64 } from "~/lib/services";

type DataTestNeverRun = {
  id: number;
  name: string;
  creater_name: string;
  create_date: string;
  module: string;
};

function TableTestNeverRun({
  data,
  getModuleName,
}: {
  data: DataTestNeverRun[];
  getModuleName: (id: string) => string | undefined;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Người tạo</th>
            <th>Ngày tạo</th>
            <th>Module</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.creater_name}</td>
              <td>{d.create_date}</td>
              <td>{getModuleName(d.module) || d.module}</td>
              <td>
                <Link
                  href={"/test_case/" + encodeBase64({ testcase_id: d.id })}
                  className="btn btn-sm btn-secondary"
                >
                  Chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableTestNeverRun;
