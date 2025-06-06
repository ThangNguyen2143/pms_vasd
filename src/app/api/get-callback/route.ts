// app/api/get-callback/route.ts
import { NextResponse } from "next/server";

export function GET(request: Request) {
  console.log("Headers after setting:", Array.from(request.headers.entries()));
  const callbackUrl = request.headers.get("X-Callback-Url");
  return NextResponse.json({ callbackUrl });
}
