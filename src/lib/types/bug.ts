import { RequirementFile } from "./requirment";

export type BugDto = {
  product_id: string;
  bug_id: number;
  name: string;
  date_create: string;
  status: string;
  is_update: boolean;
  create_by: string;
  dead_line?: string;
};
export type BugDetail = {
  id: number;
  title: string;
  product_id: string;
  description: string;
  priority: string;
  severity: string;
  log: string;
  test_case_ref?: string;
  test_case_ref_id?: number;
  related_task_name?: string;
  related_task_id?: number;
  tags: string[];
  is_update: boolean;
  reported_by: number;
  reporter_name: string;
  reported_at: string;
  assignInfo?: BugAssign;
  bugFiles: RequirementFile[];
  bugLogs: BugLog[];
  status: string;
  reTestingBug: ReTesingInfo[];
};
export type BugLog = {
  id: number;
  name: string;
  content: string;
  date: string;
};
export type BugAssign = {
  assigned_to: number;
  assigned_name: string;
  time_start: string;
  deadline: string;
  resolution_note: string;
  resolved_at: string;
  assign_by: number;
  assign_by_name: string;
};
export type BugStatus = {
  code: string;
  description: string;
  allowed_transitions: string[];
};
export type BugSeverity = {
  code: string;
  display: string;
  hints: string;
};
export type BugComment = {
  id: number;
  comment: string;
  user_id: number;
  user_name: string;
  date: string;
};
export type ReTesingInfo = {
  code: string;
  assign_to: number;
  assignToName: string;
  assignBy: number;
  assignByName: string;
  create_at: string;
  deadline: string;
  time_end?: string;
  result?: boolean;
  note?: string;
};
