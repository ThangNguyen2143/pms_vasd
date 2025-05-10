"use server";
import { redirect } from "next/navigation";
import { getMenu } from "~/lib/dal";
import { SignInFormSchema, FormState } from "~/lib/definitions";
import { postItem } from "~/lib/services";
import { createSession, deleteSession } from "~/lib/session";
import { DataResponse } from "~/lib/types";
type SignInRespone = {
  token: string;
  username: string;
  userid: number;
  code: string;
  display: string;
  expired: string;
  account_type: string;
};
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
  const postResponse: DataResponse<SignInRespone> = await postItem({
    endpoint: "/user/login",
    data: dataSend,
  });
  if (postResponse.code !== 200) {
    return {
      errors: {
        username: undefined,
        password: undefined,
        server: {
          message: postResponse.message,
          hint: postResponse.hint || "",
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
    role: data.account_type,
  });
  const nav = await getMenu();
  if (nav && data.account_type == "Guess") {
    // 4.1. If the user is a guest, redirect to the first menu item
    const guessRoutes: string[] = nav.map((item) => `/${item.code}`);
    // Check if the user is a guest and redirect accordingly
    redirect(guessRoutes[0] || "/");
  }
  // 5. Redirect user
  redirect("/");
}
export async function logout() {
  deleteSession();
  redirect("/login");
}
