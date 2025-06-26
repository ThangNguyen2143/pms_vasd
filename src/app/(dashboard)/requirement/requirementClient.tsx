/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import {
  ProductDto,
  ProjectDto,
  ProjectLocation,
  RequirementDto,
  RequirementStatus,
  UserDto,
} from "~/lib/types";
import OverviewRequirement from "~/components/requirment/overview-required-tab";
import clsx from "clsx";
import AddLocationModal from "~/components/requirment/modals/add-location-modal";
import AddRequirementModal from "~/components/requirment/modals/add-requirement-modal";
import { toISOString } from "~/utils/fomat-date";
import { endOfDay, startOfDay, subDays } from "date-fns";
// import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import RequirementList from "~/components/requirment/requirment-list";
import Link from "next/link";

const productCache: Record<number, ProductDto[]> = {};
const locationCache: Record<number, ProjectLocation[]> = {}; //Để cache dữ liệu khoa phòng trong trường hợp có biểu đồ dùng khoa phòng
function RequirementsClient() {
  const [tabContent, setTabContent] = useState<string>("List");
  const [productSelect, setproductSelect] = useState<string>("");
  const [projectSelect, setprojectSelect] = useState<number>(0);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddRequirment, setShowAddRequirment] = useState(false);
  const [loading, setloading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchString, setSearchString] = useState<string>("");
  const [requiredData, setRequiredData] = useState<RequirementDto[]>([]);
  const [fromDate, setFromDate] = useState<string>(
    toISOString(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, settoDate] = useState<string>(
    toISOString(endOfDay(new Date()))
  );
  const { data: requiredList, getData: getRequiredList } =
    useApi<RequirementDto[]>();
  const {
    data: searchResult,
    getData: getDataSearch,
    isLoading: loadSearch,
  } = useApi<RequirementDto[]>();
  const { data: userList, getData: getUserList } = useApi<UserDto[]>();
  const { data: statusList, getData: getStatus } =
    useApi<RequirementStatus[]>();
  const {
    data: projectList,
    getData: getProjectJoin,
    errorData: errorProjectGet,
  } = useApi<ProjectDto[]>();
  const {
    data: productList,
    getData: getProducts,
    setData: setProducts,
  } = useApi<ProductDto[]>();
  const {
    data: locations,
    errorData: erroLocation,
    getData: getLocations,
    setData: setLocations,
  } = useApi<ProjectLocation[]>();
  useEffect(() => {
    getUserList("/user/" + encodeBase64({ type: "all" }));
    getStatus("/system/config/" + encodeBase64({ type: "requirement_status" }));
    getProjectJoin("/system/config/eyJ0eXBlIjoicHJvamVjdCJ9", "default");
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setprojectSelect(parseInt(saved));
  }, []);
  useEffect(() => {
    if (projectSelect != 0) {
      setloading(true);
      const cached = productCache[projectSelect];
      // const locations = locationCache[projectSelect];
      if (cached) {
        // 🔁 Nếu có cache → dùng luôn
        setProducts(cached);
        setproductSelect(""); // reset lựa chọn
      } else {
        // 📡 Gọi API nếu chưa cache
        const endpoint =
          "/product/" +
          encodeBase64({ type: "all", project_id: projectSelect });
        getProducts(endpoint, "reload").then((result) => {
          if (result) {
            productCache[projectSelect] = result;
            setProducts(result);
            setproductSelect("");
          }
        });
      }
      if (locations) {
        // 🔁 Nếu có cache → dùng luôn
        setLocations(locations);
      } else {
        // 📡 Gọi API nếu chưa cache
        const endpoint =
          "/project/location/" + encodeBase64({ project_id: projectSelect });
        getLocations(endpoint, "reload").then((result) => {
          if (result) {
            locationCache[projectSelect] = result;
            setLocations(result);
          }
        });
        if (erroLocation?.code == 404) locationCache[projectSelect] = [];
      }
      sessionStorage.setItem("projectSelected", projectSelect.toString());
    }
  }, [projectSelect]);
  useEffect(() => {
    if (projectSelect !== 0) {
      const from = toISOString(fromDate);
      const to = toISOString(toDate);
      let endpoint =
        "/requirements/" +
        encodeBase64({ type: "project", project_id: projectSelect, from, to });
      if (productSelect != "") {
        endpoint =
          "/requirements/" +
          encodeBase64({
            type: "product",
            product_id: productSelect,
            from,
            to,
          });
      }

      setloading(true);
      setRequiredData([]);
      setTimeout(() => {
        getRequiredList(endpoint, "reload");
        setloading(false);
      }, 3000);
    }
  }, [projectSelect, productSelect, fromDate, toDate]);
  useEffect(() => {
    if (requiredList) {
      const filteredTests = requiredList.filter((req) =>
        filterStatus ? req.status === filterStatus : true
      );
      setRequiredData(filteredTests);
    }
  }, [filterStatus, requiredList]);
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
              project_id: projectSelect,
              search_string: finalString,
            })
        );
      }, 3000);
    }
  }, [searchString]);
  const onLoadRequire = async () => {
    const from = fromDate;
    const to = toDate;
    let endpoint =
      "/requirements/" +
      encodeBase64({ type: "project", project_id: projectSelect, from, to });
    if (productSelect != "") {
      endpoint =
        "/requirements/" +
        encodeBase64({
          type: "product",
          product_id: productSelect,
          from,
          to,
        });
    }
    getRequiredList(endpoint, "reload");
  };
  const reloadLocation = async () => {
    await getLocations(
      "/project/location/" + encodeBase64({ project_id: projectSelect })
    );
  };
  return (
    <main className="flex flex-col gap-4 p-4 items-center">
      <div className="flex justify-between w-full">
        <div className="tabs tabs-box" role="tablist">
          <a
            role="tab"
            className={clsx(
              "tab",
              tabContent == "Overview" ? "tab-active" : ""
            )}
            onClick={() => setTabContent("Overview")}
          >
            Tổng quan
          </a>
          <a
            role="tab"
            className={clsx("tab", tabContent == "List" ? "tab-active" : "")}
            onClick={() => setTabContent("List")}
          >
            Danh sách
          </a>
        </div>
      </div>
      <div className="container">
        {tabContent == "Overview" && (
          <div className="bg-base-100 border-base-300 p-6">
            <OverviewRequirement />
          </div>
        )}
        {tabContent == "List" && (
          <div>
            <h1 className="text-3xl font-bold text-center">
              Danh sách yêu cầu
            </h1>
            {!projectList && !errorProjectGet ? (
              <span className="loading loading-dots loading-xl"></span>
            ) : (
              <div className="flex justify-between shadow w-full gap-2 mt-4">
                <div className="flex flex-1 gap-2">
                  <select
                    name="project"
                    className="select"
                    value={projectSelect}
                    onChange={(e) =>
                      setprojectSelect(Number.parseInt(e.target.value))
                    }
                  >
                    <option value={0} disabled>
                      Chọn dự án
                    </option>
                    {projectList?.map((pj) => {
                      return (
                        <option value={pj.id} key={"project_" + pj.id}>
                          {pj.name}
                        </option>
                      );
                    })}
                  </select>
                  {projectSelect != 0 && productList && (
                    <select
                      className="select w-fit"
                      name="product"
                      value={productSelect}
                      onChange={(e) => setproductSelect(e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      {productList?.map((pd) => (
                        <option value={pd.id} key={"product_" + pd.id}>
                          {pd.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="flex">
                    <span className="label">Từ</span>
                    <DateTimePicker
                      value={fromDate}
                      onChange={setFromDate}
                      className="w-full"
                    />
                  </div>
                  <div className="flex">
                    <span className="label">Đến</span>
                    <DateTimePicker
                      value={toDate}
                      onChange={settoDate}
                      className="w-full"
                    />
                  </div>
                </div>

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
                          Đang tải{" "}
                          <span className="loading loading-spinner"></span>
                        </li>
                      )}
                      {searchResult ? (
                        searchResult.map((res) => (
                          <li key={res.id + "searchRes"}>
                            <Link
                              href={
                                `/requirement/` +
                                encodeBase64({
                                  requirement_id: res.id,
                                  project_id: projectSelect,
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

                <div className="flex gap-2">
                  <button
                    className="btn btn-info"
                    onClick={() => setShowAddRequirment(true)}
                  >
                    Thêm yêu cầu
                  </button>
                </div>
              </div>
            )}
            {projectSelect != 0 ? (
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
                <RequirementList
                  loading={loading}
                  project_id={projectSelect}
                  requiredList={requiredData}
                  userList={userList}
                />
              </div>
            ) : (
              <div className="alert alert-info mt-4">Chưa chọn dự án nào</div>
            )}
          </div>
        )}
      </div>
      {showAddRequirment && (
        <AddRequirementModal
          product_list={productList || []}
          locationList={locations || []}
          onAddNewLocation={() => setShowAddLocation(true)}
          onClose={() => setShowAddRequirment(false)}
          onCreated={() => onLoadRequire()}
        />
      )}
      {showAddLocation && (
        <AddLocationModal
          project_id={projectSelect}
          onClose={() => setShowAddLocation(false)}
          onUpdate={async () => await reloadLocation()}
        />
      )}
    </main>
  );
}

export default RequirementsClient;
