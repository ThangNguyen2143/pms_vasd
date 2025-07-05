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
  RequirementNote,
  RequirementType,
} from "~/lib/types";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { notFound } from "next/navigation";
import ErrorMessage from "~/components/ui/error-message";
import NoteRequirment from "~/components/requirment/requirement-detail/note-requirement";
import { toast } from "sonner";
interface DataRating {
  code: string;
  name: string;
  date: string;
  items: {
    criteria_code: string;
    criteria_title: string;
    selected_value: number;
    weight: number;
  }[];
}
export default function RequirementDetailClient({
  requirement_id,
  typeList,
  project_id,
  locations,
}: {
  requirement_id: number;
  project_id: number;
  locations: ProjectLocation[];
  typeList?: RequirementType[];
}) {
  const endpoint = "/requirements/detail/" + encodeBase64({ requirement_id });
  const [showEditRequirementModal, setShowEditRequirementModal] =
    useState(false);
  const [showEditRequesterModal, setShowEditRequesterModal] = useState(false);
  const [showAddAttachmentModal, setShowAddAttachmentModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const { data: RatingData, getData } = useApi<DataRating[]>();
  const reloadAssessment = async () => {
    await getData(
      "/requirements/assessment/" + encodeBase64({ requirement_id }),
      "reload"
    );
  };

  const {
    data: requirement,
    getData: getRequirement,
    errorData: errorRequired,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
  } = useApi<RequirementDetail>();
  const {
    data: note_requirment,
    getData: getNote,
    errorData: errorNote,
  } = useApi<RequirementNote[]>();
  const updateRequirement = async () => {
    await getRequirement(endpoint, "reload");
  };
  const updateNote = async () => {
    await getNote(
      "/requirements/note/" + encodeBase64({ requirement_id }),
      "reload"
    );
  };
  useEffect(() => {
    getRequirement(endpoint, "default");
    getNote(
      "/requirements/note/" + encodeBase64({ requirement_id }),
      "default"
    );
    reloadAssessment();
  }, []);
  if (errorNote)
    if (errorNote.code != 404)
      toast.error(errorNote.message || errorNote.title);
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
      <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="w-full text-center mb-4 md:hidden">
          <h2 className="text-2xl font-bold text-primary">
            📝 Chi tiết Yêu cầu Người Dùng
          </h2>
        </div>
        <div className="flex flex-1 flex-col gap-6 min-w-0">
          <div className="hidden md:block">
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
          <StatusTag
            onEvaluate={() => setShowEvaluateModal(true)}
            data={RatingData || undefined}
          />
          <NoteRequirment
            comments={note_requirment || []}
            project_id={project_id}
            onUpdate={updateNote}
            requirement_id={requirement_id}
          />
        </div>
        <div className="flex w-full md:w-1/3 flex-col gap-6">
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
            onUpdate={async () => await updateRequirement()}
            requirement_id={requirement.id}
            files={requirement.requirementFiles || []}
            onAdd={() => setShowAddAttachmentModal(true)}
          />
          <RequirmentLogs logs={requirement.requirementLogs || []} />
        </div>

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
            onUpdate={reloadAssessment}
            onClose={() => setShowEvaluateModal(false)}
          />
        )}
      </div>
    );
  }
}
