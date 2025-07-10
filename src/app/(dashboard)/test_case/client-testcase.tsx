"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SelectProject from "~/components/tasks/select-project";
import CreateTestcaseForm from "~/components/testcase/modals/create-testcase-form";
import TestList from "~/components/testcase/test-list";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductModule, TestcaseDto, UserDto, WorkStatus } from "~/lib/types";

function ClientTestCasesPage() {
  const route = useRouter();
  const [navigatingId, setNavigatingId] = useState<boolean>(false);
  const [selectProduct, setSelectProduct] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [testList, setTestList] = useState<TestcaseDto[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [findTest, setFindTest] = useState("");
  // API endpoints
  const endpoint = (product_id: string) =>
    "/testcase/" + encodeBase64({ product_id });
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  const endpointStatus = "/system/config/eyJ0eXBlIjoidGVzdF9zdGF0dXMifQ==";
  const endpointModule =
    "/product/" + encodeBase64({ type: "module", product_id: selectProduct });
  const {
    data: tests,
    getData: getTestList,
    isLoading,
    errorData,
  } = useApi<TestcaseDto[]>();
  const { data: userList, getData: getUser } = useApi<UserDto[]>();
  const { data: statusList, getData: getStatus } = useApi<WorkStatus[]>();
  const { data: moduleList, getData: getModule } = useApi<ProductModule[]>();
  useEffect(() => {
    getStatus(endpointStatus);
    getUser(endpointUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (selectProduct != "") {
      getModule(endpointModule);
      getTestList(endpoint(selectProduct), "reload");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProduct]);

  useEffect(() => {
    if (tests) {
      setTestList(tests);
    } else {
      setTestList([]);
    }
  }, [tests]);
  useEffect(() => {
    if (tests) {
      const filteredTests = tests
        .filter((test) => (filterStatus ? test.status === filterStatus : true))
        .filter((test) =>
          findTest
            ? test.name.toLowerCase().includes(findTest.toLowerCase())
            : true
        );
      setTestList(filteredTests);
    }
  }, [filterStatus, findTest, tests]);
  return (
    <div className="flex flex-col w-full h-full align-middle gap-4">
      <div className="flex flex-row justify-between items-center">
        <SelectProject
          setProductSelect={setSelectProduct}
          productSelected={selectProduct}
        />
        <button
          className="btn btn-info"
          onClick={() => {
            setNavigatingId(true);
            route.push("/test_case/create");
          }}
          disabled={navigatingId}
        >
          {navigatingId ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Thêm testcase"
          )}
        </button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <label className="input">
            <span className="label">Tìm kiếm</span>
            <input
              type="text"
              placeholder="Nhập tiêu đề test"
              value={findTest}
              onChange={(e) => setFindTest(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label className="select">
            <span className="label">Trạng thái</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              {statusList?.map((status) => (
                <option key={status.code} value={status.code}>
                  {status.display}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {isLoading ? (
        <div className="flex text-center justify-center">
          <span className="loading loading-infinity loading-xl" />
        </div>
      ) : errorData && errorData.code != 404 ? (
        <div className="alert alert-error justify-center">
          {errorData.message}
        </div>
      ) : (
        <TestList
          product_id={selectProduct}
          moduleList={moduleList || []}
          statusList={statusList || []}
          testList={testList}
          userList={userList || []}
        />
      )}

      <dialog
        className={clsx(
          "modal",
          showModal && selectProduct != "" ? "modal-open" : ""
        )}
      >
        <div className="modal-box w-11/12 max-w-7xl max-h-11/12 h-full">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <h3 className="text-lg">Tạo testcase</h3>
          <CreateTestcaseForm
            product_id={selectProduct}
            onSuccess={() => {
              getTestList(endpoint(selectProduct), "reload");
              setShowModal(false);
            }} // trigger reload
          />
        </div>
      </dialog>
    </div>
  );
}

export default ClientTestCasesPage;
