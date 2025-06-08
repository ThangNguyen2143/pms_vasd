"use client";
import { BadgeInfo } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import InforBugRefModal from "../modals/infor-bug-ref-modal";

export default function TaskLinks({ task_id }: { task_id: number }) {
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
      <h3 className="text-lg font-semibold text-primary mb-2">
        🔗 Bug of Task
      </h3>
      <div className="space-y-1 max-h-60 overflow-y-auto">
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
