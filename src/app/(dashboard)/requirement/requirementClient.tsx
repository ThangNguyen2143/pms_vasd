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
  UserDto,
} from "~/lib/types";

import { ReactNode } from "react";
import Link from "next/link";
import OverviewRequirement from "~/components/requirment/overview-required-tab";
import clsx from "clsx";
import AddLocationModal from "~/components/requirment/modals/add-location-modal";
import AddRequirementModal from "~/components/requirment/modals/add-requirement-modal";
import { format_date, toISOString } from "~/utils/fomat-date";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";

function ContructionTable({ children }: { children: ReactNode }) {
  return (
    <table className="table overflow-x-auto">
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
const productCache: Record<number, ProductDto[]> = {};
const locationCache: Record<number, ProjectLocation[]> = {}; //Để cache dữ liệu khoa phòng trong trường hợp có biểu đồ dùng khoa phòng
function RequirementsClient() {
  const [tabContent, setTabContent] = useState<string>("List");
  const [productSelect, setproductSelect] = useState<string>("");
  const [projectSelect, setprojectSelect] = useState<number>(0);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddRequirment, setShowAddRequirment] = useState(false);
  const [loading, setloading] = useState(false);
  const [fromDate, setFromDate] = useState<string>(
    toISOString(startOfDay(subDays(new Date(), 7))) //Mặc định 1 tuần trước
  );
  const [toDate, settoDate] = useState<string>(
    toISOString(endOfDay(new Date()))
  );
  const {
    data: requiredList,
    getData: getRequiredList,
    errorData,
  } = useApi<RequirementDto[]>();
  const { data: userList, getData: getUserList } = useApi<UserDto[]>();
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
    getProjectJoin("/system/config/eyJ0eXBlIjoicHJvamVjdCJ9", "default");
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setprojectSelect(parseInt(saved));
  }, []);
  useEffect(() => {
    if (errorData && errorData.code != 404) {
      toast.error(errorData.message || errorData.title);
    }
  }, [errorData]);
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
      setTimeout(() => {
        getRequiredList(endpoint, "reload");
        setloading(false);
      }, 3000);
    }
  }, [projectSelect, productSelect, fromDate, toDate]);
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
      <h1 className="text-2xl font-bold">Danh sách yêu cầu</h1>
      {!projectList && !errorProjectGet ? (
        <span className="loading loading-dots loading-xl"></span>
      ) : (
        <div className="flex justify-between shadow w-full">
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
          <div className="join">
            <input
              type="text"
              className="input join-item"
              placeholder="Tìm kiếm..."
            />
            <button className="btn join-item">
              <Search />
            </button>
          </div>
        </div>
      )}
      {projectSelect != 0 ? (
        <>
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
                className={clsx(
                  "tab",
                  tabContent == "List" ? "tab-active" : ""
                )}
                onClick={() => setTabContent("List")}
              >
                Danh sách
              </a>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddRequirment(true)}
              >
                Thêm yêu cầu
              </button>
            </div>
          </div>
          <div className="container">
            {tabContent == "Overview" && (
              <div className="bg-base-100 border-base-300 p-6">
                <OverviewRequirement />
              </div>
            )}
            {tabContent == "List" && (
              <div className="bg-base-100 border-base-300 p-6">
                <ContructionTable>
                  {requiredList && requiredList.length > 0 ? (
                    requiredList.map((required) => {
                      return (
                        <tr key={required.id}>
                          <td>{required.id}</td>
                          <td>{required.title}</td>
                          <td>{required.priority}</td>
                          <td>{required.type}</td>
                          <td>{format_date(required.date_create)}</td>
                          <td>
                            {userList
                              ? userList.find(
                                  (us) => us.userid == required.created_by
                                )?.userData.display_name
                              : required.created_by}
                          </td>
                          <td>
                            {required.date_end
                              ? format_date(required.date_end)
                              : "-"}
                          </td>
                          <td>
                            <Link
                              href={
                                `/requirement/` +
                                encodeBase64({
                                  requirement_id: required.id,
                                  project_id: projectSelect,
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
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="alert alert-info">Chưa chọn dự án nào</div>
      )}

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
