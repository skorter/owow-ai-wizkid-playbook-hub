import styles from "./page.module.css";
import Identity from "./components/Identitiy/Identity";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import OnboardingProgress from "./components/OnboardingProgress/OnboardingProgress";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import SavedArticles from "./components/SavedArticles/SavedArticles";
import AISettings from "./components/AISettings/AISettings";
import AIInsights from "./components/AIInsights/AIInsights";
import SettingsGrid from "./components/SettingsGrid/SettingsGrid";
export default function ProfilePage() {
  return (
    <div className={styles.profilePage}>
      <Identity />
      <PersonalInformation />
      <OnboardingProgress />
      <RecentActivity />
      <SavedArticles />
      <AISettings />
      <AIInsights />
      <SettingsGrid />
    </div>
  );
}
