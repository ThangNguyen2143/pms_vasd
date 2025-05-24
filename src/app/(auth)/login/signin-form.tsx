"use client";
import ErrorMessage from "~/components/ui/error-message";
import { useApiError } from "~/hooks/use-api-error";
import { useState } from "react";
// import { signIn } from "~/app/(auth)/login/actions/auth";
import { toast } from "sonner";
import { DataResponse } from "~/lib/types";
import { postItem } from "~/lib/services";
// import { getMenu } from "~/lib/dal";
// import { cookies } from "next/headers";
import { createSession } from "~/lib/session";
import { setMenuRoute } from "~/app/(auth)/login/actions/auth";
import { useRouter } from "next/navigation";
type SignInRespone = {
  token: string;
  username: string;
  userid: number;
  code: string;
  display: string;
  expired: string;
  account_type: string;
};
export default function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const { errorData, isErrorDialogOpen, setIsErrorDialogOpen } = useApiError();
  // const [state, action, loading] = useActionState(signIn, undefined);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   if (state?.errors.server) toast.info(state?.errors.server?.message);
  // }, [state]);
  const handlerSubmit = async () => {
    setLoading(true);
    const dataSend = {
      data: {
        username,
        password,
      },
    };
    const postResponse: DataResponse<SignInRespone> = await postItem({
      endpoint: "/user/login",
      data: JSON.stringify(dataSend),
    });
    console.log(postResponse);
    if (postResponse.code == 401) toast.info(postResponse.message);
    if (postResponse.code != 200 && postResponse.code != 401)
      toast.error(postResponse.message);
    if (postResponse.value) {
      const data = postResponse?.value;
      // 4. Handle the response from the API
      await createSession({
        userId: data.userid,
        expires: data.expired,
        name: data.display,
        token: data.token,
        role: data.account_type,
      });
      await setMenuRoute();
      const callbackurl = callbackUrl || "/";
      router.push(callbackurl as string);
    }
    setLoading(false);
  };
  return (
    <form>
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          title="Vui lòng nhập tài khoản"
        />
        <p className="validator-hint">Vui lòng nhập tài khoản</p>

        <label className="fieldset-label text-cyan-500" htmlFor="password">
          Mật khẩu
        </label>
        <input
          type="password"
          className="input input-ghost validator"
          name="password"
          placeholder="Nhập mật khẩu"
          required
          title="Vui lòng nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="validator-hint">Vui lòng nhập mật khẩu</p>

        <button
          className="btn btn-neutral mt-4"
          // type="submit"
          disabled={loading}
          onClick={handlerSubmit}
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
