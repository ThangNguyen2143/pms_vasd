/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { useUploadFile } from "~/hooks/use-upload-file";
import { encodeBase64 } from "~/lib/services";
import {
  BugSeverity,
  OptionType,
  Priority,
  TaskDTO,
  TestcaseDto,
} from "~/lib/types";
import Select from "react-select";

interface AddBugProps {
  product_id: string;

  onClose: () => void;
  onCreated: () => void;
}

interface DataCreate {
  product_id: string;
  title: string;
  description: string;
  priority: string;
  severity: string;
  log?: string;
  test_case_ref_id?: number;
  task_id?: number;
  tags: string[];
}

export default function AddBugModal({
  product_id,
  onClose,
  onCreated,
}: AddBugProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severitySelect, setSeveritySelected] = useState("");
  const [prioritySelected, setPrioritySelected] = useState("");
  const [logBug, setLogBug] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [testcaseSelected, setTestcaseSelected] = useState("");
  const [taskSelected, setTaskSelected] = useState("");
  const [files, setFile] = useState<File[]>([]);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    { name: string; status: "idle" | "uploading" | "done" | "error" }[]
  >([]);

  // const { isUploading, uploadError, uploadMultiFiles } = useUploadFile();

  const { uploadError, uploadChunkedFile } = useUploadFile();
  const { postData, isLoading, errorData } = useApi<
    { id: number },
    DataCreate
  >();
  const {
    data: severityList,
    getData: getSeverity,
    errorData: errorSeverity,
  } = useApi<BugSeverity[]>();
  const {
    data: priorityList,
    getData: getPriority,
    errorData: errorType,
  } = useApi<Priority[]>();
  const { data: testcaseList, getData: getTestCase } = useApi<TestcaseDto[]>();
  const { data: taskList, getData: getTask } = useApi<TaskDTO[]>();
  useEffect(() => {
    getPriority("/system/config/eyJ0eXBlIjoicHJpb3JpdHkifQ==");
    getSeverity("/system/config/eyJ0eXBlIjoiYnVnX3NldmVyaXR5In0=");
  }, []);
  useEffect(() => {
    getTestCase("/testcase/" + encodeBase64({ product_id }), "reload");
    getTask("/tasks/" + encodeBase64({ product_id }), "default");
  }, [product_id]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
    if (uploadError) toast.error(uploadError);
  }, [errorData, uploadError]);
  useEffect(() => {
    if (fileUploadStatus.some((file) => file.status == "done")) {
      onCreated();
      onClose();
    }
  }, [fileUploadStatus]);
  if (!severityList || !priorityList) {
    if (errorSeverity)
      toast.error(errorSeverity.message || errorSeverity.title);
    if (errorType) toast.error(errorType.message || errorType.title);
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      </div>
    );
  }
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!title || !description || !severitySelect || !prioritySelected) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const data: DataCreate = {
      product_id,
      title,
      description,
      priority: prioritySelected,
      tags,
      log: logBug,
      severity: severitySelect,
      test_case_ref_id: Number(testcaseSelected),
      task_id: Number(taskSelected),
    };
    if (!data.test_case_ref_id) delete data.test_case_ref_id;
    if (!data.task_id) delete data.task_id;
    if (data.log?.trim().length == 0) delete data.log;
    const re = await postData("/bugs", data);
    if (re == null) return;
    if (files.length > 0) {
      await Promise.all(
        files.map(async (file, index) => {
          // Cập nhật trạng thái đang upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = "uploading";
            return next;
          });

          const res = await uploadChunkedFile(file, "/bugs/file", {
            bug_id: re.id,
          });

          // Cập nhật trạng thái sau khi upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = res && res.code == 200 ? "done" : "error";
            return next;
          });
        })
      );
    }
    // const re = await uploadMultiFiles({
    //   files,
    //   uploadUrl: "/bugs",
    //   meta: {
    //     ...data,
    //   },
    // });
    toast.success("Bug đã được lưu");
  };

  const options: OptionType[] =
    taskList?.map((task) => ({
      value: task.id.toString(),
      label: task.title,
    })) ?? [];
  return (
    <div className="modal modal-open ">
      <div className="modal-box max-w-5xl w-full">
        <h3 className="font-bold text-lg pb-2">Báo bug mới</h3>
        <div className="grid grid-cols-2 gap-2 px-4">
          <label className="floating-label col-span-2">
            <span>Tiêu đề</span>
            <input
              type="text"
              className="input input-neutral w-full"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <fieldset className="fieldset col-span-2">
            <legend className="fieldset-legend">Mô tả</legend>
            <RichTextEditor
              placeholder="Mô tả"
              value={description}
              onChange={setDescription}
            />
          </fieldset>
          <fieldset className="fieldset col-span-2">
            <legend className="fieldset-legend">Log</legend>
            <textarea
              className="textarea w-full"
              rows={2}
              placeholder="Log gây bug"
              value={logBug}
              onChange={(e) => setLogBug(e.target.value)}
            />
          </fieldset>
          <label className="floating-label">
            <span>Mức độ ưu tiên</span>
            <select
              className="select select-neutral w-full"
              value={prioritySelected}
              onChange={(e) => setPrioritySelected(e.target.value)}
            >
              <option value="" disabled>
                Chọn mức độ
              </option>
              {priorityList.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.display}
                </option>
              ))}
            </select>
          </label>
          <label className="floating-label">
            <span>Mức độ nghiêm trọng</span>
            <select
              className="select select-neutral w-full"
              value={severitySelect}
              onChange={(e) => setSeveritySelected(e.target.value)}
            >
              <option value="" disabled>
                Chọn mức độ
              </option>
              {severityList.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.display}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Test case liên quan</legend>
            <select
              className="select select-neutral"
              value={testcaseSelected}
              onChange={(e) => setTestcaseSelected(e.target.value)}
            >
              <option value="">Chọn test case liên kết</option>
              {testcaseList?.map((testcase) => (
                <option key={testcase.id} value={testcase.id}>
                  {testcase.name}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Task liên quan</legend>
            <Select
              className="w-full"
              placeholder="Chọn task liên kết"
              value={options.find((opt) => opt.value === taskSelected) || null}
              onChange={(selected) => setTaskSelected(selected?.value ?? "")}
              options={options}
              isClearable
            />
          </fieldset>
          <div>
            <div className="join w-full">
              <input
                type="text"
                className="input join-item input-neutral w-full"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key == "Enter") handleAddTag();
                }}
                placeholder="Nhập thẻ và nhấn Thêm"
              />
              <button
                type="button"
                className="btn join-item btn-outline btn-neutral"
                onClick={handleAddTag}
              >
                Thêm
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, idx) => (
                <div key={idx} className="badge badge-info gap-2">
                  {tag}
                  <button
                    type="button"
                    className="text-xs ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Tệp đính kèm</legend>
              <input
                type="file"
                className="file-input file-input-primary mt-4"
                name="fileSend"
                multiple
                placeholder="Chọn tệp đính kèm"
                onChange={(e) => {
                  const selected = e.target.files;
                  if (selected) {
                    const newFiles = Array.from(selected);

                    // Thêm file mới vào danh sách cũ (tránh trùng tên)
                    setFile((prev) => {
                      const existingNames = new Set(prev.map((f) => f.name));
                      const uniqueNewFiles = newFiles.filter(
                        (f) => !existingNames.has(f.name)
                      );
                      return [...prev, ...uniqueNewFiles];
                    });

                    // Thêm trạng thái upload tương ứng
                    setFileUploadStatus((prev) => {
                      const existingNames = new Set(prev.map((f) => f.name));
                      const newStatus = newFiles
                        .filter((f) => !existingNames.has(f.name))
                        .map((f) => ({
                          name: f.name,
                          status: "idle" as const,
                        }));
                      return [...prev, ...newStatus];
                    });

                    // Reset input để cho phép chọn lại cùng file (bypass browser caching)
                    e.target.value = "";
                  }
                }}
              />
            </fieldset>
            {fileUploadStatus.length > 0 && (
              <ul className="mt-2 space-y-1">
                {fileUploadStatus.map((file, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <span>{file.name}</span>
                    {file.status === "uploading" && (
                      <span className="loading loading-spinner loading-xs text-info" />
                    )}
                    {file.status === "done" && (
                      <span className="text-success">✓ Đã tải lên</span>
                    )}
                    {file.status === "error" && (
                      <span className="text-error">✕ Lỗi</span>
                    )}
                    <button
                      onClick={() => {
                        setFile((prev) => prev.filter((_, i) => i !== idx));
                        setFileUploadStatus((prev) =>
                          prev.filter((_, i) => i !== idx)
                        );
                      }}
                      className="btn btn-xs btn-error"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
