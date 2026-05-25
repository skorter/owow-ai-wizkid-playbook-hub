"use client";

import { useEffect, useState } from "react";
import styles from "./Documents.module.css";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchPlaybookTopics } from "@/lib/mappers/playbook";
import type { Category } from "@/types/playbook";

export default function Documents() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchPlaybookTopics();
        if (cancelled) return;
        setCategories(result.categories);
        setOpenItems(result.categories.slice(0, 2).map((c) => c.slug));
        setLoadState("ready");
      } catch {
        if (!cancelled) setLoadState("error");
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleItem = (slug: string) => {
    setOpenItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  if (loadState === "loading") {
    return (
      <aside className={styles.documents}>
        <p className={styles.status}>Loading topics…</p>
      </aside>
    );
  }

  if (loadState === "error" || categories.length === 0) {
    return (
      <aside className={styles.documents}>
        <p className={styles.status}>
          {loadState === "error"
            ? "Could not load topics."
            : "No published topics yet."}
        </p>
      </aside>
    );
  }

  return (
    <aside className={styles.documents}>
      <div className={styles.scrollArea}>
        {categories.map((category) => (
          <div key={category.slug} className={styles.category}>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => toggleItem(category.slug)}
            >
              <span className={styles.toggleLabel}>{category.label}</span>
              {openItems.includes(category.slug) ? (
                <ChevronDown className={styles.chevronIcon} aria-hidden />
              ) : (
                <ChevronRight className={styles.chevronIcon} aria-hidden />
              )}
            </button>

            {openItems.includes(category.slug) ? (
              <div className={styles.pages}>
                {category.pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/playbook/${page.slug}`}
                    className={`${styles.link} ${
                      pathname === `/playbook/${page.slug}` ? styles.linkActive : ""
                    }`}
                    title={page.label}
                  >
                    {page.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}
