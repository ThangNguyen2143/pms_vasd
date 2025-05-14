import { notFound } from "next/navigation";
import { toast } from "sonner";
import TaskInfo from "~/components/tasks/task-detail/info-task";
import TaskAssign from "~/components/tasks/task-detail/task-asgin";
import TaskComments from "~/components/tasks/task-detail/task-comment";
import { fetchData } from "~/lib/api-client";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { Comment, Task, TaskDTO, UserDto, WorkStatus } from "~/lib/types";
async function fetchTaskDetail(task_id: number): Promise<Task> {
  const res = await fetchData<TaskDTO>({
    endpoint: "/tasks/detail/" + encodeBase64({ task_id }),
    cache: "default",
  });

  if (res.code != 200) {
    if (res.code == 404) notFound();
    toast.error(res.message);
  }
  const userList = await fetchData<UserDto[]>({
    endpoint: "/user/eyJ0eXBlIjoiYWxsIn0=",
    cache: "default",
  });
  const statusList = await fetchData<WorkStatus[]>({
    endpoint: "/system/config/eyJ0eXBlIjoidGFza19zdGF0dXMifQ==",
  });

  return {
    ...res.value,
    name_user: userList.value.find((user) => user.userid == res.value.create_by)
      ?.userData.display_name,
    status_name: statusList.value.find(
      (status) => status.code == res.value.status
    )?.display,
  } as Task;
}

async function fetchComments(task_id: number) {
  const res = await fetchData<Comment[]>({
    endpoint: "/tasks/comments/" + encodeBase64({ task_id }),
    cache: "default",
  });
  return res.value;
}
async function TaskDetailPage(prop: {
  params: Promise<{ taskdetail: string }>;
}) {
  const { taskdetail } = await prop.params;
  const taskdecode: { task_id: number } = decodeBase64(
    decodeURIComponent(taskdetail)
  ) as { task_id: number };
  const task = await fetchTaskDetail(taskdecode.task_id);
  const comments = await fetchComments(taskdecode.task_id);
  return (
    <div>
      <h2>Chi tiết nhiệm vụ</h2>
      <TaskInfo task={task} />
      <TaskAssign assignTo={task.name_user} />
      <TaskComments comments={comments} />
    </div>
  );
}

export default TaskDetailPage;
