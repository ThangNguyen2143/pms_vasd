import { RequirementFile } from "./requirment";

export type TestcaseDto = {
  id: number;
  name: string;
  create_date: string;
  created_by: number;
  time_start?: string;
  time_end?: string;
  status: string;
};
export type TestcaseDetail = {
  id: number;
  product_id: string;
  name: string;
  description: string;
  task: {
    id: number;
    name: string;
  };
  tags: string[];
  environment: string;
  test_data: string;
  result_expect: string;
  test_depend: []; //Khum biết nốt
  create_date: string;
  created_by: number;
  time_start?: string;
  time_end?: string;
  testSteps: TestStep[];
  testCaseAssigns: TestAssign[];
  testFiles: RequirementFile[];
  testLogs: TestLog[];
  status: string;
};
export type TestStep = {
  code: string;
  step: number;
  name: string;
  description: string;
  expected_result: string;
  input_data: string;
  output_data: string;
  note?: string;
};
export type TestAssign = {
  code: string;
  assignInfo: AssigneeInfo;
  assigned_by: number;
  assigned_by_name: string;
  status: string;
  testRunInfo: TestRunInfo[];
};
type AssigneeInfo = {
  assign_to: number;
  assign_name: string;
  assigned_at: string;
  start_at?: string;
  end_at?: string;
  dead_line: string;
  is_notify: boolean;
  is_late: boolean;
  note: string;
};
export type TestRunInfo = {
  code: string;
  run_at: string;
  commit_at: string;
  result: boolean;
  tester_note: string;
  step_results: StepResult[];
};
type StepResult = {
  code: string;
  step_index: number;
  step_name: string;
  result: boolean;
  note: string;
};
export type TestLog = {
  id: number;
  name: string;
  date: string;
  content: string;
};
export type EnviromentTest = {
  code: string;
  display: string;
  description: string;
};
