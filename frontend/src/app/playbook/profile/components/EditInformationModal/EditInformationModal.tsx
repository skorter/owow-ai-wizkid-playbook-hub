"use client";

import { useState } from "react";
import styles from "./EditInformationModal.module.css";
import { updateCurrentUserProfile } from "@/lib/mappers/profile";
import { getRoleDisplayLabel } from "@/lib/auth/session";
import type { SessionUser } from "@/types/auth";
import { ApiError } from "@/lib/api";

type EditInformationModalProps = {
  isOpen: boolean;
  user: SessionUser | null;
  onClose: () => void;
  onSaved: (user: SessionUser) => void;
};

type EditFormProps = {
  user: SessionUser;
  onClose: () => void;
  onSaved: (user: SessionUser) => void;
};

function EditInformationForm({ user, onClose, onSaved }: EditFormProps) {
  const [fullName, setFullName] = useState(user.fullName?.trim() ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      const updated = await updateCurrentUserProfile({
        fullName: fullName.trim(),
      });
      onSaved({
        id: updated.id,
        email: updated.email,
        fullName: updated.fullName,
        role: updated.role,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not save profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 className={styles.title}>Edit Profile</h2>
        <p className={styles.subtitle}>
          Update your display name. Department and job title are managed by HR.
        </p>
      </div>
      <div className={styles.editGrid}>
        <div className={styles.field}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`${styles.input} ${styles.inputDisabled}`}
            value={user.email}
            readOnly
            disabled
          />
          <span className={styles.hint}>Email cannot be changed here.</span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Department</label>
          <input
            type="text"
            className={`${styles.input} ${styles.inputDisabled}`}
            value="Not available"
            readOnly
            disabled
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Role</label>
          <input
            type="text"
            className={`${styles.input} ${styles.inputDisabled}`}
            value={getRoleDisplayLabel(user.role)}
            readOnly
            disabled
          />
        </div>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles.submitButton}
          onClick={() => void handleSubmit()}
          disabled={saving || !fullName.trim()}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default function EditInformationModal({
  isOpen,
  user,
  onClose,
  onSaved,
}: EditInformationModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className={styles.modal}>
      <EditInformationForm
        key={user.id}
        user={user}
        onClose={onClose}
        onSaved={onSaved}
      />
    </div>
  );
}
