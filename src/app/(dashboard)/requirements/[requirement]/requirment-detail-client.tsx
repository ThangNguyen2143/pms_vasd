"use client";
import React, { useState } from "react";
import Attachments from "~/components/requirment/attachments";
import EditRequirementModal from "~/components/requirment/modals/edit-requirment-modal";
import RequirementInfo from "~/components/requirment/requirment-info";
import RequirmentLogs from "~/components/requirment/requirment-logs";
import RequesterInfo from "~/components/requirment/requester-info";
import StatusTag from "~/components/requirment/status-tag-requirment";
import EditRequesterModal from "~/components/requirment/modals/edit-requester-modal";
import AddAttachmentModal from "~/components/requirment/modals/add-attachment-modal";
import EvaluateRequirementModal from "~/components/requirment/modals/evaluate-requirment-modal";
import { RequirementDetail } from "~/lib/types";

export default function RequirementDetailClient({
  requirement,
}: {
  requirement: RequirementDetail;
}) {
  const [showEditRequirementModal, setShowEditRequirementModal] =
    useState(false);
  const [showEditRequesterModal, setShowEditRequesterModal] = useState(false);
  const [showAddAttachmentModal, setShowAddAttachmentModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const requirementInfo = {
    title: requirement.title,
    description: requirement.description,
    priority: requirement.priority,
    date_create: requirement.date_create,
    date_receive: requirement.date_receive,
    date_end: requirement.date_end,
    tags: requirement.tags,
  };
  return (
    <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-6 bg-base-100 rounded-xl shadow mt-2">
      <div className="md:col-span-2 text-center mb-4">
        <h2 className="text-2xl font-bold text-primary">
          📝 Chi tiết Yêu cầu Người Dùng
        </h2>
      </div>

      <RequirementInfo
        info={requirementInfo}
        onEdit={() => setShowEditRequirementModal(true)}
      />
      <RequesterInfo
        requester={requirement.requesters}
        onEdit={() => setShowEditRequesterModal(true)}
      />
      <Attachments
        files={requirement.requirementFiles || []}
        onAdd={() => setShowAddAttachmentModal(true)}
      />
      <RequirmentLogs logs={requirement.requirementLogs || []} />
      <StatusTag
        status={requirement.status}
        onEvaluate={() => setShowEvaluateModal(true)}
      />

      {/* MODALS */}
      {showEditRequirementModal && (
        <EditRequirementModal
          onClose={() => setShowEditRequirementModal(false)}
        />
      )}
      {showEditRequesterModal && (
        <EditRequesterModal onClose={() => setShowEditRequesterModal(false)} />
      )}
      {showAddAttachmentModal && (
        <AddAttachmentModal onClose={() => setShowAddAttachmentModal(false)} />
      )}
      {showEvaluateModal && (
        <EvaluateRequirementModal onClose={() => setShowEvaluateModal(false)} />
      )}
    </div>
  );
}
