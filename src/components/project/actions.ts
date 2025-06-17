"use server";
import { redirect } from "next/navigation";
import { createData } from "~/lib/api-client";
import { CreateProjectSchema, CreateProjectState } from "~/lib/definitions";
export async function HandleAddProject(
  state: CreateProjectState,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = CreateProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    start_date: new Date(formData.get("start_date") as string),
    end_date: new Date(formData.get("end_date") as string),
    seft_code: formData.get("seft_code"),
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
    endpoint: "/project",
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
  redirect("/project");
}
