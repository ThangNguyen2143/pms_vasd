"use client";
import { CircleChevronUp, Paperclip, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { FileDto, ProjectPhaseDetail } from "~/lib/types";
import UpdateStatusPhaseComponent from "./update-status-comp";
import AddAttachmentPhaseModal from "./add-attachment-phase";
import { openGzipBase64FileInNewTab } from "~/utils/file-to-base64";
import { toast } from "sonner";
import UpdatePhaseInfo from "./update-phase-info";

function DetailPhase({
  project_id,
  phase_id,
  onUpdate,
}: {
  project_id: number;
  phase_id: number;
  onUpdate: () => Promise<void>;
}) {
  // This component is a placeholder for the detail phase.
  // phase_id is the id of the phase that the user want to see detail
  const { getData: getFile } = useApi<FileDto>(); // ⚠️ chỉ dùng getData, không dùng state dùng chung
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({}); // trạng thái tải theo file_id
  const [showModalUpdatePhase, setshowModalUpdatePhase] = useState(false);
  const [showModalAddFile, setshowModalAddFile] = useState(false);
  // fetch data from API to get detail of phase by phase_id
  const {
    data: phaseData,
    errorData,
    isLoading,
    getData,
  } = useApi<ProjectPhaseDetail>();
  const { removeData: deletePhase } = useApi<string>();
  useEffect(() => {
    if (phase_id) {
      getData(`/project/phase/detail/${encodeBase64({ phase_id })}`, "default");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase_id]);
  const reloadData = async () => {
    onUpdate();
    if (phase_id) {
      await getData(
        `/project/phase/detail/${encodeBase64({ phase_id })}`,
        "reload"
      );
    }
  };
  const handleDownfile = async (file_id: number) => {
    setLoadingMap((prev) => ({ ...prev, [file_id]: true }));

    const res = await getFile(
      "/project/phase/file/detail/" + encodeBase64({ file_id })
    );
    if (res) {
      await openGzipBase64FileInNewTab(res);
    } else {
      toast.error("Tải file thất bại hoặc không tìm thấy file.");
    }

    setLoadingMap((prev) => ({ ...prev, [file_id]: false }));
  };
  const handleDeteleFile = async (file_id: number) => {
    console.log(file_id);
    toast.info("Tính năng đang phát triển...");
  };
  const handleDeletePhase = async () => {
    const re = await deletePhase(
      "/project/phase/" + encodeBase64({ project_id, phase_id })
    );
    if (re != "") return;
    toast.success("Xóa giai đoạn thành công");
    const chb = document.getElementById(`detail-phase-drawer-${phase_id}`);
    chb?.click();
    await onUpdate();
  };
  return (
    <div className="bg-base-200 text-base-content h-full max-w-1/2 w-md">
      <div className="p-5">
        {isLoading && (
          <div className="flex items-center gap-2">
            <span>Loading phase details</span>
            <span className="loading loading-dots loading-sm"></span>
          </div>
        )}
        {errorData && (
          <div className="alert alert-error">
            {`Error fetching phase details: ${errorData.message}`}
          </div>
        )}
        {phaseData && (
          <div>
            <h1 className="text-2xl font-bold mb-4">{phaseData.name}</h1>
            <p>{phaseData.description}</p>
            <p>
              <strong>Bắt đầu:</strong> {phaseData.start_date}
            </p>
            <p>
              <strong>Kết thúc:</strong> {phaseData.end_date}
            </p>
            {phaseData.actual_end && (
              <p>
                <strong>Kết thúc thực tế:</strong> {phaseData.actual_end}
              </p>
            )}
            <p>
              <strong>Ngày tạo:</strong> {phaseData.create_date}
            </p>
            <p>
              <span className="font-bold">Từ khóa:</span>{" "}
              {phaseData.tags.map((tag) => (
                <span key={tag + "tags"} className="badge badge-info mr-1">
                  {tag}
                </span>
              ))}
            </p>
            {/* Action as update status, add file attachment, update info*/}
            <div className="mt-4 mr-3 flex justify-end gap-2">
              <UpdateStatusPhaseComponent
                onUpdate={reloadData}
                phase_id={phase_id}
                status={phaseData.status}
              />
              <div className="join">
                <button
                  className="btn btn-secondary btn-sm tooltip join-item"
                  data-tip="Cập nhật thông tin"
                  onClick={() => setshowModalUpdatePhase(true)}
                >
                  <Pencil></Pencil>
                </button>
                <button
                  className="btn btn-outline btn-error btn-sm tooltip join-item"
                  data-tip="Xóa giai đoạn"
                  onClick={handleDeletePhase}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
            {/* File attachments */}
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-xl font-semibold">Tệp đính kèm</h2>
              <div className="tooltip mr-3" data-tip="Đính kèm">
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => setshowModalAddFile(true)}
                >
                  <Paperclip></Paperclip>
                </button>
              </div>
            </div>
            {phaseData.filePhases ? (
              <ul className="space-y-1">
                {phaseData.filePhases.map((f) => (
                  <li
                    key={f.file_id}
                    className="bg-base-100 p-2 rounded border-l-4 border-neutral flex gap-2 items-center justify-between"
                  >
                    <p>
                      📎 {f.file_name.replace(".gz", "")}{" "}
                      {loadingMap[f.file_id] ? (
                        <span className="loading loading-ball"></span>
                      ) : (
                        <span
                          className="link text-blue-400"
                          onClick={() => handleDownfile(f.file_id)}
                        >
                          Mở
                        </span>
                      )}
                    </p>
                    <div className="tooltip tooltip-left" data-tip="Xóa file">
                      <button
                        className="btn btn-ghost text-error"
                        onClick={() => handleDeteleFile(f.file_id)}
                      >
                        <X></X>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>Không có tài liệu đính kèm.</i>
              </p>
            )}
            {/* Phase logs */}
            <h2 className="text-xl font-semibold mt-6">Nhật ký giai đoạn</h2>
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical overflow-y-auto h-48 flex-col-reverse shadow">
              {phaseData.phaseLogs.map((log, i) => {
                if (i % 2 == 0)
                  return (
                    <li key={log.date}>
                      <div className="timeline-middle">
                        <CircleChevronUp />
                      </div>
                      <div className="timeline-end md:mb-10">
                        <time className="font-mono italic">{log.date}</time>
                        <div className="text-sm font-black">{log.name}</div>
                        {log.content}
                      </div>
                      <hr />
                    </li>
                  );
                return (
                  <li key={log.date}>
                    <div className="timeline-middle">
                      <CircleChevronUp />
                    </div>
                    <div className="timeline-start mb-10 md:text-end">
                      <time className="font-mono italic">{log.date}</time>
                      <div className="text-lg font-black">{log.name}</div>
                      {log.content}
                    </div>
                    <hr />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {showModalAddFile && (
        <AddAttachmentPhaseModal
          onClose={() => setshowModalAddFile(false)}
          onUpdate={reloadData}
          phase_id={phase_id}
        />
      )}
      {showModalUpdatePhase && phaseData && (
        <UpdatePhaseInfo
          onClose={() => setshowModalUpdatePhase(false)}
          onUpdate={reloadData}
          phaseInfor={{ phase_id, ...phaseData }} // truyền phase_id vào
        />
      )}
    </div>
  );
}

export default DetailPhase;
