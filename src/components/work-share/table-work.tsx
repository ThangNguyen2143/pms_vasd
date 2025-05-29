"use client";
import { Priority, WorkShareDto, WorkStatus } from "~/lib/types";
import EditStatus from "./edit-status";
import UpdateWork from "./update-work";
import UpdateDeadline from "./update-deadline";
import clsx from "clsx";
import { status_with_color } from "~/utils/status-with-color";
import OverviewWork from "./orverview-work";

function TableWork({
  workList,
  priorityList,
  statusList,
  isGuess,
  onUpdate,
}: {
  workList?: WorkShareDto[];
  priorityList: Priority[];
  statusList: WorkStatus[];
  isGuess?: boolean;
  onUpdate: () => Promise<void>;
}) {
  if (!workList)
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
          defaultChecked
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
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase ">
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
              {workList.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 font-medium  whitespace-nowrap ">
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
                          onUpdated={onUpdate}
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
                          onUpdate={onUpdate}
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
                          onUpdate={onUpdate}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">{item.pic}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TableWork;
