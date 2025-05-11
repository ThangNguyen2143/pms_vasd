"use client";

import { CircleSmall } from "lucide-react";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectDetailDto } from "~/lib/types";

function MainDisplayOnProject({ project_id }: { project_id: number }) {
  const { data, getData: getProject, errorData } = useApi<ProjectDetailDto>();
  useEffect(() => {
    const endpoint = "/project/detail/" + encodeBase64({ project_id });
    getProject(endpoint, "reload");
  }, []);
  if (!data && !errorData) return <div>Đang tải dữ liệu...</div>;
  if (!data && errorData) return <div>{errorData.message}</div>;
  console.log(data);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dự án: {data?.name}</h1>
      <p className="text-lg">{data?.description}</p>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Tạo bởi</div>
          <div className="stat-value max-w-64 text-wrap">
            {data?.project_log[0].name}
          </div>
          <div className="stat-desc">{data?.create_at}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Thời gian bắt đầu</div>
          <div className="stat-value">{data?.start_date}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Kết thúc dự kiến</div>
          <div className="stat-value">{data?.end_date}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Trạng thái</div>
          <div className="stat-value">{data?.status}</div>
          {data?.actual_end_date && (
            <div className="stat-desc">Vào: {data.actual_end_date}</div>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="flex-1/2">
          <p className="text-lg">Dòng thời gian</p>
          <div className="overflow-y-auto">
            <ul className="timeline timeline-vertical">
              {data?.project_log ? (
                data?.project_log.map((log) => {
                  return (
                    <li key={log.date + "log"}>
                      <div className="timeline-start">{log.date}</div>
                      <div className="timeline-middle">
                        <CircleSmall />
                      </div>
                      <div className="timeline-end timeline-box text-sm text-center max-w-xs">
                        <div
                          className="tooltip tooltip-bottom"
                          data-tip={`Người thực hiện: ${log.name}`}
                        >
                          <span>{log.description}</span>
                        </div>
                      </div>
                      <hr />
                    </li>
                  );
                })
              ) : (
                <li>Chưa có dữ liệu</li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex-1/2">
          <p className="text-lg">Danh sách các bên liên quan</p>
          <ul className="list">
            {data?.project_stakeholders.map((stakholder) => {
              return (
                <li key={stakholder.code} className="list-row">
                  <div>{stakholder.name}</div>
                  <div>
                    <div>{stakholder.description}</div>
                    <div className="list-col-row">
                      <p>Liên hệ:</p>
                      {stakholder.contacts.map((contact, index) => {
                        return (
                          <p key={index + "" + stakholder.code + contact.code}>
                            {contact.code}:{contact.value}
                          </p>
                        );
                      })}
                    </div>
                    <button className="btn btn-square btn-ghost">
                      <svg
                        className="size-[1.2em]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M6 3L20 12 6 21 6 3z"></path>
                        </g>
                      </svg>
                    </button>
                    <button className="btn btn-square btn-ghost">
                      <svg
                        className="size-[1.2em]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MainDisplayOnProject;
