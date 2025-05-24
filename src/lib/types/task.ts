import { Contact } from "./account";
import { RequirementFile } from "./requirment";

export type TaskDTO = {
  id: number;
  title: string;
  description: string;
  create_by: number;
  create_at: string;
  date_end?: string;
  date_start?: string;
  dead_line: string;
  is_update: boolean;
  status: string;
};
export type Task = Exclude<TaskDTO, "id"> & {
  task_id: number;
  taskLogs: TaskLog[];
  userAssigns?: UserAssignsTask[];
  taskFiles?: RequirementFile[];
  requirementTasks?: RequirementTask[];
  user_create_name: string;
  product_id: string;
  status_name: string;
};
export type Comment = {
  id: number;
  name: string;
  content: string;
  date: string;
  created_by: number;
};
export type TaskLog = {
  id: number;
  name: string;
  content: string;
  date: string;
};
export type UserAssignsTask = {
  user_id: number;
  name: string;
  date_assign: string;
  date_end?: string;
  date_start?: string;
  cur_deadLine: string;
  contact?: Contact[];
};

export type RequirementTask = {
  requirement_id: number;
  requirement_title: string;
};
