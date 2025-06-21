"use client";
import { Priority, WorkShareDto, WorkStatus } from "~/lib/types";
import EditStatus from "./edit-status";
import UpdateWork from "./update-work";
import UpdateDeadline from "./update-deadline";
import clsx from "clsx";
import { status_with_color } from "~/utils/status-with-color";
import { format_date } from "~/utils/fomat-date";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function TableWork({
  workList,
  priorityList,
  statusList,
  isGuess,
  onUpdate,
}: {
  workList?: WorkShareDto[];
  priorityList?: Priority[];
  statusList?: WorkStatus[];
  isGuess?: boolean;
  onUpdate: () => Promise<void>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const fullWorkList = workList ? [...workList] : [];
  const totalPages = Math.ceil(fullWorkList.length / 10);
  // ⬅️ Khi load lại, đọc từ URL
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    if (pageParam >= 1 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    }
  }, [searchParams, totalPages]);
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
    setCurrentPage(page);
  };

  // 🔄 Cắt dữ liệu theo trang
  const startIndex = (currentPage - 1) * 10;
  const currentWorks = fullWorkList.slice(startIndex, startIndex + 10);
  if (!workList)
    return (
      <>
        <div className="alert alert-info">
          Dự án chưa được thêm công việc nào
        </div>
      </>
    );
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-sm text-left">
        <thead className="text-xs uppercase ">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">
              Tiêu đề
            </th>
            <th scope="col" className="px-6 py-3">
              Loại công việc
            </th>
            <th scope="col" className="px-6 py-3">
              Mức độ <br />
              ưu tiên
            </th>
            <th scope="col" className="px-6 py-3">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3">
              Ngày cập nhật
            </th>
            <th scope="col" className="px-6 py-3">
              Ngày tạo
            </th>
            <th scope="col" className="px-6 py-3">
              Ngày bắt đầu
            </th>
            <th scope="col" className="px-6 py-3">
              Hạn chót
            </th>
            <th scope="col" className="px-6 py-3">
              Trách nhiệm
            </th>
          </tr>
        </thead>
        <tbody>
          {currentWorks.map((item, index) => {
            return (
              <tr key={index}>
                <td className="px-6 py-4 font-medium  whitespace-nowrap ">
                  {index + 1}
                </td>
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4">{item.type_name}</td>
                <td className="px-6 py-4">
                  {
                    priorityList?.find(
                      (priority) => priority.code === item.priority
                    )?.display
                  }
                </td>
                <td>
                  {!isGuess && statusList ? (
                    <EditStatus
                      display={
                        statusList?.find(
                          (status) => status.code === item.status
                        )?.display ?? ""
                      }
                      onUpdated={onUpdate}
                      statusList={statusList}
                      work_id={item.id}
                    />
                  ) : (
                    <span
                      className={clsx(
                        "px-6 badge",
                        `badge-${status_with_color(item.status)}`
                      )}
                    >
                      {statusList?.find((status) => status.code === item.status)
                        ?.display ?? ""}
                    </span>
                  )}
                </td>
                <td>
                  {isGuess ? (
                    item.update_at ? (
                      format_date(item.update_at)
                    ) : (
                      "-"
                    )
                  ) : (
                    <UpdateWork
                      display={item.update_at}
                      work_id={item.id}
                      onUpdate={onUpdate}
                    />
                  )}
                </td>
                <td className="px-6 py-4">{format_date(item.create_at)}</td>
                <td className="px-6 py-4">
                  {format(item.request_at, "dd/MM/yyyy")}
                </td>
                <td>
                  {isGuess ? (
                    item.update_at ? (
                      format_date(item.update_at)
                    ) : (
                      "-"
                    )
                  ) : (
                    <UpdateDeadline
                      display={item.deadline}
                      work_id={item.id}
                      onUpdate={onUpdate}
                    />
                  )}
                </td>
                <td className="px-6 py-4">{item.pic}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center">
        {totalPages > 1 && (
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`join-item btn ${
                  page === currentPage ? "btn-active" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TableWork;
