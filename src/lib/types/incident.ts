export type Incident = {
  id: number;
  title: string;
  type: string;
  severtity: string;
  receiver: number;
  receiver_name: string;
  date_create: string;
};
export type IncidentDetail = {
  id: number;
  title: string;
  description: string;
  type: string;
  type_display: string;
  severity: string;
  severity_display: string;
  occurred_at: string;
  receiver: number;
  receiver_name: string;
  created_at: string;
  reporter: string;
  handle: string;
  time_end: string;
  status: string;
};
export type IncidentType = {
  code: string;
  display: string;
};
