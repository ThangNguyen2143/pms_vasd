import { RequirementFile } from "./requirment";

export type BugDto = {
  product_id: string;
  bug_id: number;
  name: string;
  date_create: string;
  status: string;
  create_by: string;
  dead_line?: string;
};
export type BugDetail = {
  id: number;
  title: string;
  description: string;
  priority: string;
  severity: string;
  test_case_ref: null;
  test_case_ref_id: null;
  related_task_name: null;
  related_task_id: null;
  tags: string[];
  is_update: false;
  reported_by: number;
  reporter_name: string;
  reported_at: string;
  assignInfo?: BugAssign;
  bugFiles: RequirementFile[];
  bugLogs: BugLog[];
  status: string;
  reTestingBug: [];
};
export type BugLog = {
  id: number;
  name: string;
  content: string;
  date: string;
};
export type BugAssign = {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
};
export type BugStatus = {
  code: string;
  description: string;
};
export type BugSeverity = {
  code: string;
  display: string;
  hint: string;
};
export type BugComment = {
  id: number;
  comment: string;
  user_id: number;
  user_name: string;
  date: string;
};
