// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import { DataResponse } from "~/lib/types";
import { createSession } from "~/lib/session";
type SignInRespone = {
  token: string;
  username: string;
  userid: number;
  code: string;
  display: string;
  expired: string;
  account_type: string;
};
export async function POST(request: Request) {
  try {
    const data: { username: string; password: string } = await request.json();

    // 1. Tìm user trong database
    const response: AxiosResponse<DataResponse<SignInRespone>> = await axios({
      method: "post",
      url: "https://pmapi.vasd.vn/api/user/login",
      data: JSON.stringify({ data }),
      headers: { "Content-Type": "application/json" },
      responseType: "json",
    });
    if (response.data.code != 200)
      return NextResponse.json(
        { message: response.data.message },
        { status: response.data.code }
      );
    const user = response.data.value;
    await createSession({
      ...user,
      userId: user.userid,
      expires: user.expired,
      name: user.display,
      role: user.account_type,
    });

    // 5. Trả về thông tin user (không bao gồm mật khẩu)
    return NextResponse.json(user);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 });
  }
}
