"use client";
import { BadgeInfo, Link2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import InforBugRefModal from "../modals/infor-bug-ref-modal";
import { RequirementTask } from "~/lib/types";

export default function TaskLinks({
  task_id,
  requirementTasks,
  onLinkRequirement,
}: {
  task_id: number;
  requirementTasks?: RequirementTask[];
  onLinkRequirement: () => void;
}) {
  const [showBugModal, setshowBugModal] = useState<number>();
  const { data: bugList, getData } = useApi<
    {
      id: number;
      title: string;
      assign_id?: number;
      assign_name?: string;
      status: string;
    }[]
  >();
  useEffect(() => {
    getData("/tasks/detail/" + encodeBase64({ type: "bug", task_id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task_id]);
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary mb-2">
          🔗 Các liên kết
        </h3>
        <div
          className="btn btn-circle tooltip"
          data-tip="Đính kèm yêu cầu liên quan"
        >
          <button onClick={onLinkRequirement}>
            <Link2 />
          </button>
        </div>
      </div>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        <h4 className="italic font-bold">Yêu cầu liên kết:</h4>

        {requirementTasks && requirementTasks.length > 0 ? (
          requirementTasks.map((reqTask) => (
            <span key={reqTask.requirement_id} className="ml-1">
              [ID: {reqTask.requirement_id}] - {reqTask.requirement_title}
            </span>
          ))
        ) : (
          <span className="italic text-gray-500">Chưa liên kết</span>
        )}
      </div>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        <h4 className="italic font-bold">Bugs</h4>
        {bugList ? (
          bugList.map((bug) => (
            <div key={bug.id}>
              <p>
                <strong>Bug #:</strong> {bug.title}{" "}
                <span
                  onClick={() => setshowBugModal(bug.id)}
                  className="badge badge-info badge-outline"
                >
                  <BadgeInfo />
                </span>
              </p>
              <p>Trạng thái: {bug.status}</p>
              <p>Giao cho: {bug.assign_name || "Chưa được phân công"}</p>
            </div>
          ))
        ) : (
          <span className="italic text-gray-500">Chưa liên kết</span>
        )}
      </div>
      {showBugModal && task_id && (
        <InforBugRefModal
          bug_id={showBugModal}
          onClose={() => setshowBugModal(undefined)}
        />
      )}
    </div>
  );
}
