import { decodeBase64 } from "~/lib/services";
import TaskDetailClient from "./task-detail-client";

async function TaskDetailPage(prop: {
  params: Promise<{ taskdetail: string }>;
}) {
  const { taskdetail } = await prop.params;
  const taskdecode: { task_id: number; product_id: string } = decodeBase64(
    decodeURIComponent(taskdetail)
  ) as { task_id: number; product_id: string };
  return (
    <TaskDetailClient
      task_id={taskdecode.task_id}
      product_id={taskdecode.product_id}
    />
  );
}

export default TaskDetailPage;
