/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import ListProject from "./project-list-select";
import TableWork from "./table-work";
// import AddWorkBtn from "./add-work-btn";
import { encodeBase64 } from "~/lib/services";
import { useApi } from "~/hooks/use-api";
import {
  Priority,
  ProductDto,
  ProjectLocation,
  RequirementDto,
  RequirementStatus,
  RequirementType,
} from "~/lib/types";
// import { useUser } from "~/providers/user-context";
import OverviewWork from "./orverview-work";
import { format_date, toISOString } from "~/utils/fomat-date";
import { endOfDay } from "date-fns";
import DateTimePicker from "../ui/date-time-picker";
import AddRequirementModal from "../requirment/modals/add-requirement-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";

function MainWork() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tabContent, setTabContent] = useState<string>("List");
  const [projectSelected, setProjectSelect] = useState<number>(0);
  const [searchString, setSearchString] = useState<string>("");
  const [showAddRequirment, setShowAddRequirment] = useState(false);
  const { data: statusList, getData: getStatusList } =
    useApi<RequirementStatus[]>();
  const {
    data: searchResult,
    getData: getDataSearch,
    isLoading: loadSearch,
  } = useApi<RequirementDto[]>();
  const { data: priorityList, getData: getPriority } = useApi<Priority[]>();
  const { data: typeWorkList, getData: getTypeWork } =
    useApi<RequirementType[]>();
  const [fromDate, setFromDate] = useState<string>(
    ""
    // format_date(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, settoDate] = useState<string>(
    format_date(endOfDay(new Date()))
  );
  const [requireList, setRequireList] = useState<RequirementDto[]>();
  const {
    data: workList,
    getData: getWorkList,
    errorData: errorWorkList,
    isLoading: loadingWork,
  } = useApi<RequirementDto[]>();
  const fetchData = async () => {
    const endpointWork =
      "/requirements/" +
      encodeBase64({ type: "project", project_id: projectSelected });
    await getWorkList(endpointWork);
  };
  const { data: productList, getData: getProducts } = useApi<ProductDto[]>();
  const { data: locations, getData: getLocations } =
    useApi<ProjectLocation[]>();
  useEffect(() => {
    // Lấy projectSelected từ localStorage khi component mount
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setProjectSelect(parseInt(saved));
    const fetchData = async () => {
      const endpointStatus =
        "/system/config/" + encodeBase64({ type: "requirement_status" });
      const endpointPriority =
        "/system/config/" + encodeBase64({ type: "priority" });
      const endpointTypeWork =
        "/system/config/" + encodeBase64({ type: "requirement_type" });

      await getStatusList(endpointStatus);
      await getPriority(endpointPriority);
      await getTypeWork(endpointTypeWork);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (workList) {
      const filtered = workList.filter((req) => {
        if (fromDate != "" && toDate != "") {
          const from = new Date(toISOString(fromDate)).getTime();
          const to = new Date(toISOString(toDate)).getTime();
          const reqCreate = new Date(req.date_create).getTime();
          return reqCreate > from && reqCreate < to;
        } else {
          return true;
        }
      });
      setRequireList(filtered);
    } else {
      setRequireList([]);
    }
  }, [workList, fromDate, toDate]);
  // Lưu mỗi khi projectSelected thay đổi
  useEffect(() => {
    if (projectSelected !== 0) {
      sessionStorage.setItem("projectSelected", projectSelected.toString());
      const endpoint =
        "/product/" +
        encodeBase64({ type: "all", project_id: projectSelected });
      const endpointLocation =
        "/project/location/" + encodeBase64({ project_id: projectSelected });
      getLocations(endpointLocation, "reload");
      getProducts(endpoint, "reload");
    }
  }, [projectSelected]);
  useEffect(() => {
    if (projectSelected != 0) {
      fetchData();
    }
  }, [projectSelected]);
  useEffect(() => {
    const toParam = searchParams.get("to");
    const fromParam = searchParams.get("from");

    if (toParam) settoDate(toParam);
    if (fromParam) setFromDate(fromParam);
  }, [searchParams]);
  useEffect(() => {
    if (searchString.trim() != "") {
      const finalString = searchString
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      setTimeout(() => {
        getDataSearch(
          "/requirements/search/" +
            encodeBase64({
              project_id: projectSelected,
              search_string: finalString,
            })
        );
      }, 1000);
    }
  }, [searchString]);
  const handleDateChange = (dateInput: string, type: "from" | "to") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, dateInput);
    router.replace(`?${params.toString()}`, { scroll: false });
    if (type == "from") setFromDate(dateInput);
    else settoDate(dateInput);
  };
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="container flex justify-between items-center gap-4">
        <div className="flex gap-2 w-full">
          <ListProject
            projectSelected={projectSelected}
            setProjectSelect={setProjectSelect}
          />
          <div className="flex gap-2">
            <span className="label">Từ</span>
            <DateTimePicker
              value={fromDate}
              onChange={(e) => handleDateChange(e, "from")}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <span className="label">Đến</span>
            <DateTimePicker
              value={toDate}
              onChange={(e) => handleDateChange(e, "to")}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="dropdown">
            <div tabIndex={0} role="button">
              <label className="input">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
                <button className="label">
                  <Search />
                </button>
              </label>
            </div>
            {searchString.length > 0 ? (
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {loadSearch && (
                  <li>
                    Đang tải <span className="loading loading-spinner"></span>
                  </li>
                )}
                {searchResult ? (
                  searchResult.map((res) => (
                    <li key={res.id + "searchRes"}>
                      <Link
                        href={
                          `/work_share/` +
                          encodeBase64({
                            requirement_id: res.id,
                            project_id: projectSelected,
                          })
                        }
                        className="max-w-48 truncate"
                      >
                        {res.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    Không có kết quả tìm kiếm cho &quot;{searchString}
                    &quot;
                  </li>
                )}
              </ul>
            ) : (
              ""
            )}
          </div>
          <button
            className="btn btn-info"
            onClick={() => setShowAddRequirment(true)}
          >
            Thêm yêu cầu
          </button>
        </div>
      </div>
      {loadingWork ? (
        <span className="loading loading-infinity loading-lg"></span>
      ) : errorWorkList && errorWorkList.code != 404 ? (
        <div className="flex justify-center items-center h-screen">
          {errorWorkList.message}
        </div>
      ) : projectSelected != 0 ? (
        <div className="shadow-md sm:rounded-lg flex flex-col">
          <div className="tabs tabs-lift">
            <input
              type="radio"
              name="tab_swap"
              className="tab"
              id="overview"
              onChange={() => setTabContent("Overview")}
              checked={tabContent === "Overview"}
              aria-label="Tổng quan"
            />
            <div className="tab-content">
              {priorityList && statusList && (
                <OverviewWork
                  priorityList={priorityList}
                  statusList={statusList}
                  dataRaw={workList}
                />
              )}
            </div>
            <input
              type="radio"
              name="tab_swap"
              id="detail"
              aria-label="Danh sách"
              className="tab"
              checked={tabContent === "List"}
              onChange={() => setTabContent("List")}
            />
            <div className="tab-content">
              <TableWork
                workList={requireList || []}
                priorityList={priorityList || undefined}
                statusList={statusList || undefined}
                typeList={typeWorkList || undefined}
                project_id={projectSelected}
                // isGuess={isGuess}
                // onUpdate={() => fetchData()}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          Chưa dự án nào được chọn
        </div>
      )}
      {showAddRequirment && (
        <AddRequirementModal
          product_list={productList || []}
          locationList={locations || []}
          onClose={() => setShowAddRequirment(false)}
          onCreated={async () => {
            await fetchData();
          }}
        />
      )}
    </div>
  );
}

export default MainWork;
