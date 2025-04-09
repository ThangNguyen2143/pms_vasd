"use server";
import { redirect } from "next/navigation";
import { CreateUserSchema, CreateUserState } from "~/lib/definitions";
import { postItem } from "~/lib/services";

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
    telegram: formData.get("telegram"),
  });
  // If any form fields are invalid, return early
  console.log(
    "validatedFields: ",
    validatedFields.error?.flatten().fieldErrors
  );
  if (!validatedFields.success) {
    return {
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        server: undefined,
      },
    };
  }
  const dataSend = JSON.stringify({ data: validatedFields.data });
  // 3. Insert the user call an Auth Library's API
  const data = await postItem({ endpoint: "/user/create", data: dataSend });
  // 4. Handle the response from the API
  if (data.code !== 200) {
    return {
      errors: {
        display_name: undefined,
        username: undefined,
        account_type: undefined,
        email: undefined,
        telegram: undefined,
        server: {
          message: data.value.message,
          hint: data.value.hint || "",
          code: data.value.code || "",
        },
      },
    };
  }
  redirect("/employees");
}
