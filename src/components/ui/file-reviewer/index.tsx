import { useEffect, useState } from "react";
import DocxViewer from "./docx-viewer";
import ExcelViewer from "./excel-viewer";
import { Download } from "lucide-react";
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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="max-w-full max-h-[80vh]"
      />
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
