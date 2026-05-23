"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { AdminButton } from "@/components/admin";
import HubModal from "./HubModal";
import hubStyles from "./hub-ui.module.css";
import type { AdminOnboardingStep } from "@/lib/mappers/onboarding";

export type OnboardingFormState = {
  title: string;
  content: string;
  order: string;
  status: "Active" | "Inactive";
  articleIds: string[];
};

export type ArticleLinkOption = {
  id: string;
  title: string;
};

const defaultForm = (nextOrder: number): OnboardingFormState => ({
  title: "",
  content: "",
  order: String(nextOrder),
  status: "Active",
  articleIds: [],
});

function stepToForm(step: AdminOnboardingStep): OnboardingFormState {
  return {
    title: step.title,
    content: step.content,
    order: String(step.order),
    status: step.status,
    articleIds: [...step.articleIds],
  };
}

function toggleArticleId(ids: string[], articleId: string): string[] {
  return ids.includes(articleId)
    ? ids.filter((id) => id !== articleId)
    : [...ids, articleId];
}

type OnboardingFormModalSessionProps = {
  mode: "create" | "edit";
  initial?: AdminOnboardingStep | null;
  nextOrder: number;
  articleOptions: ArticleLinkOption[];
  saving?: boolean;
  onClose: () => void;
  onSubmit: (form: OnboardingFormState) => void | Promise<void>;
};

function OnboardingFormModalSession({
  mode,
  initial,
  nextOrder,
  articleOptions,
  saving = false,
  onClose,
  onSubmit,
}: OnboardingFormModalSessionProps) {
  const [form, setForm] = useState<OnboardingFormState>(() =>
    mode === "edit" && initial ? stepToForm(initial) : defaultForm(nextOrder),
  );

  const footer = (
    <>
      <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
        Cancel
      </AdminButton>
      <AdminButton variant="primary" onClick={() => onSubmit(form)} disabled={saving}>
        {saving
          ? mode === "edit"
            ? "Saving…"
            : "Creating…"
          : mode === "edit"
            ? "Save Changes"
            : "Create Step"}
      </AdminButton>
    </>
  );

  return (
    <HubModal
      open
      title={mode === "create" ? "New Onboarding Step" : "Edit Onboarding Step"}
      subtitle={mode === "create" ? "Add a step to the employee onboarding flow" : initial?.title}
      onClose={onClose}
      footer={footer}
    >
      <OnboardingFormFields
        form={form}
        setForm={setForm}
        articleOptions={articleOptions}
      />
    </HubModal>
  );
}

function OnboardingFormFields({
  form,
  setForm,
  articleOptions,
}: {
  form: OnboardingFormState;
  setForm: Dispatch<SetStateAction<OnboardingFormState>>;
  articleOptions: ArticleLinkOption[];
}) {
  return (
    <div className={hubStyles.formGrid}>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Title</span>
        <input
          className={hubStyles.fieldInput}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />
      </label>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Order</span>
        <input
          className={hubStyles.fieldInput}
          type="number"
          min={1}
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
        />
      </label>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Status</span>
        <select
          className={hubStyles.fieldSelect}
          value={form.status}
          onChange={(e) =>
            setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>
      <div className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>
          Linked articles ({form.articleIds.length} selected)
        </span>
        {articleOptions.length === 0 ? (
          <p className={hubStyles.importHelp}>No published articles available to link.</p>
        ) : (
          <ul className={hubStyles.articleChecklist}>
            {articleOptions.map((article) => {
              const checked = form.articleIds.includes(article.id);
              return (
                <li key={article.id}>
                  <label className={hubStyles.articleCheckItem}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setForm((p) => ({
                          ...p,
                          articleIds: toggleArticleId(p.articleIds, article.id),
                        }))
                      }
                    />
                    <span>{article.title}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Content</span>
        <textarea
          className={hubStyles.fieldTextarea}
          rows={6}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
        />
      </label>
    </div>
  );
}

type OnboardingFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initial?: AdminOnboardingStep | null;
  nextOrder: number;
  articleOptions: ArticleLinkOption[];
  saving?: boolean;
  onClose: () => void;
  onSubmit: (form: OnboardingFormState) => void | Promise<void>;
};

export default function OnboardingFormModal({
  open,
  mode,
  initial,
  nextOrder,
  articleOptions,
  saving = false,
  onClose,
  onSubmit,
}: OnboardingFormModalProps) {
  if (!open) {
    return null;
  }

  const sessionKey = `${mode}-${initial?.id ?? "new"}`;

  return (
    <OnboardingFormModalSession
      key={sessionKey}
      mode={mode}
      initial={initial}
      nextOrder={nextOrder}
      articleOptions={articleOptions}
      saving={saving}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
