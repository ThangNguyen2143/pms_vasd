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
export type ProductDto = {
  id: string;
  name: string;
  description: string;
  create_by: number;
  status: string;
  createdAt: string;
};
export type UserDto = {
  userid?: number;
  userData: {
    display_name: string;
    birthday: string;
    gender: string;
    contact: Contact[];
    department_id: string | null;
  };
  accountData: {
    username: string;
    isActive: boolean;
    code: string;
    account_type: string;
  };
};
export type GroupDto = {
  group_id?: string;
  group_name: string;
  group_description: string;
  status: string;
};
export type Contact = {
  code: string;
  value: string;
};
export type AccountType = {
  code: string;
  display: string;
};
export type CreateUserDto = {
  userData: {
    display_name: string;
    birthday: string;
    gender: string;
    contact: Contact[];
  };
  accountData: {
    username: string;
    account_type: string;
  };
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
export type WorkShareDto = {
  id: number;
  title: string;
  type: string;
  type_name: string;
  priority: string;
  create_at: string;
  request_at: string;
  deadline?: string;
  update_at?: string;
  pic: string;
  status: string;
};
export type WorkStatus = {
  code: string;
  display: string;
};
export type WorkType = {
  code: string;
  display: string;
};
export type Priority = {
  code: string;
  display: string;
  hints: string;
};
