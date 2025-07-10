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
  const [selectedRequirement, setSelectedRequirement] = useState<number>(0);
  const [selectModule, setSelectModule] = useState<string>("");
  const [files, setFile] = useState<File[]>([]);

  const { isUploading, uploadError, uploadMultiFiles } = useUploadFile();

  const { data: requireds, getData: getRequiredList } =
    useApi<{ id: number; title: string }[]>();
  // const { postData, isLoading, errorData: postError } = useApi<"">();
  const { data: criteriaType, getData: getCriterial } =
    useApi<{ code: string; display: string }[]>();
  useEffect(() => {
    getCriterial("/system/config/eyJ0eXBlIjoiY3JpdGVyaWFfdHlwZSJ9");
  }, []);
  useEffect(() => {
    getRequiredList("/requirements/list/" + encodeBase64({ product_id }));
  }, [product_id]);
  useEffect(() => {
    // if (postError) toast.error(postError.message);
    if (uploadError) toast.error(uploadError);
  }, [uploadError]);
  const handleSubmit = async () => {
    if (title.trim() === "") {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }
    if (description.trim() === "") {
      toast.error("Vui lòng nhập mô tả công việc");
      return;
    }
    if (deadline.trim() === "") {
      toast.error("Vui lòng chọn deadline");
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
      dead_line: deadline,
      requirement_id: selectedRequirement,
      acceptances: criteriaList.map((crit) => ({
        title: crit.title,
        type: crit.type,
      })),
    };
    if (data.requirement_id == 0) delete data.requirement_id;
    if (data.module == "") delete data.module;
    if (data.acceptances?.length == 0) delete data.acceptances;
    // const result = await postData("/tasks", data);
    const result = await uploadMultiFiles({
      files,
      uploadUrl: "/tasks",
      meta: {
        ...data,
      },
    });
    if (result && result.code == 200) {
      toast.success("Tạo công việc thành công");
      onSuccess(); // gọi lại TaskList để reload
      setTitle("");
      setDescription("");
      setDeadline("");
    }
  };
  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 rounded-lg">
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
              isClearable
              value={options.find((opt) => opt.value === selectModule) || null}
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
          <select
            className="select"
            value={selectedRequirement}
            onChange={(e) => setSelectedRequirement(parseInt(e.target.value))}
          >
            <option value={0}>Chọn yêu cầu</option>
            {requireds ? (
              requireds.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.title}
                </option>
              ))
            ) : (
              <option value={0} disabled>
                Không có yêu cầu nào
              </option>
            )}
          </select>
        </fieldset>
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

      <div className="flex justify-between md:col-span-2">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? "Đang tạo..." : "Tạo công việc"}
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
