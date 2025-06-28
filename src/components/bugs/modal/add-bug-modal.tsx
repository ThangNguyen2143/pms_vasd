/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { useUploadFile } from "~/hooks/use-upload-file";
import { encodeBase64 } from "~/lib/services";
import { BugSeverity, Priority, TaskDTO, TestcaseDto } from "~/lib/types";

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
  const { isUploading, uploadError, uploadMultiFiles } = useUploadFile();

  // const { postData, isLoading, errorData } = useApi<"", DataCreate>();
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
    getPriority("/system/config/eyJ0eXBlIjoicHJpb3JpdHkifQ==", "force-cache");
    getSeverity(
      "/system/config/eyJ0eXBlIjoiYnVnX3NldmVyaXR5In0=",
      "force-cache"
    );
  }, []);
  useEffect(() => {
    getTestCase("/testcase/" + encodeBase64({ product_id }), "reload");
    getTask("/tasks/" + encodeBase64({ product_id }), "default");
  }, [product_id]);
  useEffect(() => {
    // if (errorData) toast.error(errorData.message || errorData.title);
    if (uploadError) toast.error(uploadError);
  }, [uploadError]);
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
    // const re = await postData("/bugs", data);
    const re = await uploadMultiFiles({
      files,
      uploadUrl: "/bugs",
      meta: {
        ...data,
      },
    });
    if (re?.value != "") return;
    else {
      toast.success("Báo bug thành công");
      onCreated();
      onClose();
    }
  };

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
            <select
              className="select select-neutral"
              value={taskSelected}
              onChange={(e) => setTaskSelected(e.target.value)}
            >
              <option value="">Chọn Task liên kết</option>
              {taskList?.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
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
            <div className="flex flex-wrap gap-2">
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
                    setFile(Array.from(selected));
                  }
                }}
              />
            </fieldset>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
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
