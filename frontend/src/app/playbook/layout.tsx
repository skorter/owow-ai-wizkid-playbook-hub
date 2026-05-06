"use client";
import { useState } from "react";

import styles from "./layout.module.css";
import Header from "@/components/ui/Header/Header";
import Footer from "@/components/ui/Footer/Footer";
import Sidebar from "@/components/ui/Sidebar/Sidebar";

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.playbookLayout}>
      <Header isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={styles.main}>
        {isSidebarOpen && <Sidebar />}
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
