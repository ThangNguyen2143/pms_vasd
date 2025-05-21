/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Attachments from "~/components/requirment/requirement-detail/attachments";
import EditRequirementModal from "~/components/requirment/modals/edit-requirment-modal";
import RequirementInfo from "~/components/requirment/requirement-detail/requirment-info";
import RequirmentLogs from "~/components/requirment/requirement-detail/requirment-logs";
import RequesterInfo from "~/components/requirment/requirement-detail/requester-info";
import StatusTag from "~/components/requirment/requirement-detail/status-tag-requirment";
import EditRequesterModal from "~/components/requirment/modals/edit-requester-modal";
import AddAttachmentModal from "~/components/requirment/modals/add-attachment-modal";
import EvaluateRequirementModal from "~/components/requirment/modals/evaluate-requirment-modal";
import {
  ProjectLocation,
  RequirementDetail,
  RequirementType,
} from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { notFound } from "next/navigation";
import ErrorMessage from "~/components/ui/error-message";

export default function RequirementDetailClient({
  requirement_id,
  typeList,
  locations,
}: {
  requirement_id: number;
  locations: ProjectLocation[];
  typeList?: RequirementType[];
}) {
  const endpoint = "/requirements/detail/" + encodeBase64({ requirement_id });
  const [showEditRequirementModal, setShowEditRequirementModal] =
    useState(false);
  const [showEditRequesterModal, setShowEditRequesterModal] = useState(false);
  const [showAddAttachmentModal, setShowAddAttachmentModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const {
    data: requirement,
    getData: getRequirement,
    errorData: errorRequired,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
  } = useApi<RequirementDetail>();
  const updateRequirement = async () => {
    await getRequirement(endpoint, "reload");
  };
  useEffect(() => {
    getRequirement(endpoint, "default");
  }, []);
  if (!requirement) {
    if (errorRequired)
      if (errorRequired.code == 404) notFound();
      else
        return ErrorMessage({
          isOpen: isErrorDialogOpen,
          onOpenChange: setIsErrorDialogOpen,
          errorData: errorRequired,
        });
    return <span className="loading loading-infinity loading-xl"></span>;
  } else {
    return (
      <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-6 bg-base-100 rounded-xl shadow mt-2">
        <div className="md:col-span-2 text-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            📝 Chi tiết Yêu cầu Người Dùng
          </h2>
        </div>

        <RequirementInfo
          info={{
            ...requirement,
            type:
              typeList?.find((type) => type.code == requirement.type)
                ?.display || requirement.type,
          }}
          onEdit={() => setShowEditRequirementModal(true)}
          onUpdate={async () => await updateRequirement()}
        />
        <RequesterInfo
          requester={requirement.requesters}
          location={
            locations.find(
              (local) => local.id == requirement.requesters.location_id
            )?.name
          }
          onEdit={() => setShowEditRequesterModal(true)}
        />
        <Attachments
          files={requirement.requirementFiles || []}
          onAdd={() => setShowAddAttachmentModal(true)}
        />
        <RequirmentLogs logs={requirement.requirementLogs || []} />
        <StatusTag
          onEvaluate={() => setShowEvaluateModal(true)}
          requirement_id={requirement.id}
        />

        {/* MODALS */}
        {showEditRequirementModal && (
          <EditRequirementModal
            requiredInfor={requirement}
            typeList={typeList || []}
            onClose={() => setShowEditRequirementModal(false)}
            onUpdate={updateRequirement}
          />
        )}
        {showEditRequesterModal && (
          <EditRequesterModal
            project_id={locations[0].project_id || 0}
            requiredInfor={requirement}
            onUpdate={updateRequirement}
            location={locations}
            onClose={() => setShowEditRequesterModal(false)}
          />
        )}
        {showAddAttachmentModal && (
          <AddAttachmentModal
            requirement_id={requirement_id}
            onUpdate={async () => await updateRequirement()}
            onClose={() => setShowAddAttachmentModal(false)}
          />
        )}
        {showEvaluateModal && (
          <EvaluateRequirementModal
            requirement_id={requirement.id}
            onClose={() => setShowEvaluateModal(false)}
          />
        )}
      </div>
    );
  }
}
