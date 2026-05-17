import Image from "next/image";
import styles from "./Greeting.module.css";
import { user } from "@/lib/data/user";

export default function Greeting() {
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
        Good evening, <span className={styles.name}>{user.firstName}</span>
      </h1>
    </div>
  );
}
