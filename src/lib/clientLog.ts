// lib/log-client.ts
export async function logClient(message: string) {
  const domain = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    await fetch(`${domain}/api/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  } catch (err) {
    console.warn("Không gửi được log:", err);
  }
}
