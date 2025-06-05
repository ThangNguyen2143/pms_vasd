"use server";
import "server-only";
import { getSession } from "~/lib/session";
import { cache } from "react";
import { redirect } from "next/navigation";
import { encodeBase64 } from "./services";
import { MenuNav, UserDto } from "./types";
import { fetchData } from "./api-client";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId,
    token: session.token,
    expires: session.expires,
  };
});
export const getUser = cache(async () => {
  const session = await verifySession();
  // Get user ID from session and fetch data
  try {
    const endpoint =
      "/user/" + encodeBase64({ type: "info", id: session?.userId });
    const data = await fetchData<UserDto>({ endpoint, cache: "default" });
    const user: UserDto = data?.value;
    return {
      id: user.userid,
      name: user.userData.display_name,
      username: user.accountData.username,
      code: user.accountData.code,
      role: user.accountData.account_type,
      expires: session.expires,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("Failed to fetch user");
  }
});
export const getMenu = async () => {
  const res = await fetchData<MenuNav[]>({
    endpoint: "/system/config/" + encodeBase64({ type: "menu" }),
  });
  if (res.code == 200) {
    return res.value;
  }
  return null;
};
