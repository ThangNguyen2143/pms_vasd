import { FileDto } from "./system";

export type RequirementDto = {
  id: number;
  title: string;
  description: string;
  priority?: string;
  date_receive: string;
  date_create: string;
  date_end?: string;
  created_by: number;
  status: string;
  type: string;
};
export type RequirementDetail = Exclude<RequirementDto, "id"> & {
  product_id: string;
  tags: string[];
  requesters: RequestersInfo;
  requirementFiles: FileDto[];
  requirementLogs: RequirementLog[];
  status: string;
};
export type RequestersInfo = {
  location_id: number;
  requester: string;
  role: string;
  add_in: string;
};
export type RequirementLog = {
  id: number;
  name: string;
  content: string;
  date: string;
};
