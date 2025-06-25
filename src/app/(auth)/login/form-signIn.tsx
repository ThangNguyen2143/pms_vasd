"use client";
// import { toast } from "sonner";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInFormSchema } from "~/lib/definitions";
import { z } from "zod";
import { useUser } from "~/providers/user-context";
type SignInRespone = {
  token: string;
  username: string;
  userid: number;
  code: string;
  display: string;
  expired: string;
  account_type: string;
};
export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useUser();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const rawCallbackUrl = searchParams.get("callbackUrl") || "";
  const callbackUrl = decodeURIComponent(rawCallbackUrl);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    // Validate phía client
    try {
      SignInFormSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }
    }

    // Gọi API login
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng nhập thất bại");
      }
      // Set user for context
      const user: SignInRespone = await response.json();
      setUser({
        userId: user.userid,
        name: user.display,
        userName: user.username,
        role: user.account_type,
        expires: user.expired,
      });
      const isValidUrl = (url: string) => {
        try {
          new URL(url, window.location.origin);
          return url.startsWith("/");
        } catch {
          return false;
        }
      };
      const safeCallbackUrl = isValidUrl(callbackUrl) ? callbackUrl : "/";
      router.push(safeCallbackUrl);
      window.sessionStorage.removeItem("callbackUrl");
      // Đăng nhập thành công -> refresh để server component kiểm tra cookie
      // router.refresh();
      // router.push("/");
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {errors.form && <div className="text-red-500 text-sm">{errors.form}</div>}
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
          title="Vui lòng nhập tài khoản"
        />
        <p className="validator-hint">Vui lòng nhập tài khoản</p>
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
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
        />
        <p className="validator-hint">Vui lòng nhập mật khẩu</p>

        <button
          className="btn btn-neutral mt-4"
          // type="submit"
          disabled={isLoading}
        >
          Đăng nhập
        </button>
      </fieldset>
    </form>
  );
}
