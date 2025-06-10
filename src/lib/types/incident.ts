export type Incident = {
  id: number;
  title: string;
  description: string;
  type: string;
  severity: string;
  occurred_at: string;
  reporter: string;
  handle: string;
  time_end: string;
};
export type IncidentType = {
  code: string;
  display: string;
};
