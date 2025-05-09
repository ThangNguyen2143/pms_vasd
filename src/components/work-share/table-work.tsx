/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Priority, WorkShareDto, WorkStatus } from "~/lib/type";
import EditStatus from "./edit-status";
import UpdateWork from "./update-work";

function TableWork({
  project_id,
  priorityList,
  statusList,
}: {
  project_id: number;
  statusList: WorkStatus[];
  priorityList: Priority[];
}) {
  const {
    data: workList,
    getData: getWorkList,
    errorData: errorWorkList,
  } = useApi<WorkShareDto[]>();
  const fetchData = async () => {
    const endpointWork = "/work/" + encodeBase64({ project_id });
    const result = await getWorkList(endpointWork, "no-cache");
    console.log("Fetched result:", result);
  };

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

  return (
    <div className="relative shadow-md sm:rounded-lg">
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
                  </td>
                  <td className="">
                    <UpdateWork
                      display={item.update_at}
                      work_id={item.id}
                      onUpdate={fetchData}
                    />
                  </td>
                  <td className="px-6 py-4">{item.create_at}</td>
                  <td className="px-6 py-4">{item.request_at}</td>
                  <td className="px-6 py-4">{item.deadline}</td>
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
  );
}

export default TableWork;
