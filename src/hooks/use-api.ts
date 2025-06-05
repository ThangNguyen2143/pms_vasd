"use client";

import { useState } from "react";
import { useApiError } from "./use-api-error";
import {
  fetchData,
  createData,
  updateData,
  deleteData,
} from "~/lib/api-client";
import { DataResponse } from "~/lib/types";
import { logout } from "~/app/(auth)/login/actions/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApi<T, D = any>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleApiError, errorData, isErrorDialogOpen, setIsErrorDialogOpen } =
    useApiError();
  /**
   * Lấy dữ liệu từ API
   * @description This function fetches data from the API and handles errors.
   * @param endpoint : Đường dẫn API
   * @param cache : Cache mode for the request (default is "default")
   * @returns
   */
  const getData = async (endpoint: string, cache: RequestCache = "default") => {
    setIsLoading(true);
    try {
      const response = await fetchData<T>({ endpoint, cache });
      if (response.code == 401) await logout();
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
  /**
   * @description Hàm này dùng để gửi dữ liệu đến API
   * @description This function sends data to the API and handles errors.
   * @param endpoint : Đường dẫn API
   * @param data
   * @returns
   */
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
  /**
   * @description Hàm này dùng để cập nhật dữ liệu đến API
   * @description This function updates data to the API and handles errors.
   * @param endpoint : Đường dẫn API
   * @param data
   * @returns
   */
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
  /**
   * @description Hàm này dùng để xóa dữ liệu từ API
   * @description This function removes data from the API and handles errors.
   * @param endpoint : Đường dẫn API
   * @returns
   */
  const removeData = async (endpoint: string) => {
    setIsLoading(true);
    try {
      const response = await deleteData<T>({ endpoint });

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
  return {
    data,
    isLoading,
    setData,
    getData,
    postData,
    putData,
    removeData,
    errorData,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
  };
}
