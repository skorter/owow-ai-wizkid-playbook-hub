"use client";
import { useState } from "react";
import styles from "./Documents.module.css";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data/categories";

export default function Documents() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (slug: string) => {
    setOpenItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <aside className={styles.documents}>
      {categories.map((category) => (
        <div key={category.slug} className={styles.category}>
          <button
            className={styles.toggle}
            onClick={() => toggleItem(category.slug)}
          >
            {category.label}
            {openItems.includes(category.slug) ? (
              <ChevronDown className={styles.chevronDownIcon} />
            ) : (
              <ChevronRight className={styles.chevronRightIcon} />
            )}
          </button>

          {openItems.includes(category.slug) && (
            <div className={styles.pages}>
              {category.pages.map((page) => (
                <div key={page.slug}>
                  {page.subpages.length > 0 ? (
                    <button
                      className={styles.toggle}
                      onClick={() =>
                        toggleItem(`${category.slug}__${page.slug}`)
                      }
                    >
                      {page.label}
                      {openItems.includes(`${category.slug}__${page.slug}`) ? (
                        <ChevronDown className={styles.chevronDownIcon} />
                      ) : (
                        <ChevronRight className={styles.chevronRightIcon} />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={`/playbook/${page.slug}`}
                      className={styles.link}
                    >
                      {page.label}
                    </Link>
                  )}

                  {openItems.includes(`${category.slug}__${page.slug}`) && (
                    <div className={styles.subpages}>
                      {page.subpages.map((subpage) => (
                        <Link
                          key={subpage.slug}
                          href={`/playbook/${subpage.slug}`}
                          className={styles.subpageLink}
                        >
                          {subpage.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
