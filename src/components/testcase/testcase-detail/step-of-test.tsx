import { Wrench } from "lucide-react";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { TestStep } from "~/lib/types";

function StepTest({
  steps,
  result_expect,
  openUpdateStep,
}: {
  steps: TestStep[];
  result_expect: string;
  openUpdateStep: () => void;
}) {
  // const handleUpdate = (stepTest) => {
  //   onUpdate({ stepTest });
  // }
  return (
    <div className="bg-base-200 shadow p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold border-l-4 border-green-500 pl-3">
          Các bước kiểm thử
        </h2>
        <button
          className="btn btn-primary btn-outline btn-sm tooltip"
          data-tip="Sửa bước"
          onClick={openUpdateStep}
        >
          <Wrench />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên bước</th>
              <th>Mô tả</th>
              <th>Đầu vào</th>
              <th>Đầu ra</th>
              <th>Kỳ vọng</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step: TestStep) => (
              <tr key={step.step}>
                <td>{step.step}</td>
                <td>{step.name}</td>
                <td>{step.description}</td>
                <td>{step.input_data || "-"}</td>
                <td>{step.output_data || "-"}</td>
                <td>{step.expected_result}</td>
                <td>
                  <SafeHtmlViewer html={step.note || "-"} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7}>Kết quả mong đợi: {result_expect}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default StepTest;
