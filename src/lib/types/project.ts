import { Contact } from "./account";
import { RequirementFile } from "./requirment";

export type ProjectStatus = {
  code: string;
  display: string;
};
export type ProjectDto = {
  id: number;
  seft_code: string;
  name: string;
  description: string;
  create_date: string;
  start_date: string;
  end_date: string;
  status: string;
};
export type ProjectDetailDto = Exclude<ProjectDto, "id"> & {
  create_by: number;
  create_at: string;
  actual_end_date: string;
  project_members: ProjectMemberDto[];
  project_log: ProjectLogDto[];
  project_stakeholders: ProjectStakeholderDto[];
  project_group_contacts: ProjectGroupContactDto[];
};
export type ProjectMemberDto = {
  id: number;
  name: string;
  role: ProjectRole[];
  date_join: string;
  added_by: number;
  contacts: Contact[];
};
export type ProjectLogDto = {
  id: number;
  name: string;
  description: string;
  date: string;
};
export type ProjectGroupContactDto = {
  type: string;
  display: string;
  value: string;
};
export type ProjectStakeholderDto = {
  code: string;
  name: string;
  description: string;
  contacts: Contact[];
  created: string;
};
export type ProjectRole = {
  code?: string;
  role_code: string;
  display?: string;
  description?: string;
};
export type ProjectLocation = {
  id: number;
  name: string;
  create_by: number;
  create_at: string;
  project_id?: number;
};
export type ProjectPhase = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  project_id: number;
  create_by: number;
  create_at: string;
  status: string;
};
export type ProjectPhaseDetail = Omit<ProjectPhase, "id"> & {
  id: number;
  project_id: number;
  create_by: number;
  create_date: string;
  actual_end: string;
  tags: string[];
  phaseLogs: ProjectPhaseLog[];
  filePhases?: RequirementFile[];
};
export type ProjectPhaseStatus = {
  code: string;
  display: string;
  description: string;
};
export type ProjectPhaseLog = {
  id: number;
  name: string;
  content: string;
  date: string;
};
export type ProjectTimeLine = {
  id: number;
  project_id: number;
  phase_id: number;
  parent_id?: number;
  weight: number;
  name: string;
  date_start: string;
  date_end: string;
  status: string;
};
export type ProjectTimeLineDetail = Omit<
  ProjectTimeLine,
  "name" | "weight" | "date_start" | "date_end"
> & {
  info: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    actual_end?: string;
    create_date: string;
    weight: number;
    assign_to?: number;
    assignto_name?: string;
    tags: string[];
  };
};
