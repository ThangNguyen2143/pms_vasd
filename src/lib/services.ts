import { decode, encode } from "base-64";
import { verifySession } from "./dal";
import { DataResponse } from "./types";

const DOMAIN = process.env.DOMAIN || "http://192.168.1.200:5149/api";
export function encodeBase64(obj: object): string {
  return encode(JSON.stringify(obj));
}
export function decodeBase64(str: string): object {
  return JSON.parse(decode(str));
}
export async function getItem({
  endpoint,
  cache = "force-cache",
}: {
  endpoint: string;
  cache?: RequestCache;
}) {
  const session = await verifySession();
  const result = await fetch(DOMAIN + endpoint, {
    cache,
    headers: {
      token: session.token,
    },
  });
  return await result.json();
}
export async function postItem({
  endpoint,
  data,
}: {
  endpoint: string;
  data?: BodyInit;
}) {
  try {
    const result = await fetch(DOMAIN + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: data,
    });

    return await result.json();
  } catch (error) {
    console.error(error);
    const res: DataResponse<""> = {
      code: 999,
      hint: "Không thể kết nối",
      message: "Error server",
      status: "failed",
      value: "",
    };
    return res;
  }
}
export async function putItem({
  endpoint,
  data,
}: {
  endpoint: string;
  data?: BodyInit;
}) {
  const result = await fetch(DOMAIN + endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
  return await result.json();
}
export async function deleteItem({ endpoint }: { endpoint: string }) {
  const session = await verifySession();
  const result = await fetch(DOMAIN + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: session?.token || "",
    },
  });

  return await result.json();
}
