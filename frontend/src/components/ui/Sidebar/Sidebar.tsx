"use client";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import Documents from "../Documents/Documents";
import Footer from "../Footer/Footer";

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);
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
