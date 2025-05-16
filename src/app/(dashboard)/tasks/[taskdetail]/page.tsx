import { notFound } from "next/navigation";
import { toast } from "sonner";
import { fetchData } from "~/lib/api-client";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { Comment, Contact, Task, UserDto, WorkStatus } from "~/lib/types";
import TaskDetailClient from "./task-detail-client";
async function fetchTaskDetail(task_id: number): Promise<Task> {
  const res = await fetchData<Task>({
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
  const asginContactToList = res.value.userAssigns?.map((us) => {
    const list_contact: Contact[] | undefined = userList.value.find(
      (s) => s.userid == us.user_id
    )?.userData.contact;
    return {
      ...us,
      contact: list_contact,
    };
  });
  return {
    ...res.value,
    user_create_name: userList.value.find(
      (user) => user.userid == res.value.create_by
    )?.userData.display_name,
    status_name: statusList.value.find(
      (status) => status.code == res.value.status
    )?.display,
    userAssigns: asginContactToList,
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
  return <TaskDetailClient task={task} comments={comments} />;
}

export default TaskDetailPage;
