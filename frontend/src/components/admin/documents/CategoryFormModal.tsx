"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { AdminButton } from "@/components/admin";
import HubModal from "./HubModal";
import hubStyles from "./hub-ui.module.css";
import { categoryColorOptions } from "@/data/adminMockData";
import type { ContentCategory } from "@/data/adminMockData";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";

export type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  color: AdminBadgeColor;
  accentHex: string;
  visibility: "Active" | "Inactive";
};

const defaultForm = (): CategoryFormState => ({
  name: "",
  slug: "",
  description: "",
  color: "yellow",
  accentHex: "#ffd500",
  visibility: "Active",
});

function categoryToForm(category: ContentCategory): CategoryFormState {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    color: category.color,
    accentHex: category.accentHex,
    visibility: category.status,
  };
}

type CategoryFormModalSessionProps = {
  mode: "create" | "edit";
  initial?: ContentCategory | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (form: CategoryFormState) => void | Promise<void>;
};

function CategoryFormModalSession({
  mode,
  initial,
  saving = false,
  onClose,
  onSubmit,
}: CategoryFormModalSessionProps) {
  const [form, setForm] = useState<CategoryFormState>(() =>
    mode === "edit" && initial ? categoryToForm(initial) : defaultForm(),
  );

  const selectColor = (color: AdminBadgeColor, hex: string) =>
    setForm((prev) => ({ ...prev, color, accentHex: hex }));

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
            : "Create Category"}
      </AdminButton>
    </>
  );

  return (
    <HubModal
      open
      title={mode === "create" ? "New Category" : "Edit Category"}
      subtitle={
        mode === "create" ? "Organize articles with a colored category" : initial?.name
      }
      onClose={onClose}
      footer={footer}
    >
      <CategoryFormFields form={form} setForm={setForm} selectColor={selectColor} />
    </HubModal>
  );
}

function CategoryFormFields({
  form,
  setForm,
  selectColor,
}: {
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
  selectColor: (color: AdminBadgeColor, hex: string) => void;
}) {
  return (
    <div className={hubStyles.formGrid}>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Name</span>
        <input
          className={hubStyles.fieldInput}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
      </label>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Slug</span>
        <input
          className={hubStyles.fieldInput}
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="hr"
        />
      </label>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Description</span>
        <textarea
          className={hubStyles.fieldTextarea}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />
      </label>
      <div className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Accent color</span>
        <div className={hubStyles.colorSwatches}>
          {categoryColorOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${hubStyles.colorSwatch} ${form.color === opt.value ? hubStyles.colorSwatchActive : ""}`}
              style={{ backgroundColor: opt.hex }}
              onClick={() => selectColor(opt.value, opt.hex)}
              aria-label={opt.label}
            />
          ))}
        </div>
        <div className={hubStyles.colorPreview}>
          <span className={hubStyles.colorPreviewDot} style={{ backgroundColor: form.accentHex }} />
          <span className={hubStyles.colorPreviewText}>{form.name || "Category preview"}</span>
        </div>
      </div>
      <label className={hubStyles.field}>
        <span className={hubStyles.fieldLabel}>Visibility</span>
        <select
          className={hubStyles.fieldSelect}
          value={form.visibility}
          onChange={(e) =>
            setForm((p) => ({ ...p, visibility: e.target.value as "Active" | "Inactive" }))
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>
    </div>
  );
}

type CategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initial?: ContentCategory | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (form: CategoryFormState) => void | Promise<void>;
};

export default function CategoryFormModal({
  open,
  mode,
  initial,
  saving = false,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  if (!open) {
    return null;
  }

  const sessionKey = `${mode}-${initial?.id ?? "new"}`;

  return (
    <CategoryFormModalSession
      key={sessionKey}
      mode={mode}
      initial={initial}
      saving={saving}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
