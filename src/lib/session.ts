"use server";
import "server-only";
import { cookies } from "next/headers";
export type Session = {
  userId: number;
  name: string;
  expires: string;
  token: string;
  role: string;
};
export async function createSession({
  userId,
  expires,
  token,
  name,
  role,
}: Session) {
  const session = JSON.stringify({ userId, expires, token, name, role });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: new Date(expires),
    sameSite: "lax",
    path: "/",
  });
}
export async function getSession(): Promise<Session | undefined> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return undefined;
  return JSON.parse(session);
}
export async function updateSession(expires: string) {
  const session = (await cookies()).get("session")?.value;

  if (!session || !JSON.parse(session)) {
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: new Date(expires),
    sameSite: "lax",
    path: "/",
  });
}
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
