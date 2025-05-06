import { z } from "zod";

export const SignInFormSchema = z.object({
  username: z.string().trim().min(1, "Tên tài khoản không được để trống"),
  password: z.string().trim().min(1, "Mật khẩu không được để trống"),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
        server?: {
          message?: string;
          hint?: string;
          code?: number;
        };
      };
      message?: string;
    }
  | undefined;

export const CreateUserSchema = z.object({
  display_name: z.string().trim().min(1, "Tên không được để trống"),
  username: z.string().trim().min(1, "Tên tài khoản không được để trống"),
  account_type: z.enum(["Support", "Admin", "Dev"]),
  email: z.string().trim().email("Email không hợp lệ"),
  telegram: z.string().trim().min(1, "Telegram không được để trống"),
});
export type CreateUserState =
  | {
      errors?: {
        display_name?: string[];
        username?: string[];
        account_type?: string[];
        email?: string[];
        telegram?: string[];
      };
      message?: {
        message?: string;
        hint?: string;
        code?: number;
      };
    }
  | undefined;
export const CreateGroupSchema = z.object({
  group_name: z.string().trim().min(1, "Tên nhóm không được để trống"),
  group_description: z.string().trim().min(1, "Mô tả không được để trống"),
});
export type CreateGroupState =
  | {
      errors?: {
        group_name?: string[];
        group_description?: string[];
      };
      message?: {
        message?: string;
        hint?: string;
        code?: number;
      };
    }
  | undefined;
export const UpdatedUserSchema = z.object({
  id: z.string(),
  display_name: z.string().trim().min(1, "Tên không được để trống"),
  birthday: z.string().trim().min(1, "Ngày sinh không được để trống"),
  gender: z.string().trim().min(1, "Giới tính không được để trống"),
  email: z.string().trim().min(1, "Email không được để trống"),
  telegram: z.string().trim().min(1, "Telegram không được để trống"),
});
export type UpdatedUserState =
  | {
      errors?: {
        id?: string[];
        display_name?: string[];
        birthday?: string[];
        gender?: string[];
        email?: string[];
        telegram?: string[];
      };
      message?: {
        message?: string;
        hint?: string;
        code?: number;
      };
    }
  | undefined;
export const UpdatedPasswordSchema = z.object({
  username: z.string(),
  current_password: z.string(),
  new_password: z.string(),
});
export type UpdatedPasswordState =
  | {
      errors?: {
        username?: string[];
        current_password?: string[];
        new_password?: string[];
      };
      message?: {
        message?: string;
        hint?: string;
        code?: number;
      };
    }
  | undefined;
export const CreateProductSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().trim().min(1, "Mô tả không được để trống"),
});
export type CreateProductState =
  | {
      errors?: {
        name?: string[];
        description?: string[];
      };
      message?: {
        message?: string;
        hint?: string;
        code?: number;
      };
    }
  | undefined;
