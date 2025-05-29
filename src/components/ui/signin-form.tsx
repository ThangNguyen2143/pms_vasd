"use client";
import ErrorMessage from "./error-message";
import { useApiError } from "~/hooks/use-api-error";
import { useActionState, useEffect } from "react";
import { signIn } from "~/app/(auth)/login/actions/auth";
import { toast } from "sonner";

export default function SignInForm() {
  const { errorData, isErrorDialogOpen, setIsErrorDialogOpen } = useApiError();
  const [state, action, loading] = useActionState(signIn, undefined);
  useEffect(() => {
    if (state?.errors.server) toast.info(state?.errors.server?.message);
  }, [state]);
  return (
    <form action={action}>
      <fieldset className="fieldset w-xs border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend text-3xl text-amber-100">
          ĐĂNG NHẬP
        </legend>

        <label className="fieldset-label text-cyan-500" htmlFor="username">
          Tài khoản
        </label>
        <input
          type="text"
          className="input validator input-ghost"
          placeholder="Nhập tài khoản"
          name="username"
          required
        />
        {state?.errors?.username && (
          <p className="validator-hint">{state.errors.username}</p>
        )}
        <label className="fieldset-label text-cyan-500" htmlFor="password">
          Mật khẩu
        </label>
        <input
          type="password"
          className="input input-ghost"
          name="password"
          placeholder="Nhập mật khẩu"
        />
        {state?.errors?.password && (
          <div>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error} className="validator-hint">
                  - {error}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="btn btn-neutral mt-4"
          type="submit"
          disabled={loading}
        >
          Đăng nhập
        </button>
      </fieldset>
      <ErrorMessage
        errorData={errorData}
        isOpen={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
      />
    </form>
  );
}
