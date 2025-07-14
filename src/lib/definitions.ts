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
  telegram: z.string().trim(),
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
  project_id: z.number(),
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().trim().min(1, "Mô tả không được để trống"),
  productModules: z.array(
    z.object({
      code: z.string(),
      display: z.string(),
    })
  ),
});
export type CreateProductState =
  | {
      errors?: {
        project_id?: string[];
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
export const CreateProjectSchema = z.object({
  seft_code: z.string().min(1, "Yêu cầu nhập mã tự đặt"), // mã tự đặt
  name: z.string().min(1, "Yêu cầu nhập tên dự án"), // tên project
  description: z.string().min(2, "Nhập mô tả cho dự án"), // mô tả project
  start_date: z.date(), //thời gian bắt đầu
  end_date: z.union([z.date(), z.string().datetime(), z.null()]).optional(), // thời gian kết thúc dự kiến
});
export type CreateProjectState =
  | {
      errors?: {
        seft_code?: string[];
        name?: string[];
        description?: string[];
        start_date?: string[];
        end_date?: string[];
      };
      message?: {
        message?: string;
        hint?: string;
        code?: number;
      };
    }
  | undefined;
export const CreateWorkSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được để trống"),
  priority: z.string().trim().min(1, "Mức độ ưu tiên không được để trống"),
  project_id: z.number(),
  type: z.string().trim().min(1, "Loại công việc không được để trống"),
  request_at: z.string(),
  deadline: z.string(),
  pic: z.string().trim().min(1, "Người phụ trách không được để trống"),
});
export type CreateWorkState =
  | {
      errors?: {
        title?: string[];
        priority?: string[];
        project_id?: string[];
        type?: string[];
        request_at?: string[];
        pic?: string[];
        deadline?: string[];
      };
      message?: {
        message?: string;
        hint?: string;
        code?: number;
      };
    }
  | undefined;
