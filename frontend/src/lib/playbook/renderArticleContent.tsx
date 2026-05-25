import styles from "@/app/playbook/[slug]/page.module.css";

function isBulletLine(line: string): boolean {
  return /^[•\-*]\s/.test(line);
}

function parseHeading(block: string): { level: 1 | 2 | 3; text: string } | null {
  const match = block.match(/^(#{1,3})\s+(.+)$/);
  if (!match) return null;
  return {
    level: match[1].length as 1 | 2 | 3,
    text: match[2].trim(),
  };
}

export function renderArticleContent(content: string) {
  const blocks = content.split(/\n\n+/).filter((block) => block.trim().length > 0);

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    const heading = parseHeading(trimmed);

    if (heading) {
      const Tag = heading.level === 1 ? "h2" : heading.level === 2 ? "h3" : "h4";
      const className =
        heading.level === 1
          ? styles.contentHeading1
          : heading.level === 2
            ? styles.contentHeading2
            : styles.contentHeading3;
      return (
        <Tag key={index} className={className}>
          {heading.text}
        </Tag>
      );
    }

    const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
    const isList = lines.length > 0 && lines.every(isBulletLine);

    if (isList) {
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

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <p key={index} className={styles.lead}>
          {trimmed.replace(/\*\*/g, "")}
        </p>
      );
    }

    if (lines.length > 1) {
      return (
        <div key={index} className={styles.paragraphGroup}>
          {lines.map((line, lineIndex) => (
            <p key={lineIndex} className={styles.paragraph}>
              {line}
            </p>
          ))}
        </div>
      );
    }

    return (
      <p key={index} className={styles.paragraph}>
        {trimmed}
      </p>
    );
  });
}
