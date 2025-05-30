/* eslint-disable react-hooks/exhaustive-deps */
// app/tasks/[id]/TaskDetailClient.tsx
"use client";
import clsx from "clsx";
import { notFound } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AddFileAttachmentModal from "~/components/tasks/modals/add-attachment-file-task";
import AssignUserModal from "~/components/tasks/modals/assign-task-modal";
import Attachments from "~/components/tasks/task-detail/attachments";
import TaskInfo from "~/components/tasks/task-detail/info-task";
import LinkRequirementModal from "~/components/tasks/modals/link-requirment-task";
import TaskAssign from "~/components/tasks/task-detail/task-asgin";
import TaskComments from "~/components/tasks/task-detail/task-comment";
import Logs from "~/components/tasks/task-detail/task-log";
import UpdateInfoTaskModal from "~/components/tasks/modals/update-info-task-btn";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Comment, Task, UserDto, WorkStatus } from "~/lib/types";
import { status_with_color } from "~/utils/status-with-color";
import TaskLinks from "~/components/tasks/task-detail/task-link";

export default function TaskDetailClient({
  task_id,
  product_id,
}: {
  task_id: number;
  product_id: string;
}) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddFileAtachmentModal, setShowAddFileAtachmentModal] =
    useState(false);
  const { data: task, getData: getTask, errorData: errorTask } = useApi<Task>();
  const {
    data: users,
    getData: getUsers,
    errorData: errorUser,
  } = useApi<UserDto[]>();
  const { data: taskStatus, getData: getTaskStatus } = useApi<WorkStatus[]>();
  const {
    data: comments,
    getData: getComments,
    errorData: errorComment,
    setData: setComments,
  } = useApi<Comment[]>();
  const reloadTaskData = async () => {
    await getTask(
      "/tasks/detail/" + encodeBase64({ type: "info", task_id }),
      "reload"
    );
  };
  const reloadComment = async () => {
    await getComments("/tasks/comments/" + encodeBase64({ task_id }), "reload");
  };
  useEffect(() => {
    getTask(
      "/tasks/detail/" + encodeBase64({ type: "info", task_id }),
      "default"
    );
    getUsers("/user/eyJ0eXBlIjoiYWxsIn0=", "default");
    getTaskStatus("/system/config/eyJ0eXBlIjoidGFza19zdGF0dXMifQ==", "default");
    getComments("/tasks/comments/" + encodeBase64({ task_id }), "default");
  }, [task_id]);
  useEffect(() => {
    if (errorComment) {
      if (errorComment.code == 404) {
        setComments([]);
      } else {
        toast.error(errorComment.message);
      }
    }
  }, [errorComment]);
  const userAssignsWithContact = useMemo(() => {
    return task?.userAssigns?.map((us) => {
      const list_contact = users?.find((s) => s.userid == us.user_id)?.userData
        .contact;
      return { ...us, contact: list_contact };
    });
  }, [task?.userAssigns, users]);
  if (!task) {
    if (errorTask?.code == 404) return notFound();
    return (
      <div className="items-center">
        <span className="loading loading-infinity"></span>
      </div>
    );
  }
  if (errorUser) {
    if (errorUser.code == 404)
      toast.info("Không tìm thấy dữ liệu danh sách người dùng");
    else {
      toast.error(errorUser.message);
    }
  }

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
            {taskStatus
              ? taskStatus.find((st) => st.code == task.status)?.display
              : task.status}
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
          <Attachments
            attachments={task.taskFiles || []}
            uploadFile={() => setShowAddFileAtachmentModal(true)}
          />
          <TaskComments
            comments={comments || undefined}
            task={task}
            onUpdate={reloadComment}
          />
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <TaskLinks task_id={task_id} />
          <TaskAssign
            assignTo={userAssignsWithContact}
            task_id={task_id}
            onUpdate={reloadTaskData}
          />
          <Logs logs={task.taskLogs || []} />
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateInfoTaskModal
          onClose={() => setShowUpdateModal(false)}
          task_info={task}
          onUpdate={reloadTaskData}
        />
      )}
      {showLinkModal && (
        <LinkRequirementModal
          onClose={() => setShowLinkModal(false)}
          product_id={product_id}
          task_id={task_id}
          onUpdate={reloadTaskData}
        />
      )}
      {showAssignModal && (
        <AssignUserModal
          onClose={() => setShowAssignModal(false)}
          hasAssign={userAssignsWithContact || []}
          onUpdate={reloadTaskData}
          task_id={task_id}
          users={users || []}
        />
      )}
      {showAddFileAtachmentModal && (
        <AddFileAttachmentModal
          onClose={() => setShowAddFileAtachmentModal(false)}
          onUpdate={reloadTaskData}
          task_id={task_id}
        />
      )}
    </div>
  );
}
