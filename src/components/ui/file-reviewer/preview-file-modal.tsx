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
      <div className="modal-backdrop ">
        <button onClick={onClose}>close</button>
      </div>
      <div className="modal-box max-w-full w-fit items-center flex justify-center">
        <FilePreview file={file}></FilePreview>
      </div>
    </div>
  );
}

export default PreviewFileModal;
