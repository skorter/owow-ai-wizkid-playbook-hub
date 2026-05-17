"use client";
import { useState } from "react";

import styles from "./page.module.css";
import Identity from "./components/Identitiy/Identity";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import OnboardingProgress from "./components/OnboardingProgress/OnboardingProgress";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import SavedArticles from "./components/SavedArticles/SavedArticles";
import AISettings from "./components/AISettings/AISettings";
import AIInsights from "./components/AIInsights/AIInsights";
import SettingsGrid from "./components/SettingsGrid/SettingsGrid";
import EditInformationModal from "./components/EditInformationModal/EditInformationModal";
export default function ProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.profilePage}>
      <div className={styles.identity}>
        <Identity onEdit={() => setModalOpen(true)} />
      </div>
      <div className={styles.personalInformation}>
        <PersonalInformation />
      </div>
      <div className={styles.onboardingProgress}>
        <OnboardingProgress />
      </div>
      <div className={styles.recentActivity}>
        <RecentActivity />
      </div>
      <div className={styles.savedArticles}>
        <SavedArticles />
      </div>
      <div className={styles.aiSettings}>
        <AISettings />
      </div>
      <div className={styles.aiInsights}>
        <AIInsights />
      </div>
      <div className={styles.settingsGrid}>
        <SettingsGrid />
      </div>
      <EditInformationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          console.log("Updated data:", data);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
