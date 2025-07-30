"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PagingComponent from "~/components/ui/paging-table";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";

interface ResposeFind {
  id: number;
  name: string;
  description: string;
  assign_name?: string[];
  type: string;
  status: string;
}
function SearchGlobalModal({ onClose }: { onClose: () => void }) {
  const { data, getData: getDataSearch, isLoading } = useApi<ResposeFind[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState<ResposeFind[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchString, setSearchString] = useState("");
  const totalPages = data ? data.length / 20 : 1;
  console.log(totalPages, data?.length);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString); // Cập nhật sau 1 giây
    }, 1000);

    return () => {
      clearTimeout(handler); // Hủy nếu user vẫn đang nhập
    };
  }, [searchString]);
  useEffect(() => {
    if (data) {
      const startIndex = (currentPage - 1) * 20;
      const currentDatas = data.slice(startIndex, startIndex + 20);
      setCurrentData(currentDatas);
    }
  }, [data, currentPage]);
  useEffect(() => {
    if (debouncedSearch.trim() != "") {
      const finalString = debouncedSearch
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      getDataSearch(
        "/dashboard/search/" +
          encodeBase64({
            search_string: finalString,
          })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  const handleClickRow = (type: string, id: number): string => {
    switch (type) {
      case "Task":
        return "/task/" + encodeBase64({ task_id: id });
      case "Testcase":
        return "/test_case/" + encodeBase64({ testcase_id: id });
      case "Bug":
        return "/bug/" + encodeBase64({ bug_id: id });
      case "Requirement":
        return "/requirement/" + encodeBase64({ requirement_id: id });
      case "Incident Report":
        return "/incident_report";
      default:
        return "/";
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-1/2 max-h-3/4 w-full h-full">
        <div className="mockup-browser border border-base-300 w-full">
          <div className="mockup-browser-toolbar">
            <label className="input">
              <input
                type="search"
                className="grow"
                placeholder="Search"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </label>

            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              <X />
            </button>
          </div>
          <div className="grid  border-t border-base-300 max-h-full overflow-auto">
            <ul className="list bg-base-100 rounded-box shadow-md">
              {searchString.trim().length > 0 ? (
                isLoading ? (
                  <li>
                    <span className="loading loading-dot"></span>
                  </li>
                ) : data ? (
                  currentData.map((result) => (
                    <li
                      className="list-row"
                      key={result.id + "t" + result.type}
                    >
                      <div>{result.type}</div>
                      <div>
                        <div>
                          {result.name} {"- (#" + result.id + ")"}{" "}
                          <span className="badge">{result.status}</span>
                        </div>
                        <div className="list-col-wrap max-h-40 truncate max-w-96">
                          <SafeHtmlViewer
                            className="max-w-80 truncate"
                            html={result.description}
                          />
                        </div>
                      </div>
                      <div className="max-w-56">
                        Người được giao: <br></br>
                        {result.assign_name
                          ? result.assign_name.map((u, i) =>
                              i == result.assign_name?.length ? u : u + ","
                            )
                          : "-"}
                      </div>
                      <Link
                        className="btn btn-square btn-ghost"
                        href={handleClickRow(result.type, result.id)}
                      >
                        <ArrowRight />
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                    Không có kết quả tìm kiếm cho {searchString}
                  </li>
                )
              ) : (
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                  Nhập từ khóa tìm kiếm
                </li>
              )}
              {}
            </ul>
            <PagingComponent
              currentPage={currentPage}
              handleChangePage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchGlobalModal;
