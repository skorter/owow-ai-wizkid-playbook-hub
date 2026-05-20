"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.css";

type BackButtonProps = {
  href: string;
  label: string;
};

export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <Link href={href} className={styles.backButton}>
      <ArrowLeft size={18} aria-hidden />
      <span>{label}</span>
    </Link>
  );
}
