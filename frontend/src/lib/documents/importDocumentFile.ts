export type DocumentImportOutcome =
  | { status: "success"; text: string; fileName: string }
  | { status: "info" | "error"; message: string };

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });
}

function extension(file: File): string {
  const name = file.name.toLowerCase();
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

export function buildSummaryFromContent(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const firstParagraph =
    trimmed.split(/\n\n+/).map((block) => block.trim()).find(Boolean) ?? trimmed;
  const normalized = firstParagraph.replace(/\s+/g, " ");
  if (normalized.length <= 200) return normalized;
  return `${normalized.slice(0, 200)}…`;
}

export function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "").trim();
}

export async function importDocumentFile(
  file: File,
): Promise<DocumentImportOutcome> {
  const ext = extension(file);

  if (ext === ".txt" || ext === ".md" || ext === ".markdown") {
    try {
      const text = (await readTextFile(file)).trim();
      if (!text) {
        return { status: "error", message: "The selected file is empty." };
      }
      return { status: "success", text, fileName: file.name };
    } catch {
      return {
        status: "error",
        message: "Could not read that file. Try a plain text or Markdown file.",
      };
    }
  }

  if (ext === ".docx") {
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      if (!text) {
        return {
          status: "error",
          message:
            "DOCX was read but no text was found. Please paste content manually.",
        };
      }
      return { status: "success", text, fileName: file.name };
    } catch {
      return {
        status: "error",
        message:
          "DOCX upload is selected but text extraction failed. Please paste content manually.",
      };
    }
  }

  if (ext === ".pdf") {
    try {
      const { extractPdfText } = await import("./extractPdfText");
      const text = await extractPdfText(file);
      if (!text) {
        return {
          status: "error",
          message:
            "Could not extract text from this PDF. Please paste the content manually.",
        };
      }
      return { status: "success", text, fileName: file.name };
    } catch {
      return {
        status: "error",
        message:
          "Could not extract text from this PDF. Please paste the content manually.",
      };
    }
  }

  return {
    status: "error",
    message: "Unsupported file type. Use .txt, .md, .docx, or .pdf.",
  };
}
