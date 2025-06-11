"use server";
import { redirect } from "next/navigation";
import { createData } from "~/lib/api-client";
import { CreateProductSchema, CreateProductState } from "~/lib/definitions";

export async function handleAddProduct(
  state: CreateProductState,
  formData: FormData
) {
  const validatedFields = CreateProductSchema.safeParse({
    project_id: Number.parseInt(formData.get("project_id") as string),
    name: formData.get("name"),
    description: formData.get("description"),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const dataSend = { ...validatedFields.data };
  // 3. Insert the user call an Auth Library's API
  const data = await createData<"", typeof dataSend>({
    endpoint: "/product",
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
