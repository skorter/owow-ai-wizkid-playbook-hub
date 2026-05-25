"use client";

import { AdminButton, AdminStatusBadge } from "@/components/admin";
import HubModal from "./HubModal";
import hubStyles from "./hub-ui.module.css";
import type { AdminOnboardingStep } from "@/lib/mappers/onboarding";

type OnboardingPreviewModalProps = {
  open: boolean;
  step: AdminOnboardingStep | null;
  onClose: () => void;
  onEdit: () => void;
};

export default function OnboardingPreviewModal({
  open,
  step,
  onClose,
  onEdit,
}: OnboardingPreviewModalProps) {
  if (!open || !step) {
    return null;
  }

  const footer = (
    <>
      <AdminButton variant="secondary" onClick={onClose}>
        Close
      </AdminButton>
      <AdminButton variant="primary" onClick={onEdit}>
        Edit
      </AdminButton>
    </>
  );

  return (
    <HubModal open title={step.title} subtitle={`Step #${step.order}`} onClose={onClose} footer={footer}>
      <div className={hubStyles.metaRow}>
        <AdminStatusBadge color={step.status === "Active" ? "green" : "gray"}>
          {step.status}
        </AdminStatusBadge>
      </div>
      <div className={hubStyles.metaGrid}>
        <MetaItem label="Order" value={`#${step.order}`} />
        <MetaItem label="Updated" value={step.updatedAt} />
        <MetaItem label="Linked article" value={step.linkedArticle} />
      </div>
      <p className={hubStyles.sectionLabel}>Step content</p>
      <div className={hubStyles.previewBlock}>{step.content}</div>
    </HubModal>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={hubStyles.metaItem}>
      <span className={hubStyles.metaItemLabel}>{label}</span>
      <span className={hubStyles.metaItemValue}>{value}</span>
    </div>
  );
}
