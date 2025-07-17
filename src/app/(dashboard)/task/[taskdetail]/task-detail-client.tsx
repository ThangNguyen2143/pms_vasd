/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import clsx from "clsx";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { Comment, DataRating, Task, WorkStatus } from "~/lib/types";
import { status_with_color_badge } from "~/utils/status-with-color";
import TaskLinks from "~/components/tasks/task-detail/task-link";
import CriteriaTask from "~/components/tasks/task-detail/criterial-task";
import AddCriterialModal from "~/components/tasks/modals/add-criterial-modal";
import { sendEmail } from "~/utils/send-notify";

export default function TaskDetailClient({ task_id }: { task_id: number }) {
  const route = useRouter();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [showAddFileAtachmentModal, setShowAddFileAtachmentModal] =
    useState(false);
  const { data: task, getData: getTask, errorData: errorTask } = useApi<Task>();
  const { removeData: deleteTask } = useApi();
  const { data: taskStatus, getData: getTaskStatus } = useApi<WorkStatus[]>();
  const {
    data: comments,
    getData: getComments,
    errorData: errorComment,
    setData: setComments,
  } = useApi<Comment[]>();
  const { data: criteriaType, getData: getCriterial } =
    useApi<{ code: string; display: string }[]>();
  const { data: criterList, getData: getCrit } = useApi<DataRating[]>();
  const reloadTaskData = async () => {
    await getTask(
      "/tasks/detail/" + encodeBase64({ type: "info", task_id }),
      "reload"
    );
  };
  const reloadComment = async () => {
    await getComments("/tasks/comments/" + encodeBase64({ task_id }), "reload");
  };
  const reloadCrit = async () => {
    await getCrit(
      "/tasks/detail/" + encodeBase64({ type: "acceptance", task_id }),
      "reload"
    );
  };
  useEffect(() => {
    getCriterial("/system/config/eyJ0eXBlIjoiY3JpdGVyaWFfdHlwZSJ9");
    getTaskStatus("/system/config/eyJ0eXBlIjoidGFza19zdGF0dXMifQ==", "default");
  }, []);
  useEffect(() => {
    getTask(
      "/tasks/detail/" + encodeBase64({ type: "info", task_id }),
      "default"
    );
    getComments("/tasks/comments/" + encodeBase64({ task_id }), "default");
    getCrit(
      "/tasks/detail/" + encodeBase64({ type: "acceptance", task_id }),
      "reload"
    );
  }, [task_id]);
  useEffect(() => {
    if (errorComment) {
      if (errorComment.code == 404) {
        setComments([]);
      } else {
        toast.error(errorComment.message || errorComment.title);
      }
    }
  }, [errorComment]);
  const sendNotification = async (except_user_id: number) => {
    // Send notification to all users except the one with except_user_id
    if (task && task.userAssigns && task.userAssigns.length > 0) {
      const notificationPromises = task.userAssigns
        .filter((assignee) => assignee.user_id !== except_user_id)
        .map((assignee) => {
          // Send notification to each assignee
          const content = {
            id: task_id,
            name: "Thông báo cập nhật task",
            message: `Công việc "${task.title}" đã được cập nhật.`,
          };
          const email = assignee.contact?.filter((ct) => ct.code == "email")[0]
            ?.value;
          const link =
            window.location.origin + "/task/" + encodeBase64({ task_id }) ||
            "https://pm.vasd.vn/";
          if (email)
            return sendEmail(content, email, "Thông báo", link, "task");
        });
      try {
        await Promise.all(notificationPromises);
        await reloadTaskData();
      } catch (error) {
        console.error("Lỗi gửi thông báo:", error);
        toast.error("Lỗi gửi thông báo đến người dùng");
      }
    }
  };
  const handleDeleteTask = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) {
      const re = await deleteTask("/tasks/" + encodeBase64({ task_id }));
      if (re != null) {
        toast.success("Xóa nhiệm vụ thành công");
        route.back();
      }
    }
  };
  if (!task) {
    if (errorTask?.code == 404) return notFound();
    return (
      <div className="items-center">
        <span className="loading loading-infinity"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 grid md:grid-cols-3 gap-6">
        {/* Header */}
        <div className="md:col-span-3 flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-primary">
            📋 Chi tiết Nhiệm vụ
          </h2>
          <div>
            <span
              className={clsx(
                "text-sm px-4 py-2 rounded-full",
                `${status_with_color_badge[task.status]}`
              )}
            >
              {taskStatus
                ? taskStatus.find((st) => st.code == task.status)?.display
                : task.status}
            </span>
            {task.status == "NEW" && (
              <button
                className="btn btn-error btn-outline ml-2"
                onClick={handleDeleteTask}
              >
                Xóa task
              </button>
            )}
          </div>
        </div>

        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">
          <TaskInfo
            task={task}
            onEdit={() => setShowUpdateModal(true)}
            onUpdate={reloadTaskData}
            onAssign={() => setShowAssignModal(true)}
          />
          <CriteriaTask
            onEvaluate={() => setShowEvaluate(true)}
            task_id={task_id}
            onUpdate={reloadCrit}
            data={criterList || []}
            critTypes={criteriaType || undefined}
          />

          <TaskComments
            comments={comments || undefined}
            task={task}
            onUpdate={reloadComment}
          />
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <TaskLinks
            task_id={task_id}
            requirementTasks={task.requirementTasks}
            onLinkRequirement={() => setShowLinkModal(true)}
          />
          <Attachments
            attachments={task.taskFiles || []}
            task_id={task_id}
            onUpdate={reloadTaskData}
            uploadFile={() => setShowAddFileAtachmentModal(true)}
          />
          <TaskAssign
            assignTo={task.userAssigns}
            task_id={task_id}
            onUpdate={sendNotification}
          />
          <Logs logs={task.taskLogs || []} />
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateInfoTaskModal
          critList={criterList || []}
          criteriaType={criteriaType || []}
          onClose={() => setShowUpdateModal(false)}
          task_info={task}
          onUpdate={async () => {
            reloadTaskData();
            reloadCrit();
          }}
        />
      )}
      {showLinkModal && (
        <LinkRequirementModal
          onClose={() => setShowLinkModal(false)}
          product_id={task.product_id}
          task_id={task_id}
          linked={task.requirementTasks}
          onUpdate={reloadTaskData}
        />
      )}
      {showAssignModal && (
        <AssignUserModal
          onClose={() => setShowAssignModal(false)}
          product_id={task.product_id}
          deadline_task={task.dead_line}
          onUpdate={reloadTaskData}
          task_id={task_id}
        />
      )}
      {showAddFileAtachmentModal && (
        <AddFileAttachmentModal
          onClose={() => setShowAddFileAtachmentModal(false)}
          onUpdate={reloadTaskData}
          task_id={task_id}
        />
      )}
      {showEvaluate && (
        <AddCriterialModal
          task_id={task.task_id}
          onClose={() => setShowEvaluate(false)}
          onUpdate={reloadCrit}
        />
      )}
    </div>
  );
}
