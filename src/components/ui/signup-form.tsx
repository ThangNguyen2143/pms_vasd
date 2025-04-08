"use client";

import { signIn } from "~/app/(auth)/login/actions/auth";
import { useActionState } from "react";

export default function SignInForm() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action}>
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Đăng nhập</legend>

        <label className="fieldset-label" htmlFor="username">
          Tài khoản
        </label>
        <input
          type="text"
          className="input"
          placeholder="Nhập tài khoản"
          name="username"
        />
        {state?.errors?.username && <p>{state.errors.username}</p>}
        <label className="fieldset-label" htmlFor="password">
          Mật khẩu
        </label>
        <input
          type="password"
          className="input"
          name="password"
          placeholder="Nhập mật khẩu"
        />
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="btn btn-neutral mt-4"
          disabled={pending}
          type="submit"
        >
          Đăng nhập
        </button>
      </fieldset>
    </form>
  );
}
