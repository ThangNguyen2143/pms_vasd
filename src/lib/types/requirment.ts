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
  requirementFiles: RequirementFile[];
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
export type RequirementStatus = {
  code: string;
  description: string;
  allow_transit?: string[];
};
export type RequirementType = {
  code: string;
  display: string;
  description: string;
};
export type RequirementCritreia = {
  code: string;
  title: string;
  description: string;
  weight: number;
  scale?: RatingRequired[];
  is_active?: boolean;
};
export type RatingRequired = {
  code: string;
  display: string;
  value: number;
};
export type RequirementFile = {
  file_id: number;
  file_name: string;
  file_type: string;
};
export type RequirementNote = {
  user_id: number;
  note: string;
  date: string;
};
