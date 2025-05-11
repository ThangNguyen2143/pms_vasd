/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import ListProject from "./project-list-select";
import TableWork from "./table-work";
import AddWorkBtn from "./add-work-btn";
import { encodeBase64 } from "~/lib/services";
import { useApi } from "~/hooks/use-api";
import { Priority, WorkStatus, WorkType } from "~/lib/types";

function MainWork() {
  const [projectSelected, setProjectSelect] = useState<number>(0);
  const { data: statusList, getData: getStatusList } = useApi<WorkStatus[]>();
  const { data: priorityList, getData: getPriority } = useApi<Priority[]>();
  const { data: typeWorkList, getData: getTypeWork } = useApi<WorkType[]>();

  useEffect(() => {
    // Lấy projectSelected từ localStorage khi component mount
    const saved = sessionStorage.getItem("projectSelected");
    if (saved) setProjectSelect(parseInt(saved));
    const fetchData = async () => {
      const endpointStatus =
        "/system/config/" + encodeBase64({ type: "work_status" });
      const endpointPriority =
        "/system/config/" + encodeBase64({ type: "priority" });
      const endpointTypeWork =
        "/system/config/" + encodeBase64({ type: "work_type" });
      await getStatusList(endpointStatus);
      await getPriority(endpointPriority);
      await getTypeWork(endpointTypeWork);
    };
    fetchData();
  }, []);
  // Lưu mỗi khi projectSelected thay đổi
  useEffect(() => {
    if (projectSelected !== 0) {
      sessionStorage.setItem("projectSelected", projectSelected.toString());
    }
  }, [projectSelected]);
  if (!statusList || !priorityList || !typeWorkList) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  return (
    <div className="mt-4 flex flex-col gap-4 items-center">
      <div className="container flex justify-between gap-2.5">
        <ListProject
          projectSelected={projectSelected}
          setProjectSelect={setProjectSelect}
        />
        <AddWorkBtn
          project_id={projectSelected.toString()}
          priority={priorityList}
          typeWork={typeWorkList}
        />
      </div>
      <TableWork
        project_id={projectSelected}
        priorityList={priorityList}
        statusList={statusList}
      />
    </div>
  );
}

export default MainWork;
