"use client";
import { useState } from "react";

import styles from "./Sidebar.module.css";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Category } from "@/types/playbook";

export default function Sidebar() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (slug: string) => {
    setOpenItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const categories: Category[] = [
    {
      label: "OWOW General",
      slug: "owow-general",
      pages: [
        {
          label: "Welcome to OWOW",
          slug: "welcome-to-owow",
          subpages: [],
        },
        {
          label: "Mission, vision & our promise",
          slug: "mission-vision-our-promise",
          subpages: [
            {
              label: "Mission",
              slug: "mission",
            },
            {
              label: "Vision",
              slug: "vision",
            },
            {
              label: "Our promise",
              slug: "our-promise",
            },
          ],
        },
        {
          label: "Core values",
          slug: "core-values",
          subpages: [],
        },
        {
          label: "Our work culture & Way of working",
          slug: "our-work-culture-way-of-working",
          subpages: [
            {
              label: "Work culture",
              slug: "work-culture",
            },
            {
              label: "Way of working",
              slug: "way-of-working",
            },
          ],
        },
        {
          label: "Team structure & roles",
          slug: "team-structure-roles",
          subpages: [
            {
              label: "Team structure",
              slug: "team-structure",
            },
            {
              label: "Roles",
              slug: "roles",
            },
          ],
        },
        {
          label: "Our office",
          slug: "our-office",
          subpages: [],
        },
        {
          label: "Definitions",
          slug: "definitions",
          subpages: [],
        },
      ],
    },
    {
      label: "Practical Information",
      slug: "practical-information",
      pages: [
        {
          label: "Simplicate",
          slug: "simplicate",
          subpages: [],
        },
        {
          label: "Sickness and absence",
          slug: "sickness-and-absence",
          subpages: [
            {
              label: "Sickness",
              slug: "sickness",
            },
            {
              label: "Absence",
              slug: "absence",
            },
          ],
        },
        {
          label: "Holidays and leave",
          slug: "holidays-and-leave",
          subpages: [
            {
              label: "Holidays",
              slug: "holidays",
            },
            {
              label: "Leave",
              slug: "leave",
            },
          ],
        },
        {
          label: "Expenses and reimbursements",
          slug: "expenses-and-reimbursements",
          subpages: [
            {
              label: "Expenses",
              slug: "expenses",
            },
            {
              label: "Reimbursements",
              slug: "reimbursements",
            },
          ],
        },
        {
          label: "Pension scheme",
          slug: "pension-scheme",
          subpages: [],
        },
        {
          label: "Parenthood",
          slug: "parenthood",
          subpages: [],
        },
      ],
    },
    {
      label: "Growth and development",
      slug: "growth-and-development",
      pages: [
        {
          label: "Role description",
          slug: "role-description",
          subpages: [],
        },
        {
          label: "Salary structure",
          slug: "salary-structure",
          subpages: [],
        },
        {
          label: "Personal growth",
          slug: "personal-growth",
          subpages: [],
        },
        {
          label: "Dealing with clients",
          slug: "dealing-with-clients",
          subpages: [],
        },
        {
          label: "OWOW's online library",
          slug: "owows-online-library",
          subpages: [],
        },
      ],
    },
    {
      label: "Policy and conduct",
      slug: "policy-and-conduct",
      pages: [
        {
          label: "Inclusion, non-discrimination and equal treatment",
          slug: "inclusion-non-discrimination-equal-treatment",
          subpages: [
            {
              label: "Inclusion",
              slug: "inclusion",
            },
            {
              label: "Non-discrimination",
              slug: "non-discrimination",
            },
            { label: "Equal treatment", slug: "equal-treatment" },
          ],
        },
        {
          label: "Anti-harassment & reporting procedure",
          slug: "anti-harassment-reporting-procedure",
          subpages: [],
        },
        {
          label: "Wellbeing in the workplace",
          slug: "wellbeing-in-the-workplace",
          subpages: [],
        },
        {
          label: "Complaint process & conflict mediation",
          slug: "complaint-process-conflict-mediation",
          subpages: [
            {
              label: "Complaint process",
              slug: "complaint-process",
            },
            {
              label: "Conflict mediation",
              slug: "conflict-mediation",
            },
          ],
        },
        {
          label: "Confident advisor",
          slug: "confident-advisor",
          subpages: [],
        },
        {
          label: "Disciplinary policy / Exit",
          slug: "disciplinary-policy-exit",
          subpages: [
            {
              label: "Disciplinary policy",
              slug: "disciplinary-policy",
            },
            {
              label: "Exit",
              slug: "exit",
            },
          ],
        },
      ],
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <section className={styles.navigation}>
        <Link href="/" className={styles.link}>
          Home
        </Link>
        <Link href="/search" className={styles.link}>
          AI Search
        </Link>
        <Link href="/grid" className={styles.link}>
          All Topics
        </Link>
        <Link href="/about" className={styles.link}>
          Onboarding
        </Link>
      </section>
      <section className={styles.documents}>
        {categories.map((category) => (
          <div key={category.slug} className={styles.category}>
            <button
              className={styles.categoryButton}
              onClick={() => toggleItem(category.slug)}
            >
              {category.label}
              {openItems.includes(category.slug) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openItems.includes(category.slug) && (
              <div className={styles.pages}>
                {category.pages.map((page) => (
                  <div key={page.slug}>
                    {page.subpages.length > 0 ? (
                      <button
                        className={styles.pageButton}
                        onClick={() =>
                          toggleItem(`${category.slug}__${page.slug}`)
                        }
                      >
                        {page.label}
                        {openItems.includes(
                          `${category.slug}__${page.slug}`,
                        ) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
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
      </section>
    </aside>
  );
}
