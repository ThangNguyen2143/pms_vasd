"use client";
import {
  Priority,
  RequirementDto,
  RequirementStatus,
  RequirementType,
} from "~/lib/types";
// import EditStatus from "./edit-status";
// import UpdateWork from "./update-work";
// import UpdateDeadline from "./update-deadline";
import clsx from "clsx";
import { status_with_color_badge } from "~/utils/status-with-color";
import { format_date } from "~/utils/fomat-date";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownZA, ArrowUpAZ, Funnel } from "lucide-react";
import { encodeBase64 } from "~/lib/services";

function TableWork({
  workList,
  typeList,
  priorityList,
  statusList,
  project_id,
}: // onUpdate,
{
  workList?: RequirementDto[];
  priorityList?: Priority[];
  project_id?: number;
  typeList?: RequirementType[];
  statusList?: RequirementStatus[];
  // onUpdate: () => Promise<void>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [softId, setSoftId] = useState("down");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const filteredWorkList = useMemo(() => {
    if (!workList) return [];

    // Lọc theo status
    let filtered = workList.filter((work) =>
      filterStatus.length === 0 ? true : filterStatus.includes(work.status)
    );

    // Sắp xếp theo ID
    filtered = filtered.sort((a, b) => {
      if (softId === "up") return a.id - b.id;
      return b.id - a.id;
    });

    return filtered;
  }, [workList, filterStatus, softId]);

  const totalPages = Math.ceil(filteredWorkList.length / 10);
  // ⬅️ Khi load lại, đọc từ URL
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    if (pageParam >= 1 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    }
  }, [searchParams, totalPages]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, softId]);
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    setCurrentPage(page);
  };

  // 🔄 Cắt dữ liệu theo trang
  const startIndex = (currentPage - 1) * 10;
  const currentWorks = filteredWorkList.slice(startIndex, startIndex + 10);
  const handleClickRow = (work: RequirementDto) => {
    router.push(
      `/work_share/` +
        encodeBase64({
          requirement_id: work.id,
          project_id,
        })
    );
  };

  if (!workList)
    return (
      <>
        <div className="alert alert-info">
          Dự án chưa được thêm công việc nào
        </div>
      </>
    );
  return (
    <div className="flex flex-col">
      <div className="mb-2">
        {filterStatus.length > 0 && (
          <span className="text-sm">
            Đang lọc:{" "}
            {filterStatus.length > 0
              ? filterStatus
                  .map(
                    (code) =>
                      statusList?.find((s) => s.code === code)?.description
                  )
                  .join(", ")
              : "Tất cả"}
          </span>
        )}
      </div>
      <div className="overflow-visible">
        <table className="table w-full text-sm text-left">
          <thead className="text-xs uppercase">
            <tr>
              <th scope="col" className="py-3 flex items-center gap-1">
                <span>ID </span>
                {softId == "down" && (
                  <span
                    className="btn btn-circle"
                    onClick={() => setSoftId("up")}
                  >
                    <ArrowUpAZ />
                  </span>
                )}
                {softId == "up" && (
                  <span
                    className="btn btn-circle"
                    onClick={() => setSoftId("down")}
                  >
                    <ArrowDownZA />
                  </span>
                )}
              </th>
              <th scope="col" className="px-6 py-3">
                Tiêu đề
              </th>
              <th scope="col" className="px-6 py-3">
                Loại yêu cầu
              </th>
              <th scope="col" className="px-6 py-3">
                Ưu tiên
              </th>
              <th scope="col" className="flex items-center  py-3">
                Trạng thái
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-circle m-1"
                  >
                    <Funnel />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box w-fit p-2 shadow-sm z-50 "
                  >
                    {statusList ? (
                      statusList.map((st) => (
                        <li key={st.code + "filter"} className="flex">
                          <a className="flex gap-2">
                            <input
                              type="checkbox"
                              className="checkbox"
                              value={st.code}
                              checked={filterStatus.some(
                                (fst) => fst == st.code
                              )}
                              onChange={(e) => {
                                const code = e.target.value;
                                setFilterStatus((prev) =>
                                  e.target.checked
                                    ? [...prev, code]
                                    : prev.filter((c) => c !== code)
                                );
                              }}
                            />
                            <span className="truncate max-w-48">
                              {st.description}
                            </span>
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>Không có dữ liệu</li>
                    )}
                  </ul>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Ngày tạo
              </th>
              <th scope="col" className="px-6 py-3">
                Người ghi nhận
              </th>
              <th scope="col" className="px-6 py-3">
                Ngày hoàn thành
              </th>
              <th scope="col" className="px-6 py-3">
                Khoa yêu cầu
              </th>
            </tr>
          </thead>
          <tbody>
            {currentWorks.map((item, index) => {
              return (
                <tr
                  key={index}
                  className="hover:bg-base-300"
                  onClick={() => handleClickRow(item)}
                >
                  <td className="px-6 py-4 font-medium  whitespace-nowrap ">
                    {item.id}
                  </td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">
                    {typeList
                      ? typeList.find((type) => item.type == type.code)?.display
                      : item.type}
                  </td>
                  <td className="px-6 py-4">
                    {
                      priorityList?.find(
                        (priority) => priority.code === item.priority
                      )?.display
                    }
                  </td>
                  <td className="max-w-36">
                    <span
                      className={clsx(
                        "tooltip",
                        status_with_color_badge[item.status]
                      )}
                      data-tip={
                        statusList?.find(
                          (status) => status.code === item.status
                        )?.description ?? ""
                      }
                    >
                      <span className={clsx("max-w-32 truncate")}>
                        {item.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{format_date(item.date_create)}</td>
                  <td>{item.creator ? item.creator : "-"}</td>
                  <td className="px-6 py-4">
                    {item.date_end ? format(item.date_end, "dd/MM/yyyy") : "-"}
                  </td>

                  <td className="px-6 py-4">{item.location}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center w-full">
        {totalPages > 1 && (
          <div className="join p-4 flex justify-center">
            {/* Trang đầu */}
            {currentPage > 3 && (
              <>
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                <button className="join-item btn btn-disabled">...</button>
              </>
            )}

            {/* Các trang gần current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1 ||
                  (currentPage <= 3 && page <= 5) ||
                  (currentPage >= totalPages - 2 && page >= totalPages - 4)
              )
              .map((page) => (
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

            {/* Trang cuối */}
            {currentPage < totalPages - 3 && (
              <>
                <button className="join-item btn btn-disabled">...</button>
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TableWork;
