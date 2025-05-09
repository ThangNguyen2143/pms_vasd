"use client";
import { ResponseError } from "~/lib/type";

interface ErrorDialogProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  errorData: ResponseError | null;
}
function ErrorMessage({ isOpen, onOpenChange, errorData }: ErrorDialogProps) {
  if (!errorData) return null;
  return (
    <dialog id="errorMessage" className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Lỗi {errorData.code}</h3>
        <p className="py-4">{errorData.message}</p>
        <p className="py-4">{errorData.hint}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => onOpenChange}>Đóng</button>
      </form>
    </dialog>
  );
}

export default ErrorMessage;
