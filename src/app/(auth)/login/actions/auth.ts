"use server";
import { redirect } from "next/navigation";
import { SignInFormSchema, FormState } from "~/lib/definitions";
import { postItem } from "~/lib/services";
import { createSession, deleteSession } from "~/lib/session";

export async function signIn(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignInFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
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
  const postResponse = await postItem({
    endpoint: "/user/login",
    data: dataSend,
  });
  if (postResponse.code !== 200) {
    return {
      errors: {
        username: undefined,
        password: undefined,
        server: {
          message: postResponse.value.message,
          hint: postResponse.value.hint || "",
          code: postResponse.code,
        },
      },
    };
  }
  const data = postResponse?.value;
  // 4. Handle the response from the API
  await createSession({
    userId: data.userid,
    expires: data.expired,
    name: data.display,
    token: data.token,
  });
  // 5. Redirect user
  redirect("/");
}
export async function logout() {
  deleteSession();
  redirect("/login");
}
