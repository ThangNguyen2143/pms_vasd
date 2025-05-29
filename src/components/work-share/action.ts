"use server";
import { createData } from "~/lib/api-client";
import { CreateWorkSchema } from "~/lib/definitions";

//Handler add new work
export async function HandlerAddWork(formData: FormData) {
  const validatedFields = CreateWorkSchema.safeParse({
    title: formData.get("title"),
    priority: formData.get("priority"),
    type: formData.get("type"),
    request_at: formData.get("request_at") as string,
    deadline: formData.get("deadline") as string,
    project_id: Number.parseInt(formData.get("project_id") as string),
    pic: formData.get("pic"),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const dataSend = {
    ...validatedFields.data,
  };
  // 3. Insert the user call an Auth Library's API
  const data = await createData<"", typeof dataSend>({
    endpoint: "/work",
    data: dataSend,
  });
  // 4. Handle the response from the API
  if (data.code !== 200) {
    return {
      ok: false,
      message: data.message,
      code: data.code,
      hint: data.hint,
    };
  }

  return {
    ok: true,
  };
}
