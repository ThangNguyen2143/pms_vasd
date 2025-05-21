import { Contact } from "./account";

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
