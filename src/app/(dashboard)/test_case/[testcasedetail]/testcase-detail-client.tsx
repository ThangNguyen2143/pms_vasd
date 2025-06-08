/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import {
  TestcaseDetail,
  TestAssign,
  EnviromentTest,
  TestRunInfo,
  TestComment,
} from "~/lib/types";
import { toast } from "sonner";
import AssignTestcaseModal from "~/components/testcase/modals/assign-testcase-modal";
import UploadFileModal from "~/components/testcase/modals/upload-file-modal";
import EditTestcaseModal from "~/components/testcase/modals/edit-testcase-modal";
import { encodeBase64 } from "~/lib/services";
import TestcaseInfo from "~/components/testcase/testcase-detail/testcase-info";
import AttachmentTestcaseFile from "~/components/testcase/testcase-detail/attachment-testcase-file";
import TestcaseLog from "~/components/testcase/testcase-detail/testcase-log";
import AssignedUser from "~/components/testcase/testcase-detail/assign-user";
import AddTestRunModal from "~/components/testcase/modals/open-add-test-modal";
import StepTable from "~/components/testcase/testcase-detail/step-of-test";
import CommentTestcase from "~/components/testcase/testcase-detail/comment-testcase";
import UpdateStepTestModal from "~/components/testcase/modals/update-step-test";
import TestDependComp from "~/components/testcase/testcase-detail/test-depend";
type InfoTestcaseDetail = {
  name: string;
  description: string;
  task_id?: number;
  tags: string[];
  test_data: string;
  environment: string;
  result_expect: string;
};
type StepTest = {
  step: number;
  name: string;
  description: string;
  expected_result: string;
  input_data?: string;
  output_data?: string;
  note?: string;
};
export default function TestcaseDetailClient({
  testcase_id,
  product_id,
}: {
  testcase_id: number;
  product_id: string;
}) {
  const {
    getData,
    data: testcase,
    isLoading: loading,
  } = useApi<TestcaseDetail>();
  const { getData: getComments, data: commentsList } = useApi<TestComment[]>();
  const {
    getData: getEnv,
    data: environmentTest,
    errorData: errorLoadEnv,
  } = useApi<EnviromentTest[]>();
  const { putData, errorData: errorPost } = useApi();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpdateStep, setShowUpdateStep] = useState(false);
  const [openAddTest, setOpenAddTest] = useState<string>();
  useEffect(() => {
    getEnv(
      "/system/config/eyJ0eXBlIjoidGVzdF9lbnZpcm9ubWVudCJ9",
      "force-cache"
    );
  }, []);
  useEffect(() => {
    if (errorLoadEnv) toast.error(errorLoadEnv.message);
    if (errorPost) toast.error(errorPost.message);
    console.log(errorLoadEnv, errorPost);
  }, [errorLoadEnv, errorPost]);
  useEffect(() => {
    fetchTestcase();
    fetchComment();
  }, [testcase_id]);

  const fetchTestcase = async () => {
    try {
      await getData(
        `/testcase/detail/${encodeBase64({ testcase_id })}`,
        "reload"
      );
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch testcase details");
    }
  };
  const fetchComment = async () => {
    try {
      await getComments(
        `/testcase/comments/${encodeBase64({ testcase_id })}`,
        "reload"
      );
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch comment testcases");
    }
  };
  const handleEditSubmit = async ({
    info,
    stepTest,
  }: {
    info?: InfoTestcaseDetail;
    stepTest?: StepTest[];
  }) => {
    try {
      const body: {
        steps: StepTest[];
        testcase_id: number;
        name: string;
        description: string;
        task_id?: number;
        tags: string[];
        test_data?: string;
        result_expect: string;
        environment: string;
      } = {
        testcase_id,
        name: info?.name || testcase?.name || "",
        description: info?.description || testcase?.description || "",
        task_id: info?.task_id || testcase?.task?.id,
        tags: info?.tags || testcase?.tags || [],
        test_data: info?.test_data || testcase?.test_data,
        result_expect: info?.result_expect || testcase?.result_expect || "",
        environment: info?.environment || testcase?.environment || "",
        steps: stepTest
          ? stepTest.map((step, index) => ({
              ...step,
              step: index + 1,
            }))
          : testcase
          ? testcase?.testSteps.map((step, index) => ({
              ...step,
              step: index + 1,
            }))
          : [],
      };
      if (!body.task_id) delete body.task_id; // Remove task_id if not provided
      if (!body.test_data) delete body.test_data; // Remove test_data if not provided
      const re = await putData(`/testcase`, body);
      if (re != "") {
        toast.error("Cập nhật thất bại");
        return;
      }
      await fetchTestcase(); // Refetch to get updated data
      toast.success("Cập nhật thành công");
      if (info) {
        setShowEditModal(false);
      }
      if (stepTest) {
        setShowUpdateStep(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("Cập nhật thất bại");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!testcase) return <div>Testcase not found</div>;

  return (
    <div className="max-w-7xl mx-auto  p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Chi tiết Test Case</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Testcase Info  Section */}
        <TestcaseInfo
          testcase={testcase}
          openUpdate={() => setShowEditModal(true)}
          onUpdate={fetchTestcase}
        />
        <div>
          <TestDependComp
            product_id={product_id}
            testcase_id={testcase_id}
            onUpdate={fetchTestcase}
            testDepend={testcase.test_depend}
          />
          <AttachmentTestcaseFile
            files={testcase.testFiles}
            testcase_id={testcase_id}
            uploadFile={() => setShowUploadModal(true)}
          />
        </div>
        {/* Attachment Section*/}
      </div>

      {/* Test Steps Section */}
      <StepTable
        steps={testcase.testSteps}
        result_expect={testcase.result_expect}
        // testcase_id={testcase.id}
        openUpdateStep={() => setShowUpdateStep(true)} // hàm để refetch dữ liệu
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comment testcase */}
        <CommentTestcase
          testcase_id={testcase_id}
          comments={commentsList || []}
          product_id={product_id}
          updateComment={fetchComment}
        />
        {/* Assign User Section */}
        <AssignedUser
          assignTo={testcase.testCaseAssigns}
          onUpdate={() => fetchTestcase()}
          testcase_id={testcase_id}
          openAddTest={(code) => setOpenAddTest(code)}
          openAssign={() => setShowAssignModal(true)}
        />
        {/* Test History Section */}
        <div className="bg-base-200 shadow p-4 rounded-lg">
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
                    assign.testRunInfo.map((run: TestRunInfo) => (
                      <tr key={run.code}>
                        <td>{assign.assignInfo.assign_name}</td>
                        <td>{new Date(run.run_at).toLocaleString()}</td>
                        <td>{run.result ? "✅ Pass" : "❌ Fail"}</td>
                        <td>
                          {run.tester_note || "-"}
                          <div className="text-sm mt-1">
                            {run.step_results?.map((step) => (
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
        <TestcaseLog testLogs={testcase.testLogs} />
      </div>

      {/* Modals */}
      <AssignTestcaseModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onUpdate={fetchTestcase}
        product_id={product_id}
        test_id={testcase_id}
      />
      {openAddTest && (
        <AddTestRunModal
          assign_code={openAddTest}
          onClose={() => setOpenAddTest(undefined)}
          onUpdate={fetchTestcase}
          steps={testcase.testSteps}
          testcase_id={testcase_id}
        />
      )}
      <UpdateStepTestModal
        isOpen={showUpdateStep}
        onClose={() => setShowUpdateStep(false)}
        onUpdate={({ stepTest }) => handleEditSubmit({ stepTest })}
        stepTest={testcase.testSteps}
      />
      <EditTestcaseModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product_id={product_id}
        testcase={testcase}
        environmentTests={environmentTest || []}
        onSubmit={handleEditSubmit}
      />

      <UploadFileModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpdate={fetchTestcase}
        testcase_id={testcase_id}
      />
    </div>
  );
}
