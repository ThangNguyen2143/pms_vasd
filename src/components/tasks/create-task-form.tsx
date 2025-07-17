/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import RichTextEditor from "../ui/rich-text-editor";
import DateTimePicker from "../ui/date-time-picker";
import { ProductModule } from "~/lib/types";
import { useUploadFile } from "~/hooks/use-upload-file";
import Select from "react-select";
import Cookies from "js-cookie";
import { toISOString } from "~/utils/fomat-date";
interface Criteria {
  id: string;
  title: string;
  type: string;
}
interface DataPost {
  product_id: string;
  title: string;
  description: string;
  dead_line: string;
  module?: string;
  requirement_id?: number;
  acceptances?: { title: string; type: string }[];
}
function CreateTaskForm({
  product_id,
  modules,
  onSuccess,
  onAddModule,
}: {
  product_id: string;
  modules: ProductModule[];
  onAddModule: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([
    {
      id: Date.now().toString(),
      title: "",
      type: "",
    },
  ]);
  const isDark = Cookies.get("theme") == "night";
  const [selectedRequirement, setSelectedRequirement] = useState<number>(0);
  const [selectModule, setSelectModule] = useState<string>("");
  const [files, setFile] = useState<File[]>([]);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    { name: string; status: "idle" | "uploading" | "done" | "error" }[]
  >([]);
  const { uploadError, uploadChunkedFile } = useUploadFile();

  const { data: requireds, getData: getRequiredList } =
    useApi<{ id: number; title: string }[]>();
  const {
    postData,
    isLoading,
    errorData: postError,
  } = useApi<{ id: number }>();
  const { data: criteriaType, getData: getCriterial } =
    useApi<{ code: string; display: string }[]>();
  useEffect(() => {
    getCriterial("/system/config/eyJ0eXBlIjoiY3JpdGVyaWFfdHlwZSJ9");
  }, []);
  useEffect(() => {
    getRequiredList("/requirements/list/" + encodeBase64({ product_id }));
  }, [product_id]);
  useEffect(() => {
    if (postError) toast.error(postError.message);
    if (uploadError) {
      toast.error(uploadError);
    }
  }, [uploadError, postError]);
  useEffect(() => {
    if (fileUploadStatus.some((file) => file.status == "done")) {
      onSuccess();
      handleReset();
      // onClose();
    }
  }, [fileUploadStatus]);
  const handleSubmit = async () => {
    if (title.trim() === "") {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }
    if (description.trim() === "") {
      toast.error("Vui lòng nhập mô tả công việc");
      return;
    }
    if (criteriaList.some((crit) => crit.title.trim() === "")) {
      toast.error("Vui lòng nhập tiêu chí chấp thuận");
      return;
    }
    const data: DataPost = {
      product_id,
      title,
      description,
      module: selectModule,
      dead_line: toISOString(deadline),
      requirement_id: selectedRequirement,
      acceptances: criteriaList.map((crit) => ({
        title: crit.title,
        type: crit.type,
      })),
    };
    if (data.requirement_id == 0) delete data.requirement_id;
    if (data.module == "") delete data.module;
    if (data.acceptances?.length == 0) delete data.acceptances;
    // const result = await uploadMultiFiles({
    //   files,
    //   uploadUrl: "/tasks",
    //   meta: {
    //     ...data,
    //   },
    // });
    // const result = null;
    const result = await postData("/tasks", data);
    if (result == null) return;
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
            bug_id: result.id,
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
    // if (result != null) {
    //   toast.success("Tạo công việc thành công");
    //   onSuccess(); // gọi lại TaskList để reload
    //   setTitle("");
    //   setDescription("");
    //   setDeadline("");
    // }
    else {
      onSuccess();
      handleReset();
    }
    toast.success("Tạo công việc thành công");
  };
  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setCriteriaList([
      {
        id: Date.now().toString(),
        title: "",
        type: "",
      },
    ]);
    setSelectModule("");
    setSelectedRequirement(0);
    setFile([]);
  };
  const addCriteria = () => {
    setCriteriaList([
      ...criteriaList,
      {
        id: Date.now().toString(),
        title: "",
        type: "",
      },
    ]);
  };

  const removeCriteria = (id: string) => {
    setCriteriaList(criteriaList.filter((criteria) => criteria.id !== id));
  };

  const updateCriteria = (id: string, field: keyof Criteria, value: string) => {
    setCriteriaList(
      criteriaList.map((criteria) =>
        criteria.id === id ? { ...criteria, [field]: value } : criteria
      )
    );
  };
  const options =
    modules?.map((module) => ({
      value: module.id,
      label: module.display,
    })) ?? [];
  const optionReq =
    requireds
      ?.sort((a, b) => a.id - b.id)
      .map((req) => ({
        value: req.id,
        label: req.title,
      })) ?? [];
  return (
    <div className="overflow-auto">
      <div className="h-[550px] grid grid-cols-1 md:grid-cols-2 gap-2 p-4  overflow-y-auto border rounded-lg shadow border-current">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tiêu đề</legend>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Tiêu đề công việc"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Deadline</legend>
          <DateTimePicker
            value={deadline}
            onChange={setDeadline}
            className="input-neutral w-full"
          />
        </fieldset>
        <fieldset className="fieldset md:col-span-2 ">
          <legend className="fieldset-legend">Mô tả</legend>
          <RichTextEditor
            placeholder="Mô tả công việc"
            value={description}
            onChange={setDescription}
          />
        </fieldset>

        <fieldset className="fieldset row-span-2">
          <legend className="fieldset-legend">
            <span>Tiêu chí chấp thuận</span>{" "}
            <span onClick={() => addCriteria()} className="btn">
              <Plus />
            </span>
          </legend>
          <div className="flex flex-col gap-1">
            {criteriaList.map((criteria) => (
              <div key={criteria.id} className="join items-center">
                <input
                  type="text"
                  className="input input-bordered w-full join-item "
                  placeholder="Nội dung tiêu chí"
                  value={criteria.title}
                  onChange={(e) =>
                    updateCriteria(criteria.id, "title", e.target.value)
                  }
                />

                <select
                  className="select select-bordered w-full join-item"
                  value={criteria.type}
                  onChange={(e) =>
                    updateCriteria(criteria.id, "type", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Chọn loại tiêu chí
                  </option>
                  {criteriaType &&
                    criteriaType.map((crit) => (
                      <option
                        value={crit.code}
                        key={crit.code + " " + criteria.id}
                      >
                        {crit.display}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={() => removeCriteria(criteria.id)}
                  className="btn btn-error   join-item "
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="row-span-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Module</legend>
            <div className="join w-full">
              <Select
                className="join-item w-full"
                styles={{
                  control: (styles) => ({
                    ...styles,
                    backgroundColor: isDark ? "#0f172a" : "white",
                  }),
                  option: (styles, { isFocused, isSelected }) => {
                    let backgroundColor = isDark ? "#1e293b" : "#ffffff";
                    let color = isDark ? "#f1f5f9" : "#111827";

                    if (isSelected) {
                      backgroundColor = isDark ? "#2563eb" : "#3b82f6"; // blue-600 | blue-500
                      color = "#ffffff";
                    } else if (isFocused) {
                      backgroundColor = isDark ? "#334155" : "#e5e7eb"; // slate-700 | gray-200
                    }

                    return {
                      ...styles,
                      backgroundColor,
                      color,
                      cursor: "pointer",
                    };
                  },
                  menuList: (styles) => ({
                    ...styles,
                    maxHeight: "200px", // 👈 Chiều cao tối đa của menu
                    overflowY: "auto", // 👈 Hiển thị scroll khi vượt giới hạn
                  }),
                }}
                isClearable
                value={
                  options.find((opt) => opt.value === selectModule) || null
                }
                onChange={(selected) => setSelectModule(selected?.value ?? "")}
                options={options}
                placeholder="Chọn module"
              />
              <button className="btn join-item" onClick={onAddModule}>
                Thêm
              </button>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Liên kết yêu cầu</legend>
            <Select
              className="w-full"
              styles={{
                control: (styles) => ({
                  ...styles,
                  backgroundColor: isDark ? "#0f172a" : "white",
                }),
                option: (styles, { isFocused, isSelected }) => {
                  let backgroundColor = isDark ? "#1e293b" : "#ffffff";
                  let color = isDark ? "#f1f5f9" : "#111827";

                  if (isSelected) {
                    backgroundColor = isDark ? "#2563eb" : "#3b82f6"; // blue-600 | blue-500
                    color = "#ffffff";
                  } else if (isFocused) {
                    backgroundColor = isDark ? "#334155" : "#e5e7eb"; // slate-700 | gray-200
                  }

                  return {
                    ...styles,
                    backgroundColor,
                    color,
                    cursor: "pointer",
                  };
                },
                menuList: (styles) => ({
                  ...styles,
                  maxHeight: "100px", // 👈 Chiều cao tối đa của menu
                  overflowY: "auto", // 👈 Hiển thị scroll khi vượt giới hạn
                }),
              }}
              isClearable
              value={
                optionReq.find((opt) => opt.value === selectedRequirement) ||
                null
              }
              onChange={(selected) =>
                setSelectedRequirement(selected?.value ?? 0)
              }
              options={optionReq}
              placeholder="Chọn yêu cầu"
            />
          </fieldset>
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
      </div>
      <div className="flex justify-between modal-action">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Đang tạo..." : "Tạo công việc"}
        </button>
        <button
          className="btn btn-outline btn-accent"
          onClick={() => handleReset()}
        >
          Làm mới
        </button>
      </div>
    </div>
  );
}

export default CreateTaskForm;
