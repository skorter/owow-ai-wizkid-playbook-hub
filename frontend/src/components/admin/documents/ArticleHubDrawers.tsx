"use client";

import { useState } from "react";
import { AdminButton, AdminStatusBadge } from "@/components/admin";
import HubDrawer from "./HubDrawer";
import hubStyles from "./hub-ui.module.css";
import type { AdminDocument, DocumentStatus } from "@/data/adminMockData";
import type { ArticleCategoryOption } from "@/lib/mappers/articles";

export type ArticleFormState = {
  title: string;
  slug: string;
  categoryId: string;
  status: DocumentStatus;
  summary: string;
  content: string;
  author: string;
  linkedOnboarding: boolean;
};

const emptyForm = (categories: ArticleCategoryOption[]): ArticleFormState => ({
  title: "",
  slug: "",
  categoryId: categories[0]?.id ?? "",
  status: "Draft",
  summary: "",
  content: "",
  author: "",
  linkedOnboarding: false,
});

function docToForm(doc: AdminDocument): ArticleFormState {
  return {
    title: doc.title,
    slug: doc.slug,
    categoryId: doc.categoryId ?? "",
    status: doc.status,
    summary: doc.summary,
    content: doc.content,
    author: doc.author,
    linkedOnboarding: Boolean(doc.linkedOnboardingStep),
  };
}

type ArticleFormDrawerProps = {
  open: boolean;
  mode: "create" | "edit";
  initial?: AdminDocument | null;
  categories: ArticleCategoryOption[];
  saving?: boolean;
  onClose: () => void;
  onSaveDraft: (form: ArticleFormState) => void | Promise<void>;
  onPublish: (form: ArticleFormState) => void | Promise<void>;
  onArchive?: (form: ArticleFormState) => void | Promise<void>;
};

function resolveInitialForm(
  initial: AdminDocument | null | undefined,
  categories: ArticleCategoryOption[],
): ArticleFormState {
  return initial ? docToForm(initial) : emptyForm(categories);
}

type ArticleFormDrawerSessionProps = Omit<ArticleFormDrawerProps, "open">;

function ArticleFormDrawerSession({
  mode,
  initial,
  categories,
  saving = false,
  onClose,
  onSaveDraft,
  onPublish,
  onArchive,
}: ArticleFormDrawerSessionProps) {
  const [form, setForm] = useState<ArticleFormState>(() =>
    resolveInitialForm(initial, categories),
  );

  const set = (key: keyof ArticleFormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const footer =
    mode === "create" ? (
      <>
        <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </AdminButton>
        <AdminButton variant="secondary" onClick={() => onSaveDraft(form)} disabled={saving}>
          {saving ? "Saving…" : "Save Draft"}
        </AdminButton>
        <AdminButton variant="primary" onClick={() => onPublish(form)} disabled={saving}>
          {saving ? "Publishing…" : "Publish Article"}
        </AdminButton>
      </>
    ) : (
      <>
        <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </AdminButton>
        {onArchive ? (
          <AdminButton variant="secondary" onClick={() => onArchive(form)} disabled={saving}>
            Archive
          </AdminButton>
        ) : null}
        <AdminButton variant="primary" onClick={() => onPublish(form)} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </AdminButton>
      </>
    );

  return (
    <HubDrawer
      open
      title={mode === "create" ? "New Article" : "Edit Article"}
      subtitle={mode === "create" ? "Create knowledge base content" : initial?.title}
      onClose={onClose}
      footer={footer}
    >
      <ArticleFormFields form={form} set={set} categories={categories} />
    </HubDrawer>
  );
}

export function ArticleFormDrawer({
  open,
  mode,
  initial,
  categories,
  saving = false,
  onClose,
  onSaveDraft,
  onPublish,
  onArchive,
}: ArticleFormDrawerProps) {
  if (!open) {
    return null;
  }

  const formSessionKey = `${mode}-${initial?.id ?? "new"}`;

  return (
    <ArticleFormDrawerSession
      key={formSessionKey}
      mode={mode}
      initial={initial}
      categories={categories}
      saving={saving}
      onClose={onClose}
      onSaveDraft={onSaveDraft}
      onPublish={onPublish}
      onArchive={onArchive}
    />
  );
}

function ArticleFormFields({
  form,
  set,
  categories,
}: {
  form: ArticleFormState;
  set: (key: keyof ArticleFormState, value: string | boolean) => void;
  categories: ArticleCategoryOption[];
}) {
  return (
    <div className={hubStyles.formGrid}>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Title</span>
        <input
          className={hubStyles.fieldInput}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </label>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Slug</span>
        <input
          className={hubStyles.fieldInput}
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="time-off-policy"
        />
      </label>
      <div className={hubStyles.fieldRow2}>
        <label className={hubStyles.field}>
          <span className={hubStyles.fieldLabel}>Category</span>
          <select
            className={hubStyles.fieldSelect}
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            disabled={categories.length === 0}
          >
            {categories.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </label>
        <label className={hubStyles.field}>
          <span className={hubStyles.fieldLabel}>Status</span>
          <select
            className={hubStyles.fieldSelect}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </label>
      </div>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Summary</span>
        <textarea
          className={hubStyles.fieldTextarea}
          rows={3}
          value={form.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
      </label>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Content</span>
        <textarea
          className={hubStyles.fieldTextarea}
          rows={6}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
        />
      </label>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Author</span>
        <input
          className={hubStyles.fieldInput}
          value={form.author}
          onChange={(e) => set("author", e.target.value)}
        />
      </label>
      <label className={hubStyles.checkboxRow}>
        <input
          type="checkbox"
          checked={form.linkedOnboarding}
          onChange={(e) => set("linkedOnboarding", e.target.checked)}
        />
        <span className={hubStyles.checkboxLabel}>Link to onboarding step</span>
      </label>
    </div>
  );
}

type ArticlePreviewDrawerProps = {
  open: boolean;
  doc: AdminDocument | null;
  onClose: () => void;
  onEdit: () => void;
  onArchive: () => void;
};

export function ArticlePreviewDrawer({
  open,
  doc,
  onClose,
  onEdit,
  onArchive,
}: ArticlePreviewDrawerProps) {
  if (!doc) return null;

  const footer = (
    <>
      <AdminButton variant="secondary" onClick={onClose}>
        Close
      </AdminButton>
      <AdminButton variant="secondary" onClick={onArchive}>
        Archive
      </AdminButton>
      <AdminButton variant="primary" onClick={onEdit}>
        Edit
      </AdminButton>
    </>
  );

  return (
    <HubDrawer
      open={open}
      title={doc.title}
      subtitle={doc.slug}
      onClose={onClose}
      footer={footer}
    >
      <div className={hubStyles.metaRow}>
        <AdminStatusBadge color={doc.statusColor}>{doc.status}</AdminStatusBadge>
        <AdminStatusBadge color={doc.categoryColor}>{doc.category}</AdminStatusBadge>
      </div>
      <div className={hubStyles.metaGrid}>
        <MetaItem label="Author" value={doc.author} />
        <MetaItem label="Updated" value={doc.updatedAt} />
        <MetaItem label="Views" value={String(doc.views)} />
        <MetaItem label="Feedback" value={String(doc.feedbackCount)} />
      </div>
      <p className={hubStyles.previewSummary}>{doc.summary}</p>
      <p className={hubStyles.sectionLabel}>Content preview</p>
      <div className={hubStyles.previewBlock}>{doc.content}</div>
      {doc.linkedOnboardingStep ? (
        <>
          <p className={hubStyles.sectionLabel}>Linked onboarding</p>
          <p className={hubStyles.relatedItem}>{doc.linkedOnboardingStep}</p>
        </>
      ) : null}
      {doc.relatedMissingRequests && doc.relatedMissingRequests.length > 0 ? (
        <>
          <p className={hubStyles.sectionLabel}>Related missing requests</p>
          <ul className={hubStyles.relatedList}>
            {doc.relatedMissingRequests.map((r) => (
              <li key={r} className={hubStyles.relatedItem}>
                {r}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </HubDrawer>
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
