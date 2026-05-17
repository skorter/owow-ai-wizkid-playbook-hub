import styles from "./page.module.css";
import { categories } from "@/lib/data/categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import BackButton from "./components/BackButton/BackButton";

type SlugPageProps = {
  params: {
    slug: string;
  };
  searchParams: { from?: string };
};

export default async function SlugPage({
  params,
  searchParams,
}: SlugPageProps) {
  const { slug } = await params;
  const { from } = await searchParams;

  // find the article with the matching slug from all categories
  const allPages = categories.flatMap((category) => category.pages);
  const page = allPages.find((page) => page.slug === slug);

  // find the subpage with the matching slug from all categories
  const allSubpages = categories.flatMap((category) =>
    category.pages.flatMap((page) => page.subpages),
  );
  const subpage = allSubpages.find((subpage) => subpage.slug === slug);

  // if no page or subpage is found, return a 404 page
  if (!page && !subpage) {
    notFound();
  }

  // if a page is found, use it; otherwise, use the subpage
  const article = page || subpage;

  return (
    <div className={styles.slugPage}>
      {from === "topics" ? (
        <Link href="/playbook/topics" className={styles.back}>
          ← Back to Topics
        </Link>
      ) : (
        <BackButton />
      )}
      <h1 className={styles.title}>{article?.label}</h1>
      {page?.description && (
        <p className={styles.description}>{page.description}</p>
      )}
      {page?.subpages && page.subpages.length > 0 && (
        <div className={styles.subpages}>
          <h2 className={styles.subpagesTitle}>Subtopics</h2>
          <ul className={styles.subpagesList}>
            {page.subpages.map((sub) => (
              <Link
                key={sub.slug}
                href={`/playbook/${sub.slug}${from ? `?from=${from}` : ""}`}
                className={styles.subpage}
              >
                {sub.label}
              </Link>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.content}>
        <p className={styles.placeholder}>
          Content coming soon — this article will be loaded from Jira once the
          backend is connected.
        </p>
      </div>
      {from === "onboarding" &&
        (!page?.subpages || page.subpages.length === 0) && (
          <button className={styles.completeButton}>Mark as complete ✓</button>
        )}
    </div>
  );
}
