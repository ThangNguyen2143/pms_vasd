/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import {
  TestcaseDetail,
  EnviromentTest,
  TestComment,
  ProductModule,
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
import TestHistory from "~/components/testcase/testcase-detail/test-history";
import CopyTestcaseModal from "~/components/testcase/modals/copy-testcase-modal";
import { useRouter } from "next/navigation";
import UpdateDeadlineTesterModal from "~/components/testcase/modals/update-deadline-test";
type InfoTestcaseDetail = {
  name: string;
  description: string;
  task_id?: number;
  module: string;
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
}: {
  testcase_id: number;
}) {
  const route = useRouter();
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
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showUpdateDeadlineModal, setShowUpdateDeadlineModal] = useState<{
    code: string;
    deadline: string;
  }>();
  const [openAddTest, setOpenAddTest] = useState<string>();
  const { data: moduleList, getData: getModules } = useApi<ProductModule[]>();
  const { removeData: deleteTest, errorData: errorDel } = useApi();
  useEffect(() => {
    if (testcase)
      getModules(
        "/product/" +
          encodeBase64({ type: "module", product_id: testcase.product_id }),
        "default"
      );
  }, [testcase]);
  useEffect(() => {
    if (errorDel) {
      toast.error(errorDel.message || errorDel.title);
    }
  }, [errorDel]);
  useEffect(() => {
    getEnv("/system/config/eyJ0eXBlIjoidGVzdF9lbnZpcm9ubWVudCJ9");
  }, []);
  useEffect(() => {
    if (errorLoadEnv) toast.error(errorLoadEnv.message || errorLoadEnv.title);
    if (errorPost) {
      toast.error(errorPost.message || errorPost.title);
      console.log(errorPost);
    }
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
        module: string;
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
        module: info?.module || testcase?.module || "",
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
  const handleDeleteTest = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa testcase này?")) {
      const re = await deleteTest("/testcase/" + encodeBase64({ testcase_id }));
      if (re != null) {
        toast.success("Xóa testcase thành công");
        route.back();
      }
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!testcase) return <div>Testcase not found</div>;
  return (
    <div className="mx-auto  p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Chi tiết Test Case</h1>
        <div className="flex gap2">
          <button
            className="btn btn-dash"
            onClick={() => setShowCopyModal(true)}
          >
            Copy testcase
          </button>
          <button className="btn btn-error ml-2" onClick={handleDeleteTest}>
            Xóa testcase
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Testcase Info  Section */}
        <div className="md:col-span-2">
          <TestcaseInfo
            testcase={testcase}
            modules={moduleList || undefined}
            openUpdate={() => setShowEditModal(true)}
            onUpdate={fetchTestcase}
          />
        </div>

        <div>
          <TestDependComp
            product_id={testcase.product_id}
            testcase_id={testcase_id}
            onUpdate={fetchTestcase}
            testDepend={testcase.test_depend}
          />
          <AttachmentTestcaseFile
            onUpdate={fetchTestcase}
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
      <TestHistory testcase={testcase}></TestHistory>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Comment testcase */}
        <div className="md:col-span-2">
          <CommentTestcase
            testcase_id={testcase_id}
            product_id={testcase.product_id}
            comments={commentsList || []}
            updateComment={fetchComment}
          />
        </div>

        {/* Assign User Section */}
        <AssignedUser
          assignTo={testcase.testCaseAssigns}
          onUpdate={() => fetchTestcase()}
          testcase_id={testcase_id}
          openAddTest={(code) => setOpenAddTest(code)}
          openAssign={() => setShowAssignModal(true)}
          openUpdateDeadline={(code, deadline) =>
            setShowUpdateDeadlineModal({ code, deadline })
          }
        />
        {/* Test History Section */}

        {/* Activity Log Section */}
        <div className="md:col-span-2">
          <TestcaseLog testLogs={testcase.testLogs} />
        </div>
      </div>

      {/* Modals */}
      {showCopyModal && (
        <CopyTestcaseModal
          test_id={testcase_id}
          onClose={() => setShowCopyModal(false)}
        />
      )}
      <AssignTestcaseModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onUpdate={fetchTestcase}
        product_id={testcase.product_id}
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
      {showUpdateDeadlineModal && (
        <UpdateDeadlineTesterModal
          assign_code={showUpdateDeadlineModal.code}
          deadline_current={showUpdateDeadlineModal.deadline}
          testcase_id={testcase_id}
          onClose={() => setShowUpdateDeadlineModal(undefined)}
          onUpdate={fetchTestcase}
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
        modules={moduleList || []}
        product_id={testcase.product_id}
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
