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
      message?: string;
    }
  | undefined;
