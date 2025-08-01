/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddModuleProductModal from "~/components/tasks/modals/add-module-product-modal";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { useUploadFile } from "~/hooks/use-upload-file";
import { encodeBase64 } from "~/lib/services";
import { ProductModule, TaskDTO } from "~/lib/types";
import { EnviromentTest } from "~/lib/types/testcase";
type CreateTestcaseData = {
  product_id: string;
  module: string;
  info: {
    name: string;
    description: string;
    environment: string;
    tags: string[];
    result_expect: string;
    test_data?: string;
    task_id?: number;
  };
  steps: {
    step: number;
    name: string;
    description: string;
    input_data?: string;
    output_data?: string;
    note?: string;
    expected_result: string;
  }[];
};
type FormCreate = {
  module: string;
  info: {
    name: string;
    description: string;
    environment: string;
    tags: string[];
    result_expect: string;
    task_id: number;
    test_data: string;
  };
  steps: {
    id: string;
    step: number;
    name: string;
    description: string;
    input_data: string;
    output_data: string;
    note: string;
    expected_result: string;
  }[];
};
function CreateTestcaseForm({
  product_id,
  onSuccess,
}: {
  product_id: string;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<FormCreate>({
    module: "",
    info: {
      name: "",
      description: "",
      environment: "TEST",
      tags: [],
      result_expect: "",
      task_id: 0,
      test_data: "",
    },
    steps: [
      {
        id: crypto.randomUUID(),
        step: 1,
        name: "",
        description: "",
        expected_result: "",
        note: "",
        input_data: "",
        output_data: "",
      },
    ],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [files, setFile] = useState<File[]>([]);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    { name: string; status: "idle" | "uploading" | "done" | "error" }[]
  >([]);
  const [openAddModule, setopenAddModule] = useState(false);
  const { uploadError, uploadChunkedFile } = useUploadFile();
  const { isLoading, postData, errorData } = useApi<{ id: number }>();
  const [stateError, setStateError] = useState<{
    [key: string]: { message: string };
  }>();
  const {
    getData: getEnv,
    data: environmentTest,
    errorData: errorLoadEnv,
  } = useApi<EnviromentTest[]>();
  const {
    getData: getlistTasks,
    data: tasks,
    errorData: errorGetTask,
  } = useApi<TaskDTO[]>();
  const { getData: getModule, data: modules } = useApi<ProductModule[]>();
  useEffect(() => {
    getEnv("/system/config/eyJ0eXBlIjoidGVzdF9lbnZpcm9ubWVudCJ9");
  }, []);
  useEffect(() => {
    getlistTasks("/tasks/" + encodeBase64({ product_id }));
    getModule("/product/" + encodeBase64({ type: "module", product_id }));
  }, [product_id]);
  useEffect(() => {
    if (errorLoadEnv) {
      toast.error("Môi trường test:" + errorLoadEnv.message);
    }
    // if (errorGetTask && errorGetTask.code != 404)
    //   toast.error("Danh sách task:" + errorGetTask.message);
    if (errorData) {
      toast.error(errorData.message || errorData.title);
    }
    if (uploadError) toast.error(uploadError);
  }, [errorLoadEnv, uploadError]);
  useEffect(() => {
    if (fileUploadStatus.some((st) => st.status == "done")) {
      toast.success("Tạo testcase thành công");
      onSuccess();
      resetForm();
    }
  }, []);
  const handleSubmit = async () => {
    const errors: { [key: string]: { message: string } } = {};

    if (!formData.info.name)
      errors["name"] = { message: "Tên testcase là bắt buộc" };
    if (!formData.info.description)
      errors["description"] = { message: "Mô tả là bắt buộc" };
    if (!formData.info.result_expect)
      errors["result_expect"] = { message: "Kết quả mong đợi là bắt buộc" };
    if (!formData.module) errors["module"] = { message: "Module là bắt buộc" };
    if (formData.steps.length < 1)
      errors["steps"] = { message: "Phải có ít nhất 1 bước" };

    formData.steps.forEach((step, index) => {
      if (!step.name)
        errors[`steps.${index}.name`] = {
          message: `Tên bước ${index + 1} là bắt buộc`,
        };
      if (!step.description)
        errors[`steps.${index}.description`] = {
          message: `Mô tả bước ${index + 1} là bắt buộc`,
        };
      if (!step.expected_result)
        errors[`steps.${index}.expected_result`] = {
          message: `Kết quả mong đợi bước ${index + 1} là bắt buộc`,
        };
    });

    if (Object.keys(errors).length > 0) {
      setStateError(errors);
      toast.warning("Vui lòng kiểm tra lại các trường bị thiếu!");
      return;
    }

    setStateError({});

    const data: CreateTestcaseData = {
      product_id,
      ...formData,
    };
    if (data.info.task_id == 0) delete data.info.task_id;
    if (!data.info.test_data || data.info.test_data.trim().length == 0) {
      // toast.info("Dữ liệu đầu vào sẽ được bỏ qua");
      delete data.info.test_data;
    }
    data.steps = data.steps.map((step) => {
      const temp = step;
      if (temp.input_data?.trim().length == 0) delete temp.input_data;
      if (temp.output_data?.trim().length == 0) delete temp.output_data;
      if (temp.note?.trim().length == 0) delete temp.note;
      return temp;
    });
    const result = await postData("/testcase", data);
    // const result = await uploadMultiFiles({
    //   files,
    //   uploadUrl: "/testcase",
    //   meta: {
    //     ...data,
    //   },
    // });
    if (result == null) {
      return;
    }
    if (files.length > 0) {
      await Promise.all(
        files.map(async (file, index) => {
          // Cập nhật trạng thái đang upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = "uploading";
            return next;
          });

          const res = await uploadChunkedFile(file, "/testcase/file", {
            testcase_id: result.id,
          });

          // Cập nhật trạng thái sau khi upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = res && res.code == 200 ? "done" : "error";
            return next;
          });
        })
      );
    } else {
      toast.success("Tạo testcase thành công");
      onSuccess();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      module: "",
      info: {
        name: "",
        description: "",
        environment: "TEST",
        tags: [],
        result_expect: "",
        task_id: 0,
        test_data: "",
      },
      steps: [
        {
          id: crypto.randomUUID(),
          step: 1,
          name: "",
          description: "",
          expected_result: "",
          input_data: "",
          note: "",
          output_data: "",
        },
      ],
    });
  };

  const handleInfoChange = (
    field: keyof typeof formData.info,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      info: {
        ...formData.info,
        [field]: value,
      },
    });
  };

  const handleStepChange = (
    index: number,
    field: keyof (typeof formData.steps)[0],
    value: string
  ) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      steps: updatedSteps,
    });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        {
          id: crypto.randomUUID(), // ✅ Tạo id duy nhất
          step: formData.steps.length + 1,
          name: "",
          description: "",
          expected_result: "",
          input_data: "",
          output_data: "",
          note: "",
        },
      ],
    });
  };

  const removeStep = (index: number) => {
    if (formData.steps.length <= 1) return;

    const updatedSteps = formData.steps
      .filter((_, i) => i !== index)
      .map((step, idx) => ({
        ...step,
        step: idx + 1,
      }));

    setFormData({
      ...formData,
      steps: updatedSteps,
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.info.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        info: {
          ...formData.info,
          tags: [...formData.info.tags, currentTag.trim()],
        },
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      info: {
        ...formData.info,
        tags: formData.info.tags.filter((tag) => tag !== tagToRemove),
      },
    });
  };

  return (
    <div className="flex flex-col  gap-4 p-4 rounded-lg">
      <div className="grid gap-2 bg-base-200 border-base-300 rounded-box border p-4">
        <fieldset className="fieldset md:grid-cols-2">
          <legend className="fieldset-legend text-xl">
            Thông tin Testcase
          </legend>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Tên testcase <span className="text-red-500">*</span>
            </legend>
            <input
              className="input w-full"
              type="text"
              placeholder="Tên testcase"
              value={formData.info.name}
              onChange={(e) => {
                handleInfoChange("name", e.target.value);
                setStateError((pre) => {
                  const updateState = pre;
                  if (updateState && updateState.name) delete updateState.name;
                  return updateState;
                });
              }}
            />
            {stateError?.name && (
              <span className="label text-error text-sm">
                {stateError.name.message}
              </span>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Kết quả mong đợi<span className="text-red-500">*</span>
            </legend>
            <RichTextEditor
              placeholder="Kết quả mong đợi"
              value={formData.info.result_expect}
              onChange={(e) => {
                handleInfoChange("result_expect", e);
                setStateError((pre) => {
                  const updateState = pre;
                  if (updateState && updateState.result_expect)
                    delete updateState.result_expect;
                  return updateState;
                });
              }}
            />
            {stateError?.result_expect && (
              <span className="label text-error text-sm">
                {stateError.result_expect.message}
              </span>
            )}
            {/* <input
              type="text"
              className="input w-full"
              placeholder="Kết quả mong đợi"
              value={formData.info.result_expect}
              onChange={(e) =>
                handleInfoChange("result_expect", e.target.value)
              }
            /> */}
          </fieldset>
          <fieldset className="fieldset md:col-span-2">
            <legend className="fieldset-legend">
              Mô tả<span className="text-red-500">*</span>
            </legend>
            <RichTextEditor
              placeholder="Mô tả testcase"
              value={formData.info.description}
              onChange={(description) => {
                handleInfoChange("description", description);
                setStateError((pre) => {
                  const updateState = pre;
                  if (updateState && updateState.description)
                    delete updateState.description;
                  return updateState;
                });
              }}
            />
            {stateError?.description && (
              <span className="label text-error text-sm">
                {stateError.description.message}
              </span>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Dữ liệu đầu vào</legend>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nhập dữ liệu đầu vào"
              value={formData.info.test_data}
              onChange={(e) => handleInfoChange("test_data", e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Môi trường<span className="text-red-500">*</span>
            </legend>
            <select
              className="select select-bordered w-full"
              value={formData.info.environment}
              onChange={(e) => handleInfoChange("environment", e.target.value)}
            >
              {environmentTest ? (
                environmentTest.map((env) => (
                  <option value={env.code} key={env.code}>
                    {env.display}
                  </option>
                ))
              ) : (
                <option>Lỗi tải môi trường</option>
              )}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Liên kết task</legend>
            <select
              className="select select-bordered w-full"
              value={formData.info.task_id}
              onChange={(e) =>
                handleInfoChange("task_id", parseInt(e.target.value))
              }
            >
              <option value={0}>Chọn task</option>
              {tasks ? (
                tasks.map((task) => (
                  <option key={task.id + "-ref"} value={task.id}>
                    {task.title}
                  </option>
                ))
              ) : errorGetTask ? (
                <option value="">{errorGetTask.message}</option>
              ) : (
                <option>Không có task nào</option>
              )}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Module<span className="text-red-500">*</span>
            </legend>
            <div className="join">
              <select
                className="select join-item w-full"
                value={formData.module}
                required
                onChange={(e) => {
                  setFormData((pre) => ({ ...pre, module: e.target.value }));
                  setStateError((pre) => {
                    const updateState = pre;
                    if (updateState && updateState.module)
                      delete updateState.module;
                    return updateState;
                  });
                }}
              >
                <option value={""}>Chọn moudle</option>
                {modules ? (
                  modules.map((module) => (
                    <option key={module.id + "-ref-module"} value={module.id}>
                      {module.display}
                    </option>
                  ))
                ) : (
                  <option>Không có module nào</option>
                )}
              </select>

              <button
                className="btn join-item"
                onClick={() => setopenAddModule(true)}
              >
                Thêm
              </button>
            </div>
            {stateError?.module && (
              <span className="label text-error text-sm">
                {stateError.module.message}
              </span>
            )}
          </fieldset>
          <div>
            <label className="label">Tags</label>
            <div className="flex gap-2">
              <input
                className="input input-bordered flex-1"
                type="text"
                placeholder="Thêm tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <button className="btn btn-outline" onClick={addTag}>
                Thêm
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.info.tags.map((tag) => (
                <span key={tag} className="badge badge-primary">
                  {tag}
                  <button className="ml-2" onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
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
              <ul className="mt-4 space-y-1">
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
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Các bước thực hiện</legend>

          {formData.steps.map((step, index) => (
            <div
              key={"step" + step.id}
              className="border p-4 rounded-lg relative"
            >
              {/* Có nút để thêm bước trước bước hiện tại nếu bước hiện tại > 2*/}
              {index > 0 && (
                <button
                  className="btn btn-xs btn-secondary absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                  type="button"
                  onClick={() => {
                    const newStep = {
                      id: crypto.randomUUID(),
                      step: index + 1,
                      name: "",
                      description: "",
                      expected_result: "",
                      input_data: "",
                      output_data: "",
                      note: "",
                    };
                    setFormData((prev) => {
                      const steps = [...prev.steps];
                      steps.splice(index, 0, newStep);
                      // Re-number steps
                      const renumbered = steps.map((s, idx) => ({
                        ...s,
                        step: idx + 1,
                      }));
                      return { ...prev, steps: renumbered };
                    });
                  }}
                  title="Thêm bước trước bước này"
                >
                  + Thêm bước trước
                </button>
              )}
              <div className="absolute top-2 right-2 text-sm font-bold">
                Bước {step.step}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    Tên bước<span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    type="text"
                    placeholder="Tên bước"
                    value={step.name}
                    onChange={(e) => {
                      setStateError((pre) => {
                        const updateState = pre;
                        if (updateState && updateState[`steps.${index}.name`])
                          delete updateState[`steps.${index}.name`];
                        return updateState;
                      });
                      handleStepChange(index, "name", e.target.value);
                    }}
                  />
                  {stateError?.[`steps.${index}.name`] && (
                    <span className="text-error text-sm">
                      {stateError[`steps.${index}.name`].message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="label">
                    Kết quả mong đợi<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Kết quả mong đợi"
                    value={step.expected_result}
                    onChange={(e) => {
                      setStateError((pre) => {
                        const updateState = pre;
                        if (
                          updateState &&
                          updateState[`steps.${index}.expected_result`]
                        )
                          delete updateState[`steps.${index}.expected_result`];
                        return updateState;
                      });
                      handleStepChange(
                        index,
                        "expected_result",
                        e.target.value
                      );
                    }}
                  />
                  {stateError?.[`steps.${index}.expected_result`] && (
                    <span className="text-error text-sm">
                      {stateError[`steps.${index}.expected_result`].message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="label">Dữ liệu đầu vào</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Dữ liệu đầu vào (nếu có)"
                    value={step.input_data || ""}
                    onChange={(e) =>
                      handleStepChange(index, "input_data", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-2 row-span-2 flex flex-col">
                  <label className="label">
                    Mô tả<span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={step.description}
                    onChange={(e) => {
                      setStateError((pre) => {
                        const updateState = pre;
                        if (
                          updateState &&
                          updateState[`steps.${index}.description`]
                        )
                          delete updateState[`steps.${index}.description`];
                        return updateState;
                      });
                      handleStepChange(index, "description", e);
                    }}
                    placeholder="Mô tả bước"
                  />
                  {/* <textarea
                    className="textarea w-full"
                    placeholder="Mô tả bước"
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(index, "description", e.target.value)
                    }
                  /> */}
                  {stateError?.[`steps.${index}.description`] && (
                    <span className="text-error text-sm">
                      {stateError[`steps.${index}.description`].message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="label">Dữ liệu đầu ra</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Dữ liệu đầu ra (nếu có)"
                    value={step.output_data || ""}
                    onChange={(e) =>
                      handleStepChange(index, "output_data", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="label">Ghi chú</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Nhập Ghi chú"
                    value={step.note}
                    onChange={(e) =>
                      handleStepChange(index, "note", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => removeStep(index)}
                  disabled={formData.steps.length <= 1}
                >
                  Xóa bước
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={addStep}>
            Thêm bước mới
          </button>
        </fieldset>
      </div>
      <div className="flex justify-between">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Tạo testcase"
          )}
        </button>
        <button className="btn btn-outline btn-accent" onClick={resetForm}>
          Làm mới
        </button>
      </div>
      {openAddModule && (
        <AddModuleProductModal
          onClose={() => setopenAddModule(false)}
          product_id={product_id}
          reloadData={async () => {
            await getModule(
              "/product/" + encodeBase64({ type: "module", product_id }),
              "reload"
            );
          }}
        />
      )}
    </div>
  );
}

export default CreateTestcaseForm;
