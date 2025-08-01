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
  title?: string;
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
  display: string;
};
export type FileDto = {
  fileName: string;
  contentType: string;
  fileData: string;
  uploadDate: string;
  upload_by: number;
};
export type ResopnseInfor = {
  action: string;
  list_contacts: {
    email: string[];
    telegram: string[];
  };
};
export type ProjectMember = {
  id: number;
  name: string;
};
export type OptionType = {
  value: string;
  label: string;
};
