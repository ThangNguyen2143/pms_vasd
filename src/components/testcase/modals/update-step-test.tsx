import { useState } from "react";
import RichTextEditor from "~/components/ui/rich-text-editor";

import { TestStep } from "~/lib/types";
type StepTest = {
  step: number;
  name: string;
  description: string;
  expected_result: string;
  input_data?: string;
  output_data?: string;
  note?: string;
};
function UpdateStepTestModal({
  stepTest,
  onUpdate,
  isOpen,
  onClose,
}: {
  stepTest: TestStep[];
  onUpdate: ({ stepTest }: { stepTest: StepTest[] }) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<{
    steps: {
      step: number;
      name: string;
      description: string;
      input_data?: string;
      output_data?: string;
      note?: string;
      expected_result: string;
    }[];
  }>({
    steps: stepTest.map((step) => ({
      step: step.step,
      name: step.name,
      description: step.description,
      input_data: step.input_data || "",
      output_data: step.output_data || "",
      note: step.note || "",
      expected_result: step.expected_result,
    })),
  });
  if (!isOpen) return null;
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

  const resetForm = () => {
    setFormData({
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

  const handleSubmit = async () => {
    // Simulate API call
    onUpdate({ stepTest: formData.steps });
    onClose();
    // Here you would typically make an API call to save the data
    // For example:
    // await api.saveTestSteps(formData);
  };
  return (
    <div className="modal-open modal">
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
      <div className="modal-box max-w-5xl w-full">
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
                    <RichTextEditor
                      className="w-full"
                      placeholder="Mô tả chi tiết bước thực hiện"
                      value={step.description}
                      onChange={(e) =>
                        handleStepChange(index, "description", e)
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
                  <div>
                    <label className="label">Ghi chú bước</label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Ghi chú bước"
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
          </div>
        </fieldset>

        <div className="flex justify-between">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Cập nhật
          </button>
          <button className="btn btn-outline btn-accent" onClick={resetForm}>
            Làm mới
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateStepTestModal;
