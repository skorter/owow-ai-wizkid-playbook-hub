"use client";

import Image from "next/image";
import styles from "./Greeting.module.css";
import { getTimeOfDayGreeting } from "@/lib/getTimeOfDayGreeting";
import { getDisplayFirstName, usePlaybookSession } from "@/lib/hooks/usePlaybookSession";

export default function Greeting() {
  const user = usePlaybookSession();
  const firstName = getDisplayFirstName(user);
  const greeting = getTimeOfDayGreeting();

  return (
    <div className={styles.greeting}>
      <Image
        src="/images/owow-smile.png"
        alt="User Avatar"
        width={48}
        height={48}
        className={styles.avatar}
      />
      <h1 className={styles.label}>
        {greeting}, <span className={styles.name}>{firstName}</span>
      </h1>
    </div>
  );
}
