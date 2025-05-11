"use client";

import { useState } from "react";
import { ResponseError } from "~/lib/types";

export function useApiError() {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorData, setErrorData] = useState<ResponseError | null>(null);

  const handleApiError = (error: ResponseError) => {
    setErrorData(error);
    setIsErrorDialogOpen(true);
  };

  const closeErrorDialog = () => {
    setIsErrorDialogOpen(false);
  };

  return {
    errorData,
    isErrorDialogOpen,
    handleApiError,
    closeErrorDialog,
    setIsErrorDialogOpen,
  };
}
