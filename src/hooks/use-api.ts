"use client";

import { useState } from "react";
import { useApiError } from "./use-api-error";
import { fetchData, createData, updateData } from "~/lib/api-client";
import { DataResponse } from "~/lib/type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApi<T, D = any>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleApiError, errorData, isErrorDialogOpen, setIsErrorDialogOpen } =
    useApiError();

  const getData = async (
    endpoint: string,
    cache: RequestCache = "force-cache"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetchData<T>({ endpoint, cache });

      // Check if the response contains an error code
      if (response.code != 200) {
        handleApiError({
          code: response.code,
          status: response.status,
          hint: response.hint || "Error occurred",
          message: response.message,
          value: typeof response.value === "string" ? response.value : "",
        });
        setData(null);
        return null;
      }

      // Success case
      setData(response.value);
      return response.value;
    } catch (error) {
      console.error("API call failed:", error);
      handleApiError({
        code: 500,
        status: "Error",
        hint: "Unexpected error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        value: "",
      });
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const postData = async (endpoint: string, data: D) => {
    setIsLoading(true);
    try {
      const response = await createData<T, D>({ endpoint, data });

      // Check if the response contains an error code
      if (response.code != 200) {
        handleApiError(response as DataResponse<"">);
        setData(null);
        return null;
      }

      // Success case
      setData(response.value);
      return response.value;
    } catch (error) {
      console.error("API call failed:", error);
      handleApiError({
        code: 500,
        status: "Error",
        hint: "Unexpected error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        value: "",
      });
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Add similar methods for putData and deleteData
  const putData = async (endpoint: string, data: D) => {
    setIsLoading(true);
    try {
      const response = await updateData<T, D>({ endpoint, data });

      // Check if the response contains an error code
      if (response.code != 200) {
        handleApiError(response as DataResponse<"">);
        setData(null);
        return null;
      }

      // Success case
      setData(response.value);
      return response.value;
    } catch (error) {
      console.error("API call failed:", error);
      handleApiError({
        code: 500,
        status: "Error",
        hint: "Unexpected error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        value: "",
      });
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    getData,
    postData,
    putData,
    // deleteData,
    errorData,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
  };
}
