"use client";
import { useState } from "react";
import styles from "./EditInformationModal.module.css";
import { user } from "@/lib/data/user";

type EditInformationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    email: string;
    department: string;
    role: string;
  }) => void;
};

export default function EditInformationModal({
  isOpen,
  onClose,
  onSubmit,
}: EditInformationModalProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [department, setDepartment] = useState(user.department);
  const [role, setRole] = useState(user.role);

  if (!isOpen) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Profile</h2>
          <p className={styles.subtitle}>
            Update your personal information below.
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
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="department" className={styles.label}>
              Department
            </label>
            <input
              type="text"
              id="department"
              className={styles.input}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="role" className={styles.label}>
              Role
            </label>
            <input
              type="text"
              id="role"
              className={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.submit}
            onClick={() => onSubmit({ fullName, email, department, role })}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
