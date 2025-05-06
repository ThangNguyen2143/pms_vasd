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
