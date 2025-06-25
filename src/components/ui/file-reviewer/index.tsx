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

  if (ext === "docx") return <DocxViewer file={file} />;
  if (ext === "xlsx" || ext === "xls") return <ExcelViewer file={file} />;
  if (ext === "pdf")
    return (
      <iframe src={URL.createObjectURL(file)} className="w-full h-[80vh]" />
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
