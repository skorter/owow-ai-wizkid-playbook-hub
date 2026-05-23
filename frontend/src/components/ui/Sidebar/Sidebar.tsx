"use client";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import Documents from "../Documents/Documents";
import Footer from "../Footer/Footer";

function readIsAdminFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("role") === "admin";
}

export default function Sidebar() {
  const [isAdmin] = useState(() => readIsAdminFromStorage());
  return (
    <aside
      className={`${styles.sidebar} ${isAdmin ? styles.admin : styles.user}`}
    >
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.navigation}>
        <Navigation />
      </div>
      {!isAdmin && (
        <div className={styles.documents}>
          <Documents />
        </div>
      )}
      <div className={styles.footer}>
        <Footer />
      </div>
    </aside>
  );
}
