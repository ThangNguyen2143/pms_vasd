/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { BugComment, BugDetail, BugStatus } from "~/lib/types";
import { encodeBase64 } from "~/lib/services";
import BugInfo from "~/components/bugs/bugdetail/bug-info";
import BugAttachments from "~/components/bugs/bugdetail/attachment-bug";
import BugComments from "~/components/bugs/bugdetail/bug-comment";
import BugLinks from "~/components/bugs/bugdetail/bug-link";
import AssignBug from "~/components/bugs/bugdetail/assign-bug";
import ReTestList from "~/components/bugs/bugdetail/retest-bug";
import BugLogs from "~/components/bugs/bugdetail/bug-log";
import AddFileAttachmentModal from "~/components/bugs/modal/add-file-attachment";
import clsx from "clsx";
import { status_with_color } from "~/utils/status-with-color";
import AssignBugModal from "~/components/bugs/modal/assign-bug-modal";
import ReTestBugAssignModal from "~/components/bugs/modal/re-test-assign";
import LinkTaskOrTestToBugModal from "~/components/bugs/modal/ref-update-modal";

function BugDetailClient({
  bug_id,
  product_id,
}: {
  bug_id: number;
  product_id: string;
}) {
  const [retestAssign, setRetestAssign] = useState(false);
  const [, setShowUpdateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);
  const { data: bugData, getData, isLoading, errorData } = useApi<BugDetail>();
  const { data: bugcomments, getData: getListComment } = useApi<BugComment[]>();
  const { data: bugStatus, getData: getBugStatus } = useApi<BugStatus[]>();
  useEffect(() => {
    getData("/bugs/detail/" + encodeBase64({ bug_id }));
    getListComment("/bugs/comments/" + encodeBase64({ bug_id }), "reload");
    getBugStatus("/system/config/eyJ0eXBlIjoiYnVnX3N0YXR1cyJ9", "default");
  }, [bug_id]);
  const reloadDataBug = async () => {
    await getData("/bugs/detail/" + encodeBase64({ bug_id }), "reload");
  };
  const reloadComment = async () => {
    await getListComment(
      "/bugs/comments/" + encodeBase64({ bug_id }),
      "reload"
    );
  };
  if (isLoading)
    return (
      <div className="items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  if (!bugData || errorData)
    return (
      <div className="items-center">
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">{errorData?.code}</h1>
              <p className="py-6 text-error">{errorData?.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-3 flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-primary">🐞 Chi tiết Bug</h2>
          <span
            className={clsx(
              "badge text-sm px-4 py-2 rounded-full",
              `badge-${status_with_color(bugData.status)}`
            )}
          >
            {bugStatus
              ? bugStatus.find((st) => st.code == bugData.status)?.description
              : bugData.status}
          </span>
        </div>
        {/* Left side: Bug info + Attachments + Comments */}
        <div className="md:col-span-2 space-y-6">
          <BugInfo
            bug={bugData}
            bug_status={bugStatus || []}
            onAssign={() => setShowAssignModal(true)}
            onEdit={() => setShowUpdateModal(true)}
            onLinkRequirement={() => setShowLinkModal(true)}
            onUpdate={reloadDataBug}
          />
          <BugAttachments
            files={bugData.bugFiles || []}
            bug_id={bug_id}
            uploadFile={() => setShowAddFile(true)}
          />
          <BugComments
            comments={bugcomments || []}
            bug_id={bug_id}
            product_id={product_id}
            updateComment={async () => await reloadComment()}
          />
        </div>

        {/* Right side: Links + Assign + Retest + Logs */}
        <div className="space-y-6">
          <BugLinks
            taskId={bugData.related_task_id || null}
            testcaseId={bugData.test_case_ref_id || null}
            task_name={bugData.related_task_name || null}
            testcase_name={bugData.test_case_ref || null}
          />
          <AssignBug
            assignee={bugData.assignInfo || null}
            bug_id={bug_id}
            onUpdate={reloadDataBug}
          />
          <ReTestList
            retests={bugData.reTestingBug || []}
            bug_id={bug_id}
            onUpdate={reloadDataBug}
            setReTestAssign={() => setRetestAssign(true)}
          />
          <BugLogs logs={bugData.bugLogs || []} />
        </div>
      </div>
      {/* Modal */}
      {showAddFile && (
        <AddFileAttachmentModal
          bug_id={bug_id}
          onClose={() => setShowAddFile(false)}
          onUpdate={async () => await reloadDataBug()}
        />
      )}
      {showAssignModal && (
        <AssignBugModal
          bug_id={bug_id}
          product_id={product_id}
          onClose={() => setShowAssignModal(false)}
          onUpdate={reloadDataBug}
        />
      )}
      {retestAssign && (
        <ReTestBugAssignModal
          bug_id={bug_id}
          product_id={product_id}
          onClose={() => setRetestAssign(false)}
          onUpdate={reloadDataBug}
        />
      )}
      {showLinkModal && (
        <LinkTaskOrTestToBugModal
          bug_id={bug_id}
          onClose={() => setShowLinkModal(false)}
          onUpdate={reloadDataBug}
          product_id={product_id}
        />
      )}
    </div>
  );
}

export default BugDetailClient;
