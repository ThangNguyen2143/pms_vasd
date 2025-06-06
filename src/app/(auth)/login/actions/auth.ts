"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMenu } from "~/lib/dal";
// import { SignInFormSchema, FormState } from "~/lib/definitions";
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

export async function signIn(
  state: { status: string; error?: { message: string } },
  formData: FormData
) {
  // Validate form fields

  // If any form fields are invalid, return early
  // if (!validatedFields.success) {
  //   return {
  //     errors: {
  //       ...validatedFields.error.flatten().fieldErrors,
  //       server: undefined,
  //     },
  //   };
  // }
  const dataSend = JSON.stringify({ data: formData });
  // 3. Insert the user call an Auth Library's API
  const postResponse: DataResponse<SignInRespone> = await postItem({
    endpoint: "/user/login",
    data: dataSend,
  });
  if (!postResponse || postResponse.code !== 200) {
    return {
      status: "Failed",
      errors: {
        message: postResponse.message,
      },
    } as typeof state;
  }
  const data = postResponse.value;
  // 4. Handle the response from the API
  await createSession({
    userId: data.userid,
    expires: data.expired,
    name: data.display,
    token: data.token,
    role: data.account_type,
  });
  await setMenuRoute();
  // 5. Redirect user
  return { status: "Success" } as typeof state;
}
export async function setMenuRoute() {
  const nav = await getMenu();
  const menuRoutes = nav?.map((item) => `/${item.code}`);
  const cookie = await cookies();
  cookie.set("menuRoutes", JSON.stringify(menuRoutes), {
    path: "/",
    httpOnly: false,
  });
}
export async function logout(path?: string) {
  deleteSession();
  redirect(`/login?callbackUrl=${path}`);
}
