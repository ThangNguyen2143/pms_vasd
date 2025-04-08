export type FieldDto = {
  code: string;
  sub?: string;
  display: string;
};
export type ProductDto = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  status: string;
  createdAt: string;
};
export type UserDto = {
  id: number;
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
