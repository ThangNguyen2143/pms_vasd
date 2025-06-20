// lib/serverLogger.ts
import fs from "fs";
import path from "path";
function getLogFilePath() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const fileName = `${yyyy}-${mm}-${dd}.log`;

  const logDir = path.resolve(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir); // tạo thư mục nếu chưa có
  }

  return path.join(logDir, fileName);
}
export function writeFrontendLog(message: string) {
  const logLine = `[${new Date().toISOString()}] ${message}\n`;
  const logPath = getLogFilePath();
  fs.appendFile(logPath, logLine, (err) => {
    if (err) console.error("Ghi log thất bại:", err);
  });
}
