// app/tasks/[id]/TaskDetailClient.tsx
"use client";
import clsx from "clsx";
import React, { useState } from "react";
import AssignUserModal from "~/components/tasks/task-detail/assign-task-modal";
import Attachments from "~/components/tasks/task-detail/attachments";
import TaskInfo from "~/components/tasks/task-detail/info-task";
import LinkRequirementModal from "~/components/tasks/task-detail/link-requirment-task";
import TaskAssign from "~/components/tasks/task-detail/task-asgin";
import TaskComments from "~/components/tasks/task-detail/task-comment";
import Logs from "~/components/tasks/task-detail/task-log";
import UpdateInfoTaskModal from "~/components/tasks/task-detail/update-info-task-btn";
import { Comment, Task } from "~/lib/types";
import { status_with_color } from "~/utils/status-with-color";

export default function TaskDetailClient({
  task,
  comments,
}: {
  task: Task;
  comments: Comment[];
}) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 grid md:grid-cols-3 gap-6">
        {/* Header */}
        <div className="md:col-span-3 flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-primary">
            📋 Chi tiết Nhiệm vụ
          </h2>
          <span
            className={clsx(
              "badge text-sm px-4 py-2 rounded-full",
              `badge-${status_with_color(task.status)}`
            )}
          >
            {task.status_name}
          </span>
        </div>

        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">
          <TaskInfo
            task={task}
            onEdit={() => setShowUpdateModal(true)}
            onLinkRequirement={() => setShowLinkModal(true)}
            onAssign={() => setShowAssignModal(true)}
          />
          <Attachments attachments={task.taskFiles || []} />
          <TaskComments comments={comments} task_id={task.id} />
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <TaskAssign assignTo={task.userAssigns} />
          <Logs logs={task.taskLogs || []} />
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateInfoTaskModal onClose={() => setShowUpdateModal(false)} />
      )}
      {showLinkModal && (
        <LinkRequirementModal onClose={() => setShowLinkModal(false)} />
      )}
      {showAssignModal && (
        <AssignUserModal onClose={() => setShowAssignModal(false)} />
      )}
    </div>
  );
}
