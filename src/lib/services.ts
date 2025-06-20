import { decode, encode } from "base-64";
import { verifySession } from "./dal";
import { DataResponse } from "./types";
import { getSession } from "./session";

const DOMAIN = process.env.DOMAIN || "https://pmapi.vasd.vn/api";
export function encodeBase64(obj: object): string {
  return encode(JSON.stringify(obj));
}
export function decodeBase64(str: string): object {
  return JSON.parse(decode(str));
}
export async function getItem<T>({
  endpoint,
  cache = "force-cache",
}: {
  endpoint: string;
  cache?: RequestCache;
}) {
  const session = await getSession();
  if (!session)
    return {
      code: 401,
      hint: "Not session",
      message: "Session hết hạn",
      value: "",
      status: "failed",
    } as DataResponse<T>;
  const result = await fetch(DOMAIN + endpoint, {
    cache,
    headers: {
      token: session.token,
    },
  });

  try {
    const response = (await result.json()) as DataResponse<T>;
    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      code: result.status,
      message: result.statusText,
      hint: "",
      value: "",
      status: "failed",
    };
  }
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
    try {
      return await result.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return {
        code: result.status,
        hint: "",
        message: result.statusText,
        status: "failed",
        value: "",
      };
    }
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
  try {
    if (!result.ok) {
      return {
        code: result.status,
        hint: "",
        message: result.statusText,
        status: "failed",
        value: "",
      };
    }
    return await result.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      code: result.status,
      hint: "",
      message: result.statusText,
      status: "failed",
      value: "",
    };
  }
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
