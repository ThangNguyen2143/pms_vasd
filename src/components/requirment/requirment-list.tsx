"use client";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementDto, RequirementStatus, UserDto } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import { status_with_color } from "~/utils/status-with-color";

function ContructionTable({ children }: { children: ReactNode }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tiêu đề</th>
          <th>Ưu tiên</th>
          <th>Loại yêu cầu</th>
          <th>Ngày tạo</th>
          <th>Tác giả</th>
          <th>Ngày hoàn thành</th>
          <th>Chi tiết</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
function RequirementList({
  requiredList,
  userList,
  project_id,
  loading,
}: {
  requiredList: RequirementDto[] | null;
  userList: UserDto[] | null;
  project_id: number;
  loading: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: statusList, getData: getStatus } =
    useApi<RequirementStatus[]>();

  useEffect(() => {
    getStatus("/system/config/" + encodeBase64({ type: "requirement_status" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📌 Lọc + sắp xếp
  const filteredRequiredList = useMemo(() => {
    if (!requiredList) return [];
    const filtered = requiredList.filter((req) =>
      filterStatus ? req.status === filterStatus : true
    );
    return filtered.sort((a, b) => b.id - a.id);
  }, [requiredList, filterStatus]);

  // 📌 Tổng số trang
  const totalPages = Math.ceil(filteredRequiredList.length / 10);

  // 📌 Cắt phân trang
  const paginatedRequireds = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredRequiredList.slice(startIndex, startIndex + 10);
  }, [filteredRequiredList, currentPage]);

  // ⬅️ Khi load lại, đọc từ URL
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    if (pageParam >= 1 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    }
  }, [searchParams, totalPages]);

  // 📌 Reset trang về 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
    setCurrentPage(page);
  };
  return (
    <div className="flex flex-col">
      <div className="m-4">
        <label className="select">
          <span className="label">Trạng thái</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả</option>
            {statusList?.map((status) => (
              <option key={status.code} value={status.code}>
                {status.description}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto">
        <ContructionTable>
          {paginatedRequireds.length > 0 ? (
            paginatedRequireds.map((required) => {
              return (
                <tr key={required.id}>
                  <td>{required.id}</td>
                  <td className="flex">
                    <div className="grow">{required.title}</div>
                    <span
                      className={clsx(
                        " badge text-xs",
                        `badge-${status_with_color(required.status)}`
                      )}
                    >
                      {required.status}
                    </span>
                  </td>
                  <td>{required.priority}</td>
                  <td>{required.type}</td>
                  <td>{format_date(required.date_create)}</td>
                  <td>
                    {userList
                      ? userList.find((us) => us.userid == required.created_by)
                          ?.userData.display_name
                      : required.created_by}
                  </td>
                  <td>
                    {required.date_end ? format_date(required.date_end) : "-"}
                  </td>
                  <td>
                    <Link
                      href={
                        `/requirement/` +
                        encodeBase64({
                          requirement_id: required.id,
                          project_id,
                        })
                      }
                    >
                      <button className="btn btn-outline btn-primary">
                        Chi tiết
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : loading ? (
            <tr>
              <td colSpan={8} className="text-center">
                <span className="loading loading-dots loading-xl"></span>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                Chưa có yêu cầu nào
              </td>
            </tr>
          )}
        </ContructionTable>
        <div className="flex justify-center">
          {totalPages > 1 && (
            <div className="join">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`join-item btn ${
                      page === currentPage ? "btn-active" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequirementList;
