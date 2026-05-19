"use client";

import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin";
import HubModal from "./HubModal";
import hubStyles from "./hub-ui.module.css";
import { categoryColorOptions } from "@/data/adminMockData";
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

type CategoryFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: CategoryFormState) => void;
};

export default function CategoryFormModal({ open, onClose, onSubmit }: CategoryFormModalProps) {
  const [form, setForm] = useState<CategoryFormState>(defaultForm);

  useEffect(() => {
    if (open) setForm(defaultForm());
  }, [open]);

  const selectColor = (color: AdminBadgeColor, hex: string) =>
    setForm((prev) => ({ ...prev, color, accentHex: hex }));

  const footer = (
    <>
      <AdminButton variant="secondary" onClick={onClose}>
        Cancel
      </AdminButton>
      <AdminButton variant="primary" onClick={() => onSubmit(form)}>
        Create Category
      </AdminButton>
    </>
  );

  return (
    <HubModal
      open={open}
      title="New Category"
      subtitle="Organize articles with a colored category"
      onClose={onClose}
      footer={footer}
    >
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
    </HubModal>
  );
}
