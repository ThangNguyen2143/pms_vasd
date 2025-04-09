"use server";
import "server-only";
import { getSession } from "~/lib/session";
import { cache } from "react";
import { redirect } from "next/navigation";
import { encodeBase64, getItem } from "./services";
import { UserDto } from "./type";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId, token: session.token };
});
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  // Get user ID from session and fetch data
  try {
    const endpoint =
      "/user/" + encodeBase64({ type: "info", id: session?.userId });
    const data = await getItem({ endpoint });
    const user: UserDto = data?.value;
    return {
      id: user.userid,
      name: user.userData.display_name,
      username: user.accountData.username,
    };
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
