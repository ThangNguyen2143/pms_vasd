// pages/api/frontend-log.ts
import { writeFrontendLog } from "~/lib/serverLogger";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).ip || // fallback nếu chạy local dev
    "unknown";

  try {
    const { message } = await req.json();
    const logMsg = `[IP ${ip}] ${message}`;
    writeFrontendLog(logMsg);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
