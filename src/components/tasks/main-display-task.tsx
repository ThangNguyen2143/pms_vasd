/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import TaskByProduct from "./task-by-product";
import UnapprovedList from "./unapprove-tab";
import { DeadlineWarning, TaskUnAcceptance } from "~/lib/types";
import WarningDeadlineTab from "./waring-deadline-tab";

function MainDisplayTask() {
  const [displayList, setDisplayList] = useState<string>("");

  const { data: dataFilter, getData: getDataFilter } = useApi();
  useEffect(() => {
    if (displayList == "unapproved_criteria")
      getDataFilter(
        "/tasks/overview/" + encodeBase64({ type: "unapproved_criteria" })
      );
    else if (displayList == "warning_deadline")
      getDataFilter(
        "/tasks/overview/" + encodeBase64({ type: "deadline_warning" })
      );
  }, [displayList]);

  return (
    <div className="flex flex-col w-full h-full align-middle gap-4">
      <div className="filter">
        <input
          className="btn filter-reset"
          type="radio"
          name="metaframeworks"
          aria-label="All"
          onClick={() => setDisplayList("")}
        />
        <input
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label="Task chưa chấp thuận"
          onClick={() => setDisplayList("unapproved_criteria")}
        />
        <input
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label="Task sắp đến hạn"
          onClick={() => setDisplayList("warning_deadline")}
        />
      </div>
      {displayList == "" && <TaskByProduct />}
      {displayList == "unapproved_criteria" && (
        <UnapprovedList data={(dataFilter as TaskUnAcceptance[]) || []} />
      )}
      {displayList == "warning_deadline" && (
        <div>
          <WarningDeadlineTab data={(dataFilter as DeadlineWarning[]) || []} />
        </div>
      )}
    </div>
  );
}

export default MainDisplayTask;
