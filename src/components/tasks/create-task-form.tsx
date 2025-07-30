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
import { format_date, toISOString } from "~/utils/fomat-date";
import SelectInput from "../ui/selectOptions";
import { addHours } from "date-fns";
interface Criteria {
  id: string;
  title: string;
  type: string;
  percent: number;
}
interface DataPost {
  product_id: string;
  title: string;
  description: string;
  dead_line?: string;
  module?: string;
  requirement?: { id: number }[];
  acceptances?: { title: string; type: string; percent: number }[];
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
  const [deadline, setDeadline] = useState(
    format_date(addHours(new Date(), 3))
  );
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([
    {
      id: Date.now().toString(),
      title: "",
      type: "",
      percent: 100,
    },
  ]);
  const [selectedRequirement, setSelectedRequirement] = useState<number[]>([]);
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
    if (postError) toast.error(postError.message || postError.title);
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
    if (deadline == "") {
      toast.error("Vui lòng chọn deadline (chưa chọn ngày)");
      return;
    }
    if (criteriaList.some((crit) => crit.title.trim() === "")) {
      toast.error("Vui lòng nhập tiêu chí chấp thuận");
      return;
    }
    const totalPercent = criteriaList.reduce(
      (sum, item) => sum + Number(item.percent || 0),
      0
    );
    if (totalPercent > 100) {
      toast.error("Tổng tỉ lệ hoàn thành lớn hơn 100%");
      return;
    }
    if (selectModule == "") {
      toast.error("Vui lòng chọn module");
      return;
    }
    const data: DataPost = {
      product_id,
      title,
      description,
      module: selectModule,
      dead_line: toISOString(deadline),
      requirement: [...selectedRequirement?.map((reqs) => ({ id: reqs }))],
      acceptances: criteriaList.map((crit) => ({
        title: crit.title,
        type: crit.type,
        percent: crit.percent,
      })),
    };
    if (data.requirement && data.requirement.length == 0)
      delete data.requirement;
    if (data.module == "") delete data.module;
    if (data.dead_line == "") delete data.dead_line;
    if (data.acceptances?.length == 0) delete data.acceptances;
    // const result = await uploadMultiFiles({
    //   files,
    //   uploadUrl: "/tasks",
    //   meta: {
    //     ...data,
    //   },
    // });
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

          const res = await uploadChunkedFile(file, "/tasks/file", {
            task_id: result.id,
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
        percent: 100,
      },
    ]);
    setSelectModule("");
    setSelectedRequirement([]);
    setFile([]);
  };
  const addCriteria = () => {
    const totalPercent = criteriaList.reduce(
      (sum, item) => sum + Number(item.percent || 0),
      0
    );
    const remaining = Math.max(0, 100 - totalPercent);
    setCriteriaList([
      ...criteriaList,
      {
        id: Date.now().toString(),
        title: "",
        type: "",
        percent: remaining,
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
        value: req.id.toString(),
        label: req.title,
      })) ?? [];
  return (
    <div>
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
            minDate={new Date()}
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
                <label
                  className="tooltip tooltip-top join-item input"
                  data-tip="Tỉ lệ hoàn thành (%)"
                >
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={criteria.percent}
                    onChange={(e) =>
                      updateCriteria(criteria.id, "percent", e.target.value)
                    }
                  />
                  <span className="label">%</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeCriteria(criteria.id)}
                  className="btn btn-error join-item"
                  disabled={criteriaList.length <= 1}
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
              <SelectInput
                options={options}
                classNames="join-item"
                placeholder="Chọn module"
                setValue={(e) =>
                  setSelectModule(typeof e === "string" ? e : "")
                }
                singleValue={selectModule}
              />
              <button className="btn join-item" onClick={onAddModule}>
                Thêm
              </button>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Liên kết yêu cầu</legend>
            <SelectInput
              options={optionReq}
              isMulti
              placeholder="Chọn yêu cầu"
              setValue={(e) =>
                setSelectedRequirement(
                  Array.isArray(e) ? e.map((v) => Number(v)) : []
                )
              }
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
