import { decodeBase64 } from "~/lib/services";
import TaskDetailClient from "./task-detail-client";

async function TaskDetailPage(prop: {
  params: Promise<{ taskdetail: string }>;
}) {
  const { taskdetail } = await prop.params;
  const taskdecode: { task_id: number } = decodeBase64(
    decodeURIComponent(taskdetail)
  ) as { task_id: number };
  return <TaskDetailClient task_id={taskdecode.task_id} />;
}

export default TaskDetailPage;
