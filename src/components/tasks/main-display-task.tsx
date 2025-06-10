/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import SelectProject from "./select-project";
import TaskList from "./task-list";
import CreateTaskForm from "./create-task-form";
import clsx from "clsx";
import { TaskDTO, WorkStatus } from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";

function MainDisplayTask() {
  const [selectProduct, setSelectProduct] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [findTask, setFindTask] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const endpoint = (product_id: string) =>
    "/tasks/" + encodeBase64({ product_id });
  const endpointStatus = "/system/config/eyJ0eXBlIjoidGFza19zdGF0dXMifQ==";
  const [taskList, setTaskList] = useState([] as TaskDTO[]);
  const {
    data: tasks,
    getData: getTaskList,
    isLoading,
    errorData,
  } = useApi<TaskDTO[]>();
  const { data: statusList, getData: getStatus } = useApi<WorkStatus[]>();
  useEffect(() => {
    getStatus(endpointStatus);
  }, []);
  useEffect(() => {
    if (selectProduct != "") getTaskList(endpoint(selectProduct), "reload");
  }, [selectProduct]);
  useEffect(() => {
    if (tasks) {
      setTaskList(tasks);
    } else setTaskList([]);
  }, [tasks]);
  useEffect(() => {
    if (tasks) {
      const filteredTasks = tasks
        .filter((task) => (filterStatus ? task.status === filterStatus : true))
        .filter((task) =>
          findTask
            ? task.title.toLowerCase().includes(findTask.toLowerCase())
            : true
        );
      setTaskList(filteredTasks);
    }
  }, [filterStatus, findTask]);
  return (
    <div className="flex flex-col w-full h-full align-middle gap-4">
      <div className="flex flex-row justify-between items-center">
        <SelectProject
          setProductSelect={setSelectProduct}
          productSelected={selectProduct}
        />
        <button className="btn btn-info" onClick={() => setShowModal(true)}>
          Thêm task
        </button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <label className="input">
            <span className="label">Tìm kiếm</span>
            <input
              type="text"
              placeholder="Nhập tên việc"
              value={findTask}
              onChange={(e) => setFindTask(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label className="select">
            <span className="label">Trạng thái</span>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
              }}
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
        <TaskList
          product_id={selectProduct}
          statusList={statusList || []}
          taskList={taskList || undefined}
        />
      )}

      <dialog
        className={clsx(
          "modal",
          showModal && selectProduct != "" ? "modal-open" : ""
        )}
      >
        <div className="modal-box max-w-5xl w-full">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <h3 className="text-lg">Thêm task</h3>
          <CreateTaskForm
            product_id={selectProduct}
            onSuccess={() => {
              getTaskList(endpoint(selectProduct), "reload");
              setShowModal(false);
            }} // trigger reload
          />
        </div>
      </dialog>
    </div>
  );
}

export default MainDisplayTask;
