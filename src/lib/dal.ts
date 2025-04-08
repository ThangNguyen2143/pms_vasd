"user server";
import "server-only";
import { getSession } from "~/lib/session";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  // Get user ID from session and fetch data
});
