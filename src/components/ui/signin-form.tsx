"use client";
import ErrorMessage from "./error-message";
import { useApiError } from "~/hooks/use-api-error";
import { useActionState } from "react";
import { signIn } from "~/app/(auth)/login/actions/auth";

export default function SignInForm() {
  const { errorData, isErrorDialogOpen, setIsErrorDialogOpen } = useApiError();
  // const route = useRouter();
  const [state, action, loading] = useActionState(signIn, undefined);

  //   const validatedFields = SignInFormSchema.safeParse({
  //     username: formData.get("username"),
  //     password: formData.get("password"),
  //   });
  //   if (validatedFields.error)
  //     state = { errors: validatedFields.error.flatten().fieldErrors };
  //   else {
  //     const response: DataResponse<SignInRespone> = await postItem({
  //       endpoint: "/user/login",
  //       data: JSON.stringify({ data: validatedFields.data }),
  //     });
  //     if (response.code != 200) handleApiError(response);
  //     else {
  //       await createSession({
  //         userId: response.value.userid,
  //         expires: response.value.expired,
  //         name: response.value.display,
  //         token: response.value.token,
  //       });
  //       route.refresh();
  //     }
  //   }
  // };
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
