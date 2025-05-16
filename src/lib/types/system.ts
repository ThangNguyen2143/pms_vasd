export type DataResponse<T> = {
  code: number;
  status: string;
  hint: string;
  message: string;
  value: T;
};
export interface ResponseError {
  code: number;
  status: string;
  hint: string;
  message: string;
  value: string;
}
export type FieldDto = {
  code: string;
  sub?: string;
  display: string;
};
export type Priority = {
  code: string;
  display: string;
  hints: string;
};
export type MenuNav = {
  code: string;
  value: string;
};
export type FileDto = {
  file_id: number;
  file_name: string;
  file_type: string;
};
