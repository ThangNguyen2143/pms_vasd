"use server";
import "server-only";
import type { DataResponse } from "./types";
import { deleteItem, getItem, postItem, putItem } from "./services"; // Replace with actual import path
import { verifySession } from "./dal";
// import { logClient } from "./clientLog";
// const DOMAIN = process.env.DOMAIN || "https://pmapi.vasd.vn/api";

// Add similar imports for your POST, PUT, DELETE methods
// import { postItem, putItem, deleteItem } from "your-library-path"

export async function fetchData<T>({
  endpoint,
  cache = "force-cache",
}: {
  endpoint: string;
  cache?: RequestCache;
}): Promise<DataResponse<T>> {
  try {
    // Use your existing getItem method
    const response = await getItem<T>({ endpoint, cache });
    return response as DataResponse<T>;
  } catch (error) {
    // Handle unexpected errors
    console.error("API call failed:", error);
    return {
      code: 500,
      status: "Error",
      hint: "Unexpected error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      value: null as unknown as T,
    };
  }
}

// Similar wrappers for your other methods
export async function createData<T, D>({
  endpoint,
  data,
}: {
  endpoint: string;
  data: D;
}): Promise<DataResponse<T>> {
  try {
    const session = await verifySession(); // Replace with your actual session verification method
    if (!session) {
      throw new Error("Session verification failed");
    }
    // await logClient(`[REQUEST] POST ${DOMAIN + endpoint} - Payload: ${data}`);
    // Replace with your actual postItem method
    const response = await postItem({
      endpoint,
      data: JSON.stringify({ data, token: session.token }),
    });
    // await logClient(
    //   `[RESPONSE] POST ${DOMAIN + endpoint} - Data: ${
    //     response.message || response.title
    //   }`
    // );
    return response as DataResponse<T>;
  } catch (error) {
    console.error("API call failed:", error);
    return {
      code: 500,
      status: "Error",
      hint: "Unexpected error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      value: null as unknown as T,
    };
  }
}

// Add similar wrappers for updateData and deleteData
export async function updateData<T, D>({
  endpoint,
  data,
}: {
  endpoint: string;
  data: D;
}): Promise<DataResponse<T>> {
  try {
    const session = await verifySession(); // Replace with your actual session verification method
    if (!session) {
      throw new Error("Session verification failed");
    }
    // await logClient(`[REQUEST] PUT ${DOMAIN + endpoint} - Payload: ${data}`);
    const response = await putItem({
      endpoint,
      data: JSON.stringify({ data, token: session.token }),
    });
    // await logClient(
    //   `[RESPONSE] PUT ${DOMAIN + endpoint} - Data: ${
    //     response.message || response.title
    //   }`
    // );
    return response as DataResponse<T>;
  } catch (error) {
    console.error("API call failed:", error);
    return {
      code: 500,
      status: "Error",
      hint: "Unexpected error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      value: null as unknown as T,
    };
  }
}
export async function deleteData<T>({
  endpoint,
}: {
  endpoint: string;
}): Promise<DataResponse<T>> {
  try {
    const session = await verifySession(); // Replace with your actual session verification method
    if (!session) {
      throw new Error("Session verification failed");
    }
    // await logClient(`[REQUEST] DEL ${DOMAIN + endpoint}`);
    const response = await deleteItem({
      endpoint,
    });
    // await logClient(
    //   `[RESPONSE] DEL ${DOMAIN + endpoint} - Data: ${
    //     response.message || response.title
    //   }`
    // );
    return response as DataResponse<T>;
  } catch (error) {
    console.error("API call failed:", error);
    return {
      code: 500,
      status: "Error",
      hint: "Unexpected error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      value: null as unknown as T,
    };
  }
}
