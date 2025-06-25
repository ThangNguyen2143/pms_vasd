import { NextResponse } from "next/server";
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
interface ChunkRequest {
  fileId: string;
  sessionId: string;
  chunkIndex: number;
  totalChunks: number;
  isLastChunk: boolean;
  data: string;
  uploadPath: string;
  fileType: string;
  fileName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;
}

type ChunkStoreType = Map<string, string[]>;

declare global {
  // eslint-disable-next-line no-var
  var chunkStore: ChunkStoreType | undefined;
}

const chunkStore: ChunkStoreType = globalThis.chunkStore ?? new Map();
globalThis.chunkStore = chunkStore;

export async function POST(req: Request) {
  const body = (await req.json()) as ChunkRequest;
  const {
    fileId,
    chunkIndex,
    isLastChunk,
    sessionId,
    data,
    uploadPath,
    fileType,
    fileName,
    meta,
  } = body;

  if (!chunkStore.has(fileId)) {
    chunkStore.set(fileId, []);
  }

  const currentChunks = chunkStore.get(fileId)!;
  currentChunks[chunkIndex] = data;

  if (isLastChunk) {
    const base64Full = currentChunks.join("");
    const payload = {
      data: {
        ...meta,
        files: {
          contentType: fileType,
          fileName,
          fileData: base64Full,
        } as {
          fileName: string;
          contentType: string;
          fileData: string;
        },
      },
      token: sessionId,
    };

    try {
      const res = await fetch(
        `${process.env.DOMAIN || "https://pmapi.vasd.vn/api"}${uploadPath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      // writeFrontendLog(res.status);
      const data = await res.json();
      chunkStore.delete(fileId);
      return NextResponse.json({ status: "uploaded", data });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return NextResponse.json(
        { error: "Upload to server failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ status: "chunk stored" });
}
