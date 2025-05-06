"use server";
import type { DataResponse } from "./type";

// Import your existing methods
import { getItem, postItem, putItem } from "./services"; // Replace with actual import path
import { verifySession } from "./dal";
import { redirect } from "next/navigation";

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
    const response = await getItem({ endpoint, cache });
    if (response.code === 401) {
      // Handle unauthorized access, e.g., redirect to login
      redirect("/login");
    }
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
    // Replace with your actual postItem method
    const response = await postItem({
      endpoint,
      data: JSON.stringify({ data, token: session.token }),
    });
    if (response.code === 401) {
      // Handle unauthorized access, e.g., redirect to login
      redirect("/login");
    }
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
    const response = await putItem({
      endpoint,
      data: JSON.stringify({ data, token: session.token }),
    });
    if (response.code === 401) {
      // Handle unauthorized access, e.g., redirect to login
      redirect("/login");
    }
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
