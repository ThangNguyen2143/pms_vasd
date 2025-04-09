function ErrorMessage({
  message,
  code,
  hint,
}: {
  message: string;
  code: number;
  hint?: string;
}) {
  return (
    <dialog id="errorMessage" className="modal" open={true}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Lỗi {code}</h3>
        <p className="py-4">{message}</p>
        <p className="py-4">{hint}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default ErrorMessage;
