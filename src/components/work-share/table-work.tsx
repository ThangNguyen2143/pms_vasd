/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Priority, WorkShareDto, WorkStatus } from "~/lib/types";
import EditStatus from "./edit-status";
import UpdateWork from "./update-work";
import UpdateDeadline from "./update-deadline";
import clsx from "clsx";
import { status_with_color } from "~/utils/status-with-color";
import OverviewWork from "./orverview-work";

function TableWork({
  project_id,
  priorityList,
  statusList,
  role,
}: {
  project_id: number;
  statusList: WorkStatus[];
  priorityList: Priority[];
  role?: string;
}) {
  const {
    data: workList,
    getData: getWorkList,
    errorData: errorWorkList,
  } = useApi<WorkShareDto[]>();
  const fetchData = async () => {
    const endpointWork = "/work/" + encodeBase64({ project_id });
    await getWorkList(endpointWork, "no-cache");
  };
  const isGuess = !role || role == "Guess";
  useEffect(() => {
    const endpointWork = "/work/" + encodeBase64({ project_id });
    getWorkList(endpointWork, "reload");
  }, [project_id]);
  if (project_id === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chưa có dự án nào được chọn
      </div>
    );
  }
  if (!workList && errorWorkList?.code == 404)
    return (
      <>
        <div className="alert alert-info">
          Dự án chưa được thêm công việc nào
        </div>
      </>
    );
  return (
    <div className="relative shadow-md sm:rounded-lg">
      <div className="tabs tabs-lift">
        <input
          type="radio"
          name="tab_swap"
          className="tab"
          id="overview"
          aria-label="Tổng quan công việc"
        />
        <div className="tab-content">
          <OverviewWork
            priorityList={priorityList}
            statusList={statusList}
            dataRaw={workList}
          />
        </div>
        <input
          type="radio"
          name="tab_swap"
          id="detail"
          aria-label="Bảng công việc"
          className="tab"
        />
        <div className="tab-content">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3">
                  Tiêu đề
                </th>
                <th scope="col" className="px-6 py-3">
                  Loại công việc
                </th>
                <th scope="col" className="px-6 py-3">
                  Mức độ <br />
                  ưu tiên
                </th>
                <th scope="col" className="px-6 py-3">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày cập nhật
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày bắt đầu
                </th>
                <th scope="col" className="px-6 py-3">
                  Hạn chót
                </th>
                <th scope="col" className="px-6 py-3">
                  Trách nhiệm
                </th>
              </tr>
            </thead>
            <tbody>
              {workList ? (
                workList.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.type_name}</td>
                      <td className="px-6 py-4">
                        {
                          priorityList?.find(
                            (priority) => priority.code === item.priority
                          )?.display
                        }
                      </td>
                      <td>
                        {!isGuess ? (
                          <EditStatus
                            display={
                              statusList?.find(
                                (status) => status.code === item.status
                              )?.display ?? ""
                            }
                            onUpdated={fetchData}
                            statusList={statusList}
                            work_id={item.id}
                          />
                        ) : (
                          <span
                            className={clsx(
                              "px-6 badge",
                              `badge-${status_with_color(item.status)}`
                            )}
                          >
                            {statusList?.find(
                              (status) => status.code === item.status
                            )?.display ?? ""}
                          </span>
                        )}
                      </td>
                      <td>
                        {isGuess ? (
                          item.update_at
                        ) : (
                          <UpdateWork
                            display={item.update_at}
                            work_id={item.id}
                            onUpdate={fetchData}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">{item.create_at}</td>
                      <td className="px-6 py-4">{item.request_at}</td>
                      <td>
                        {isGuess ? (
                          item.update_at
                        ) : (
                          <UpdateDeadline
                            display={item.deadline}
                            work_id={item.id}
                            onUpdate={fetchData}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">{item.pic}</td>
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td colSpan={10} className="px-6 py-4 text-center">
                    {errorWorkList ? (
                      <span className="alert alert-error">
                        {errorWorkList.message}
                      </span>
                    ) : (
                      <span>Đang tải...</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TableWork;
