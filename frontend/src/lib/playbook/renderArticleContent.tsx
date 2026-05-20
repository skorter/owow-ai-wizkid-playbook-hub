import styles from "@/app/playbook/[slug]/page.module.css";

export function renderArticleContent(content: string) {
  const blocks = content.split(/\n\n+/).filter((block) => block.trim().length > 0);

  return blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const isList = lines.every((line) => /^[•\-*]\s/.test(line));

    if (isList && lines.length > 0) {
      return (
        <ul key={index} className={styles.bulletList}>
          {lines.map((line, lineIndex) => (
            <li key={lineIndex} className={styles.bulletItem}>
              {line.replace(/^[•\-*]\s+/, "")}
            </li>
          ))}
        </ul>
      );
    }

    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <p key={index} className={styles.lead}>
          {block.replace(/\*\*/g, "")}
        </p>
      );
    }

    return (
      <p key={index} className={styles.paragraph}>
        {block}
      </p>
    );
  });
}
