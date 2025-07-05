"use client";
import { FilePreview } from ".";

function PreviewFileModal({
  file,
  onClose,
}: {
  file: File;
  onClose: () => void;
}) {
  return (
    <div className="modal modal-open">
      {/* <div className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </div> */}
      <div className="modal-box max-w-full w-fit items-center flex justify-center min-w-5xl h-full overflow-y-auto">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <div className="max-h-[90vh] overflow-y-auto w-full">
          <FilePreview file={file} />
        </div>
        {/* <FilePreview file={file}></FilePreview> */}
      </div>
    </div>
  );
}

export default PreviewFileModal;
