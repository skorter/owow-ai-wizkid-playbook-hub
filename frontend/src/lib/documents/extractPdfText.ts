type TextItemLike = { str?: string; hasEOL?: boolean };

function configurePdfWorker(
  pdfjs: typeof import("pdfjs-dist"),
): void {
  if (typeof window === "undefined") return;

  const version = pdfjs.version ?? "4.10.38";
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

function textFromPageItems(items: TextItemLike[]): string {
  let line = "";
  const lines: string[] = [];

  for (const item of items) {
    const chunk = item.str ?? "";
    if (!chunk) continue;

    line += chunk;

    if (item.hasEOL) {
      lines.push(line.trim());
      line = "";
    } else {
      line += " ";
    }
  }

  if (line.trim()) lines.push(line.trim());
  return lines.join("\n");
}

export async function extractPdfText(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PDF extraction is only available in the browser.");
  }

  const pdfjs = await import("pdfjs-dist");
  configurePdfWorker(pdfjs);

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;

  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textFromPageItems(textContent.items as TextItemLike[]);
    if (pageText.trim()) {
      pageTexts.push(pageText.trim());
    }
  }

  return pageTexts.join("\n\n").trim();
}
