/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { BugComment, BugDetail } from "~/lib/types";
import { encodeBase64 } from "~/lib/services";
import BugInfo from "~/components/bugs/bugdetail/bug-info";
import BugAttachments from "~/components/bugs/bugdetail/attachment-bug";
import BugComments from "~/components/bugs/bugdetail/bug-comment";
import BugLinks from "~/components/bugs/bugdetail/bug-link";
import AssignBug from "~/components/bugs/bugdetail/assign-bug";
import ReTestList from "~/components/bugs/bugdetail/retest-bug";
import BugLogs from "~/components/bugs/bugdetail/bug-log";
import AddFileAttachmentModal from "~/components/bugs/modal/add-file-attachment";

function BugDetailClient({ bug_id }: { bug_id: number }) {
  const [showAddFile, setShowAddFile] = useState(false);
  const { data: bugData, getData, isLoading, errorData } = useApi<BugDetail>();
  const {
    data: bugcomments,
    getData: getListComment,
    errorData: bugError,
  } = useApi<BugComment[]>();
  useEffect(() => {
    getData("/bugs/detail/" + encodeBase64({ bug_id }));
    getListComment("/bugs/comments/" + encodeBase64({ bug_id }), "reload");
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
  console.log(bugError);
  return (
    <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
      {/* Left side: Bug info + Attachments + Comments */}
      <div className="md:col-span-2 space-y-6">
        <BugInfo bug={bugData} />
        <BugAttachments
          files={bugData.bugFiles || []}
          uploadFile={() => setShowAddFile(true)}
        />
        <BugComments
          comments={bugcomments || []}
          bug_id={bug_id}
          updateComment={async () => await reloadComment()}
        />
      </div>

      {/* Right side: Links + Assign + Retest + Logs */}
      <div className="space-y-6">
        <BugLinks
          taskId={bugData.related_task_id}
          testcaseId={bugData.test_case_ref_id}
        />
        <AssignBug assignee={bugData.assignInfo || null} />
        <ReTestList retests={bugData.reTestingBug || []} />
        <BugLogs logs={bugData.bugLogs || []} />
      </div>
      {showAddFile && (
        <AddFileAttachmentModal
          bug_id={bug_id}
          onClose={() => setShowAddFile(false)}
          onUpdate={async () => await reloadDataBug()}
        />
      )}
    </div>
  );
}

export default BugDetailClient;
