"use client";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementDto, RequirementStatus, UserDto } from "~/lib/types";
import { format_date } from "~/utils/fomat-date";
import { status_with_color_badge } from "~/utils/status-with-color";
import PagingComponent from "../ui/paging-table";
import DateTimeRangePick from "../ui/date-time-range";
import { endOfDay, format, parse, startOfDay } from "date-fns";

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
          <th>Thao tác</th>
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
  onUpdate,
}: {
  requiredList: RequirementDto[] | null;
  userList: UserDto[] | null;
  project_id: number;
  onUpdate: () => Promise<void>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [timeRangeFillter, settimeRangeFillter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: statusList, getData: getStatus } =
    useApi<RequirementStatus[]>();
  const { removeData: removeRequirement, errorData: errorRemove } =
    useApi<string>();
  useEffect(() => {
    getStatus("/system/config/" + encodeBase64({ type: "requirement_status" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDateChange = (dateInput: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (dateInput == "") {
      params.delete("from");
      params.delete("to");
      router.replace(`?${params.toString()}`, { scroll: false });
      settimeRangeFillter(dateInput);
      console.log("Cleared");
      return;
    }
    const rangeDate = dateInput
      .split(" đến ")
      .map((d) => parse(d, "dd/MM/yyyy", new Date()));
    const fromDate = startOfDay(new Date(rangeDate[0])).toString();
    const toDate = endOfDay(new Date(rangeDate[1])).toString();
    params.set("from", fromDate);
    params.set("to", toDate);
    router.replace(`?${params.toString()}`, { scroll: false });
    settimeRangeFillter(dateInput);
  };
  // 📌 Lọc + sắp xếp
  const filteredRequiredList = useMemo(() => {
    if (!requiredList) return [];
    const filtered = requiredList
      .filter((req) => {
        if (timeRangeFillter != "") {
          const rangeDate = timeRangeFillter
            .split(" đến ")
            .map((d) => parse(d, "dd/MM/yyyy", new Date()));
          const fromDate = startOfDay(new Date(rangeDate[0])).getTime();
          const toDate = endOfDay(new Date(rangeDate[1])).getTime();
          const reqCreate = new Date(req.date_create).getTime();
          return reqCreate > fromDate && reqCreate < toDate;
        } else {
          return true;
        }
      })
      .filter((req) =>
        filterStatus ? req.status === filterStatus : req.status != "CLOSED"
      );
    return filtered.sort((a, b) => b.id - a.id);
  }, [requiredList, filterStatus, timeRangeFillter]);

  // 📌 Tổng số trang
  const totalPages = Math.ceil(filteredRequiredList.length / 10);

  // 📌 Cắt phân trang
  const paginatedRequireds = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredRequiredList.slice(startIndex, startIndex + 10);
  }, [filteredRequiredList, currentPage]);

  // ⬅️ Khi load lại, đọc từ URL
  useEffect(() => {
    const toParam = searchParams.get("to");
    const fromParam = searchParams.get("from");
    const statusParams = searchParams.get("status");
    const pageParam = Number(searchParams.get("page")) || 1;
    if (fromParam && toParam) {
      try {
        const hasFormat =
          format(new Date(fromParam), "dd/MM/yyyy") +
          " đến " +
          format(new Date(toParam), "dd/MM/yyyy");
        console.log("Read from url");
        settimeRangeFillter(hasFormat);
      } catch {
        settimeRangeFillter(""); // fallback nếu lỗi
      }
    } else {
      settimeRangeFillter(""); // ✅ Quan trọng: xóa filter nếu thiếu param
    }
    if (pageParam >= 1 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    }
    if (statusParams) setFilterStatus(statusParams);
    else setFilterStatus("");
  }, [searchParams, totalPages]);

  // 📌 Reset trang về 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);
  // 📌 Hiển thị thông báo lỗi khi xóa yêu cầu thất bại
  useEffect(() => {
    if (errorRemove) {
      toast.error(
        errorRemove.message || errorRemove.title || "Xóa yêu cầu thất bại"
      );
    }
  }, [errorRemove]);
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    setCurrentPage(page);
  };
  const handleStatusFill = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status != "") {
      params.set("status", status);
      router.replace(`?${params.toString()}`, { scroll: false });
    } else {
      params.delete("status");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    setFilterStatus(status);
  };
  const handleClickRow = (required: RequirementDto) => {
    router.push(
      `/requirement/` +
        encodeBase64({
          requirement_id: required.id,
          project_id,
        })
    );
  };
  const handleDeleteRequirement = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu này?")) return;
    const res = await removeRequirement(
      `/requirements/${encodeBase64({ requirement_id: id })}`
    );
    if (res != null) {
      toast.success("Xóa yêu cầu thành công");
      // Cập nhật lại danh sách yêu cầu
      await onUpdate();
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex m-4">
        <label className="select">
          <span className="label">Trạng thái</span>
          <select
            value={filterStatus}
            onChange={(e) => handleStatusFill(e.target.value)}
          >
            <option value="">Tất cả</option>
            {statusList?.map((status) => (
              <option key={status.code} value={status.code}>
                {status.description}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 justify-center ml-2">
          <DateTimeRangePick
            value={timeRangeFillter}
            onChange={handleDateChange}
          />
          {timeRangeFillter != "" && (
            <button
              className="btn tooltip btn-ghost tooltip-right"
              data-tip="Bỏ chọn"
              onClick={() => handleDateChange("")}
            >
              X
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <ContructionTable>
          {paginatedRequireds.length > 0 ? (
            paginatedRequireds.map((required) => {
              return (
                <tr
                  key={required.id}
                  className="hover:bg-base-200"
                  onClick={() => handleClickRow(required)}
                >
                  <td>{required.id}</td>
                  <td className="flex">
                    <div className="grow">{required.title}</div>
                    <span
                      className={clsx(
                        "text-xs",
                        status_with_color_badge[required.status]
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
                    <button
                      className="btn btn-outline btn-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequirement(required.id);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                Chưa có yêu cầu nào
              </td>
            </tr>
          )}
        </ContructionTable>
        <PagingComponent
          currentPage={currentPage}
          totalPages={totalPages}
          handleChangePage={handlePageChange}
        />
      </div>
    </div>
  );
}

export default RequirementList;
