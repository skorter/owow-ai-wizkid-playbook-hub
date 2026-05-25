import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import "../admin-tokens.css";
import styles from "./AdminButton.module.css";

type AdminButtonBaseProps = {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

type AdminButtonAsButton = AdminButtonBaseProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

type AdminButtonAsLink = AdminButtonBaseProps & {
  href: string;
  type?: never;
  onClick?: never;
};

export type AdminButtonProps = AdminButtonAsButton | AdminButtonAsLink;

export default function AdminButton(props: AdminButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    children,
    className,
    disabled,
  } = props;

  const classes = [
    styles.button,
    variant === "primary" ? styles.primary : styles.secondary,
    size === "sm" ? styles.sm : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {Icon && iconPosition === "left" ? <Icon className={styles.icon} aria-hidden /> : null}
      <span>{children}</span>
      {Icon && iconPosition === "right" ? <Icon className={styles.icon} aria-hidden /> : null}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={props.onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
