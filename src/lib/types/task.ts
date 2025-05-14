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
  name_user: string;
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
