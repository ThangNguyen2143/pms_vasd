import { useEffect, useState } from "react";
import DocxViewer from "./docx-viewer";
import ExcelViewer from "./excel-viewer";
import { Download, Redo, Undo } from "lucide-react";
import {
  blobToBase64,
  compressFileGzip,
  downloadGzipBase64File,
} from "~/utils/file-to-base64";

type FilePreviewProps = {
  file: File;
};

export function FilePreview({ file }: FilePreviewProps) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const [textContent, setTextContent] = useState<string | null>(null);
  const textFileExts = [
    "txt",
    "html",
    "css",
    "js",
    "ts",
    "json",
    "xml",
    "java",
    "md",
    "config",
    "log",
  ];
  const [rotateImg, setRotate] = useState(0);
  useEffect(() => {
    const textExts = ["html", "css", "js"];
    if (ext && textExts.includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setTextContent(null);
    }
  }, [file, ext]);
  if (ext === "docx") return <DocxViewer file={file} />;
  if (ext === "xlsx" || ext === "xls") return <ExcelViewer file={file} />;
  if (ext === "pdf")
    return (
      <iframe src={URL.createObjectURL(file)} className="w-full h-[90vh]" />
    );
  if (ext?.startsWith("png") || ext?.startsWith("jpg"))
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-2 z-auto">
          <button className="btn btn-circle btn-sm">
            <Redo
              onClick={() => {
                setRotate((pre) => {
                  if (pre > 360) return 0;
                  else return pre + 90;
                });
              }}
            />
          </button>
          <button className="btn btn-circle btn-sm">
            <Undo
              strokeWidth={1.25}
              onClick={() => {
                setRotate((pre) => {
                  if (pre < -360) return 0;
                  else return pre - 90;
                });
              }}
            />
          </button>
        </div>
        <div className="relative w-full max-h-[80vh] overflow-auto flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="max-w-full max-h-[80vh] block"
            style={{
              transform: `rotate(${rotateImg}deg)`,
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      </div>
    );
  if (ext === "html" && textContent)
    return (
      <iframe
        srcDoc={textContent}
        className="w-full h-[90vh] border rounded"
        sandbox=""
      />
    );

  if (ext && textFileExts.includes(ext) && textContent)
    return (
      <pre className="p-4 bg-base-200 max-h-[90vh] overflow-auto rounded text-sm whitespace-pre-wrap">
        <code>{textContent}</code>
      </pre>
    );
  return (
    <div>
      <p>Không hỗ trợ định dạng file này.</p>
      <span
        className="btn btn-circle text-blue-500 tooltip"
        data-tip="Tải xuống"
        onClick={async () =>
          await downloadGzipBase64File({
            fileName: file.name,
            contentType: file.type,
            fileData: await blobToBase64(await compressFileGzip(file)),
          })
        }
      >
        <Download></Download>
      </span>
    </div>
  );
}
