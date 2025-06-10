"use server";
import { redirect, RedirectType } from "next/navigation";
import { createData } from "~/lib/api-client";
import {
  CreateGroupSchema,
  CreateGroupState,
  CreateUserSchema,
  CreateUserState,
} from "~/lib/definitions";
import { Contact, CreateUserDto } from "~/lib/types";

export async function HandlerAddUser(
  state: CreateUserState,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = CreateUserSchema.safeParse({
    display_name: formData.get("display_name"),
    username: formData.get("username"),
    account_type: formData.get("account_type"),
    email: formData.get("email"),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const contact: Contact[] = [];
  if (validatedFields.data.email) {
    contact.push({
      code: "email",
      value: validatedFields.data.email,
    });
  }
  if (validatedFields.data.telegram) {
    contact.push({
      code: "telegram",
      value: validatedFields.data.telegram,
    });
  }
  const dataSend: CreateUserDto = {
    userData: {
      display_name: validatedFields.data.display_name,
      birthday: "2000-01-01",
      gender: "male",
      contact,
    },
    accountData: {
      username: validatedFields.data.username,
      account_type: validatedFields.data.account_type,
    },
  };
  // 3. Insert the user call an Auth Library's API
  const data = await createData<"", CreateUserDto>({
    endpoint: "/user/create",
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
  redirect("/user_manage", "push" as RedirectType);
}
export async function HandleAddGroup(
  state: CreateGroupState,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = CreateGroupSchema.safeParse({
    group_name: formData.get("group_name"),
    group_description: formData.get("group_description"),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const dataSend = {
    group_name: validatedFields.data.group_name,
    group_description: validatedFields.data.group_description,
  };
  // 3. Insert the user call an Auth Library's API
  const data = await createData<"", typeof dataSend>({
    endpoint: "/group",
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
  redirect("/user_manage/groups");
}
