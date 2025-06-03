/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { TestcaseDetail, TestLog, TestStep, TestAssign } from "~/lib/types";
import { toast } from "sonner";
import AssignTestcaseModal from "~/components/testcase/modals/assign-testcase-modal";
import UploadFileModal from "~/components/testcase/modals/upload-file-modal";
import EditTestcaseModal from "~/components/testcase/modals/edit-testcase-modal";
import { encodeBase64 } from "~/lib/services";

export default function TestcaseDetailClient({
  testcase_id,
}: {
  testcase_id: number;
  product_id: string;
}) {
  const {
    getData,
    data: testcase,
    isLoading: loading,
  } = useApi<TestcaseDetail>();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchTestcase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testcase_id]);

  const fetchTestcase = async () => {
    try {
      await getData(`/testcase/detail/${encodeBase64({ testcase_id })}`);
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch testcase details");
    }
  };

  const handleAssignSubmit = async () => {
    //  try {
    //    await postData(
    //      `/products/${product_id}/testcases/${testcase_id}/assign`,
    //      assignData
    //    );
    //    toast.success("Testcase assigned successfully");
    //    setShowAssignModal(false);
    //    fetchTestcase();
    //  } catch (error) {
    //    toast.error("Failed to assign testcase");
    //  }
  };

  const handleEditSubmit = async () => {
    //  try {
    //    await postData(
    //      `/products/${product_id}/testcases/${testcase_id}`,
    //      updatedData
    //    );
    //    toast.success("Testcase updated successfully");
    //    setShowEditModal(false);
    //    fetchTestcase();
    //  } catch (error) {
    //    toast.error("Failed to update testcase");
    //  }
  };

  const handleFileUpload = async () => {
    //  try {
    //    await postData(
    //      `/products/${product_id}/testcases/${testcase_id}/files`,
    //      fileData,
    //      {
    //        headers: { "Content-Type": "multipart/form-data" },
    //      }
    //    );
    //    toast.success("File uploaded successfully");
    //    setShowUploadModal(false);
    //    fetchTestcase();
    //  } catch (error) {
    //    toast.error("Failed to upload file");
    //  }
  };

  if (loading) return <div>Loading...</div>;
  if (!testcase) return <div>Testcase not found</div>;

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Chi tiết Test Case</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowEditModal(true)}
          >
            Chỉnh sửa
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAssignModal(true)}
          >
            Giao việc
          </button>
          <button
            className="btn btn-accent"
            onClick={() => setShowUploadModal(true)}
          >
            Thêm file
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* General Info Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
            Thông tin chung
          </h2>
          <div className="space-y-3">
            <p>
              <strong>Tên:</strong> {testcase.name}
            </p>
            <p>
              <strong>Mô tả:</strong> {testcase.description}
            </p>
            <p>
              <strong>Tags:</strong>
              {testcase.tags.map((tag) => (
                <span key={tag} className="badge badge-primary ml-2">
                  {tag}
                </span>
              ))}
            </p>
            <p>
              <strong>Môi trường:</strong> {testcase.environment}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(testcase.create_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {testcase.time_end
                ? new Date(testcase.time_end).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
            File đính kèm
          </h2>
          {testcase.testFiles.length > 0 ? (
            <ul className="space-y-2">
              {testcase.testFiles.map((file) => (
                <li key={file.file_id} className="flex items-center">
                  <span className="mr-2">📎</span>
                  {file.file_name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không có file đính kèm</p>
          )}
        </div>
      </div>

      {/* Test Steps Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
          Các bước kiểm thử
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên bước</th>
                <th>Mô tả</th>
                <th>Input</th>
                <th>Output</th>
                <th>Kỳ vọng</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {testcase.testSteps.map((step: TestStep) => (
                <tr key={step.step}>
                  <td>{step.step}</td>
                  <td>{step.name}</td>
                  <td>{step.description}</td>
                  <td>{step.input_data || "-"}</td>
                  <td>{step.output_data || "-"}</td>
                  <td>{step.expected_result}</td>
                  <td>{step.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test History Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
            Lịch sử kiểm thử
          </h2>
          {testcase.testCaseAssigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Người thực hiện</th>
                    <th>Thời gian</th>
                    <th>Kết quả</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {testcase.testCaseAssigns.map((assign: TestAssign) =>
                    assign.testRunInfo.map((run: any) => (
                      <tr key={run.id}>
                        <td>{assign.assignInfo.assign_name}</td>
                        <td>{new Date(run.run_at).toLocaleString()}</td>
                        <td>{run.result ? "✅ Pass" : "❌ Fail"}</td>
                        <td>
                          {run.tester_note || "-"}
                          <div className="text-sm mt-1">
                            {run.step_results?.map((step: any) => (
                              <div key={step.step_index}>
                                🔹 {step.step_name}: {step.result ? "✅" : "❌"}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Chưa có lịch sử kiểm thử</p>
          )}
        </div>

        {/* Activity Log Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 border-l-4 border-green-500 pl-3">
            Nhật ký hoạt động
          </h2>
          {testcase.testLogs.length > 0 ? (
            <ul className="space-y-3">
              {testcase.testLogs.map((log: TestLog) => (
                <li key={log.id + " " + log.date} className="flex items-start">
                  <span className="mr-2">🕓</span>
                  <div>
                    <strong>{new Date(log.date).toLocaleDateString()}</strong> -{" "}
                    <em>{log.name}</em>: {log.content}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Chưa có nhật ký hoạt động</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <AssignTestcaseModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSubmit={handleAssignSubmit}
      />

      <EditTestcaseModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        testcase={testcase}
        onSubmit={handleEditSubmit}
      />

      <UploadFileModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleFileUpload}
      />
    </div>
  );
}
