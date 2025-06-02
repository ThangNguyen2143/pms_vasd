export interface summaryRequirement {
  total: number;
  new_request: number;
  clarify: number;
  accepted: number;
  in_progress: number;
  processed: number;
  closed: number;
  rejected: number;
  canceled: number;
  failed: number;
  unable_to_process: number;
}
export interface summaryTask {
  total: number;
  in_progress: number;
  done: number;
  overdue: number;
  create: number;
  wait_update: number;
}
export interface summaryTimeline {
  total: number;
  in_progress: number;
  done: number;
  not_started: number;
}
export interface summaryBug {
  total: number;
  open: number;
  resolved: number;
  rejected: number;
  bugNew: number;
}
export interface summaryTesecase {
  total: number;
  assigned: number;
  done: number;
}
export interface progressPercent {
  phase_id: number;
  phase_name: string;
  start_date: string;
  end_date: string;
  progress_percent: number;
}
export interface OverviewDTO {
  project_name: string;
  start_date: string;
  end_date: string;
  current_phase: string;
  total_phases: number;
  completed_phases: number;
  userRequirementSummary: summaryRequirement;
  task_summary: summaryTask;
  bug_summary: summaryBug;
  testcase_summary: summaryTesecase;
  timeline_summary: summaryTimeline;
  progress_percent: progressPercent[];
}
export interface WorkOverviewDTO {
  user_id: number;
  user_name: string;
  tasks: [];
  bugs: [];
  bug_retests: [];
  testcases: [];
}
export interface GanttDTO {
  id: number;
  phase_id: number;
  name: string;
  start: string;
  end: string;
  status: string;
  parent?: number;
  type: string;
  weight: number;
}
