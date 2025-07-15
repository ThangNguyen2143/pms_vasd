"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { toast } from "sonner";
import { TestStep } from "~/lib/types";
import { useUser } from "~/providers/user-context";
import RichTextEditor from "~/components/ui/rich-text-editor";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { format_date, toISOString } from "~/utils/fomat-date";
import DateTimePicker from "~/components/ui/date-time-picker";

interface AddTestRunModalProps {
  steps: TestStep[];
  assign_code: string;
  testcase_id: number;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}

export default function AddTestRunModal({
  steps,
  assign_code,
  testcase_id,
  onUpdate,
  onClose,
}: AddTestRunModalProps) {
  const { user } = useUser();
  const { putData, isLoading, errorData } = useApi();
  const [formData, setFormData] = useState({
    run_at: format_date(new Date()),
    tester_note: "",
    step_results: steps.map((step) => ({
      code: step.code,
      result: "true",
      note: "",
    })),
  });
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const totalResult = formData.step_results.every(
        (step) => step.result === "true"
      );
      const payload = {
        testcase_id,
        assign_code,
        run_at: toISOString(formData.run_at),
        result: totalResult,
        tester_note: formData.tester_note,
        step_result: formData.step_results.map((step) => ({
          code: step.code,
          result: step.result === "true",
          note: step.note,
        })),
      };
      const re = await putData("/testcase/testing/run", payload);
      if (re != "") return;
      else {
        toast.success("Thêm lần test thành công");
        await onUpdate();
        onClose();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Thêm lần test thất bại");
    }
  };

  const handleStepResultChange = (
    index: number,
    field: "result" | "note",
    value: string
  ) => {
    const updatedSteps = [...formData.step_results];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      step_results: updatedSteps,
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl w-full">
        <h2 className="text-xl font-bold mb-4">Thêm lần test mới</h2>
        <form onSubmit={handleSubmit}>
          {/* Sửa thẻ */}
          <div className="space-y-4">
            {/* Thông tin chung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Thời gian thực hiện</label>
                <DateTimePicker
                  className="input input-bordered w-full"
                  value={formData.run_at}
                  onChange={(e) => setFormData({ ...formData, run_at: e })}
                />
              </div>
              <div className="flex items-center">
                <label className="label">
                  Người thực hiện:
                  <input type="text" value={user?.name} disabled />
                </label>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Kết quả từng bước</h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.code} className="border p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          Bước {step.step}: {step.name}
                        </h4>
                        <SafeHtmlViewer html={step.description} />
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            className="radio"
                            name={`step-${step.code}-result`}
                            value="true"
                            checked={
                              formData.step_results[index].result === "true"
                            }
                            onChange={() =>
                              handleStepResultChange(index, "result", "true")
                            }
                          />
                          <span>Đạt</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`step-${step.code}-result`}
                            className="radio"
                            value="false"
                            checked={
                              formData.step_results[index].result === "false"
                            }
                            onChange={() =>
                              handleStepResultChange(index, "result", "false")
                            }
                          />
                          <span>Không đạt</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Ghi chú cho bước này
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-full"
                        value={formData.step_results[index].note}
                        onChange={(e) =>
                          handleStepResultChange(index, "note", e.target.value)
                        }
                        placeholder="Nhập ghi chú..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1">Ghi chú tổng thể</label>
              <RichTextEditor
                value={formData.tester_note}
                onChange={(e) => setFormData({ ...formData, tester_note: e })}
                placeholder="Nhập ghi chú về lần test này..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu kết quả"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
