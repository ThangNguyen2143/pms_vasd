import { decode, encode } from "base-64";
import { verifySession } from "./dal";

const DOMAIN = process.env.DOMAIN;
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
  try {
    const session = await verifySession();
    const result = await fetch(DOMAIN + endpoint, {
      cache,
      headers: {
        token: session?.token || "",
      },
    });
    const body = await result.json();
    if (body.code != 200) {
      return {
        code: body.code,
        value: {
          message: body.message,
          hint: body.hint,
        },
      };
    }
    return { code: 200, value: body.value };
  } catch (error) {
    return undefined;
  }
}
export async function postItem({
  endpoint,
  data,
}: {
  endpoint: string;
  data?: BodyInit;
}) {
  const result = await fetch(DOMAIN + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });

  const body = await result.json();
  if (body.code != 200) {
    return {
      code: body.code,
      value: {
        message: body.message,
        hint: body.hint,
      },
    };
  }
  return { code: 200, value: body.value };
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

  const body = await result.json();
  if (body.code != 200) {
    return {
      code: body.code,
      value: {
        message: body.message,
        hint: body.hint,
      },
    };
  }
  return { code: 200, value: body.value };
}
export async function deleteItem({
  endpoint,
  data,
}: {
  endpoint: string;
  data?: BodyInit;
}) {
  const result = await fetch(DOMAIN + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });

  const body = await result.json();
  if (body.code != 200) {
    return {
      code: body.code,
      value: {
        message: body.message,
        hint: body.hint,
      },
    };
  }
  return { code: 200, value: body.value };
}
