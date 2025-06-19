"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { encodeBase64 } from "~/lib/services";
import { RequirementDto, UserDto } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";

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

  const [currentPage, setCurrentPage] = useState(1);
  const fullRequiredList = requiredList ? [...requiredList] : [];
  const totalPages = Math.ceil(fullRequiredList.length / 10);
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
  const currentRequireds = fullRequiredList.slice(startIndex, startIndex + 10);
  return (
    <div className="overflow-x-auto">
      <ContructionTable>
        {currentRequireds.length > 0 ? (
          currentRequireds.map((required) => {
            return (
              <tr key={required.id}>
                <td>{required.id}</td>
                <td>{required.title}</td>
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

export default RequirementList;
