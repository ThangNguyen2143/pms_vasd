/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { TaskDTO } from "~/lib/types";
import { EnviromentTest } from "~/lib/types/testcase";
type CreateTestcaseData = {
  product_id: string;
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
      step: number;
      name: string;
      description: string;
      input_data?: string;
      expected_result: string;
    }[];
  }>({
    info: {
      name: "",
      description: "",
      environment: "TEST",
      tags: [],
      result_expect: "",
    },
    steps: [
      {
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
  useEffect(() => {
    getEnv(
      "/system/config/eyJ0eXBlIjoidGVzdF9lbnZpcm9ubWVudCJ9",
      "force-cache"
    );
  }, []);
  useEffect(() => {
    getlistTasks("/tasks/" + encodeBase64({ product_id }));
    console.log(encodeBase64({ product_id }));
  }, [product_id]);
  useEffect(() => {
    if (errorLoadEnv) {
      toast.error("Môi trường test:" + errorLoadEnv.message);
    }
    // if (errorGetTask && errorGetTask.code != 404)
    //   toast.error("Danh sách task:" + errorGetTask.message);
    if (errorPost) toast.error(errorPost.message);
  }, [errorLoadEnv, errorPost]);
  const handleSubmit = async () => {
    const data = {
      product_id,
      ...formData,
    };
    if (data.info.task_id == 0) delete data.info.task_id;
    if (!data.info.test_data || data.info.test_data.trim().length == 0) {
      toast.info("Dữ liệu đầu vào sẽ được bỏ qua");
      delete data.info.test_data;
    }
    const result = await postData("/testcase", data);
    if (result !== null) {
      toast.success("Tạo testcase thành công");
      onSuccess();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      info: {
        name: "",
        description: "",
        environment: "TEST",
        tags: [],
        result_expect: "",
        task_id: undefined,
        test_data: undefined,
      },
      steps: [
        {
          step: 1,
          name: "",
          description: "",
          expected_result: "",
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
          step: formData.steps.length + 1,
          name: "",
          description: "",
          expected_result: "",
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
      <div className="grid grid-cols-2 gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Thông tin Testcase</legend>
          <div className="space-y-4">
            <div>
              <label className="label">Tên testcase</label>
              <input
                className="input input-bordered w-full"
                type="text"
                placeholder="Tên testcase"
                value={formData.info.name}
                onChange={(e) => handleInfoChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Mô tả</label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Mô tả testcase"
                value={formData.info.description}
                onChange={(e) =>
                  handleInfoChange("description", e.target.value)
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
              <label className="label">Kết quả mong đợi</label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Kết quả mong đợi"
                value={formData.info.result_expect}
                onChange={(e) =>
                  handleInfoChange("result_expect", e.target.value)
                }
              />
            </div>
            <div className="flex justify-between">
              <div>
                <label className="label">Môi trường</label>
                <select
                  className="select select-bordered w-full"
                  value={formData.info.environment}
                  onChange={(e) =>
                    handleInfoChange("environment", e.target.value)
                  }
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
          </div>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Các bước thực hiện</legend>
          <div className="space-y-4">
            {formData.steps.map((step, index) => (
              <div key={index} className="border p-4 rounded-lg relative">
                <div className="absolute top-2 right-2 text-sm font-bold">
                  Bước {step.step}
                </div>
                <div className="grid grid-cols-1 gap-4">
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
                    <label className="label">Mô tả</label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Mô tả bước"
                      value={step.description}
                      onChange={(e) =>
                        handleStepChange(index, "description", e.target.value)
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
                  <div>
                    <label className="label">Kết quả mong đợi</label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Kết quả mong đợi"
                      value={step.expected_result}
                      onChange={(e) =>
                        handleStepChange(
                          index,
                          "expected_result",
                          e.target.value
                        )
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
          </div>
        </fieldset>
      </div>
      {/* Phần thông tin chung */}

      {/* Phần các bước thực hiện */}

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
