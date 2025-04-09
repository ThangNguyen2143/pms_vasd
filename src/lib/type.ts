export type FieldDto = {
  code: string;
  sub?: string;
  display: string;
};
export type ProductDto = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  status: string;
  createdAt: string;
};
export type UserDto = {
  userid: number;
  userData: {
    display_name: string;
    birthday: string;
    gender: string;
    contact: Contact[];
  };
  accountData: {
    username: string;
    isActive: boolean;
    code: string;
    account_type: string;
  };
};
export type Contact = {
  code: string;
  value: string;
};
