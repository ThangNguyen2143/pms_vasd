"use server";
import { redirect } from "next/navigation";
import { updateData } from "~/lib/api-client";
import {
  UpdatedUserSchema,
  UpdatedUserState,
  UpdatedPasswordSchema,
  UpdatedPasswordState,
} from "~/lib/definitions";
import { Contact } from "~/lib/types";

export async function HandlerUpdateUser(
  state: UpdatedUserState,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = UpdatedUserSchema.safeParse({
    id: formData.get("id"),
    display_name: formData.get("display_name"),
    birthday: formData.get("birthday"),
    gender: formData.get("gender"),
    email: formData.get("email"),
    telegram: formData.get("telegram"),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  type UserUpdate = {
    id: number;
    userData: {
      display_name: string;
      birthday: string;
      gender: string;
      contact: Contact[];
    };
  };
  const dataSend: UserUpdate = {
    id: Number.parseInt(validatedFields.data.id),
    userData: {
      display_name: validatedFields.data.display_name,
      birthday: validatedFields.data.birthday,
      gender: validatedFields.data.gender,
      contact: [
        {
          code: "email",
          value: validatedFields.data.email,
        },
        {
          code: "telegram",
          value: validatedFields.data.telegram,
        },
      ],
    },
  };
  // 3. Insert the user call an Auth Library's API
  const data = await updateData<"", UserUpdate>({
    endpoint: "/user/info",
    data: dataSend,
  });
  // 4. Handle the response from the API
  if (data.code !== 200) {
    return {
      message: {
        message: data.message,
        hint: "Gợi ý: " + data.hint,
        code: data.code,
      },
    };
  }
  redirect("/");
}
export async function HandlerChangePwUser(
  state: UpdatedPasswordState,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = UpdatedPasswordSchema.safeParse({
    username: formData.get("username"),
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  type UserUpdate = {
    username: string;
    current_password: string;
    new_password: string;
  };
  const dataSend: UserUpdate = {
    username: validatedFields.data.username,
    new_password: validatedFields.data.new_password,
    current_password: validatedFields.data.current_password,
  };
  // 3. Insert the user call an Auth Library's API
  const data = await updateData<"", UserUpdate>({
    endpoint: "/user/pass/change",
    data: dataSend,
  });
  // 4. Handle the response from the API
  if (data.code !== 200) {
    return {
      message: {
        message: data.message,
        hint: "Gợi ý: " + data.hint,
        code: data.code,
      },
    };
  }
  redirect("/");
}
