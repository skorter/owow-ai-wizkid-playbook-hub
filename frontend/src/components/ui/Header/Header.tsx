"use client";
import styles from "./Header.module.css";
import {
  PanelLeft,
  Menu,
  Search,
  ArrowLeft,
  ArrowRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type HeaderProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const iconSize = 22;
  const iconColor = "#000000";
  const iconStrokeWidth = 2.5;
  const userIconSize = 20;
  const userStrokeWidth = 2.5;

  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <p className={styles.logo}>
          OWOW<span className={styles.registered}>&reg;</span>
        </p>
        <nav className={styles.navButtons}>
          <button
            className={`${styles.sidebarToggleButton} ${isOpen ? styles.open : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <PanelLeft
                size={iconSize}
                color={iconColor}
                strokeWidth={iconStrokeWidth}
              />
            ) : (
              <Menu
                size={iconSize}
                color={iconColor}
                strokeWidth={iconStrokeWidth}
              />
            )}
          </button>
        </nav>
      </div>

      <h1 className={styles.title}>Wizkid Playbook Helper</h1>

      <Link
        href="/profile"
        className={styles.profile}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          <>
            <User
              size={userIconSize}
              color={iconColor}
              strokeWidth={userStrokeWidth}
            />
            <p className={styles.profileName}>
              Hello, <span>WizKid</span>
            </p>
          </>
        ) : (
          <User
            size={userIconSize}
            color={iconColor}
            strokeWidth={userStrokeWidth}
          />
        )}
      </Link>
    </header>
  );
}
