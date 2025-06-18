/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
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
function CreateTestcaseForm({
  product_id,
  onSuccess,
}: {
  product_id: string;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<{
    module: string;
    info: {
      name: string;
      description: string;
      environment: string;
      tags: string[];
      result_expect: string;
      task_id?: number;
      test_data?: string;
    };
    steps: {
      id: string;
      step: number;
      name: string;
      description: string;
      input_data?: string;
      output_data?: string;
      note?: string;
      expected_result: string;
    }[];
  }>({
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
      },
    ],
  });

  const [currentTag, setCurrentTag] = useState("");
  const {
    postData,
    isLoading,
    errorData: errorPost,
  } = useApi<"", CreateTestcaseData>();
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
    getEnv(
      "/system/config/eyJ0eXBlIjoidGVzdF9lbnZpcm9ubWVudCJ9",
      "force-cache"
    );
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
    if (errorPost) {
      console.error(errorPost);
      toast.error(errorPost.message || errorPost.title);
    }
  }, [errorLoadEnv, errorPost]);
  const handleSubmit = async () => {
    const data = {
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
    if (result !== null) {
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
      <div className="grid gap-2">
        <fieldset className="fieldset md:grid-cols-2">
          <legend className="fieldset-legend">Thông tin Testcase</legend>
          <label>
            <label className="label">Tên testcase</label>
            <input
              className="input input-bordered w-full"
              type="text"
              placeholder="Tên testcase"
              value={formData.info.name}
              onChange={(e) => handleInfoChange("name", e.target.value)}
            />
          </label>
          <div>
            <label className="label">Kết quả mong đợi</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Kết quả mong đợi"
              value={formData.info.result_expect}
              onChange={(e) =>
                handleInfoChange("result_expect", e.target.value)
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Mô tả</label>
            <RichTextEditor
              placeholder="Mô tả testcase"
              value={formData.info.description}
              onChange={(description) =>
                handleInfoChange("description", description)
              }
            />
          </div>
          <div>
            <label className="label">Dữ liệu đầu vào</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nhập dữ liệu đầu vào"
              value={formData.info.test_data}
              onChange={(e) => handleInfoChange("test_data", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Môi trường</label>
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
          </div>
          <div>
            <label className="label">Liên kết task</label>
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
          </div>
          <div>
            <label className="label">Module</label>
            <select
              className="select select-bordered w-full"
              value={formData.module}
              onChange={(e) =>
                setFormData((pre) => ({ ...pre, module: e.target.value }))
              }
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
          </div>
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
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Các bước thực hiện</legend>

          {formData.steps.map((step, index) => (
            <div
              key={"step" + step.id}
              className="border p-4 rounded-lg relative"
            >
              <div className="absolute top-2 right-2 text-sm font-bold">
                Bước {step.step}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">Tên bước</label>
                  <input
                    className="input input-bordered w-full"
                    type="text"
                    placeholder="Tên bước"
                    value={step.name}
                    onChange={(e) =>
                      handleStepChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="label">Kết quả mong đợi</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Kết quả mong đợi"
                    value={step.expected_result}
                    onChange={(e) =>
                      handleStepChange(index, "expected_result", e.target.value)
                    }
                  />
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
                  <label className="label">Mô tả</label>
                  <textarea
                    className="textarea w-full"
                    placeholder="Mô tả bước"
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(index, "description", e.target.value)
                    }
                  />
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
          {isLoading ? "Đang tạo..." : "Tạo testcase"}
        </button>
        <button className="btn btn-outline btn-accent" onClick={resetForm}>
          Làm mới
        </button>
      </div>
    </div>
  );
}

export default CreateTestcaseForm;
