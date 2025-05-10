export type WorkShareDto = {
  id: number;
  title: string;
  type: string;
  type_name: string;
  priority: string;
  create_at: string;
  request_at: string;
  deadline?: string;
  update_at?: string;
  pic: string;
  status: string;
};
export type WorkStatus = {
  code: string;
  display: string;
};
export type WorkType = {
  code: string;
  display: string;
};
