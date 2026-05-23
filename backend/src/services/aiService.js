const aiConfig = require("../config/aiConfig");
const { isOpenAIConfigured } = require("./openaiClient");

function getProvider() {
  return isOpenAIConfigured() ? "openai" : "fallback";
}

function getAIStatus() {
  return {
    configured: isOpenAIConfigured(),
    provider: getProvider(),
    model: aiConfig.model,
    embeddingModel: aiConfig.embeddingModel,
    maxSources: aiConfig.maxSources,
    minScore: aiConfig.minScore,
  };
}

function tokenizeQuestion(question) {
  if (!question || typeof question !== "string") return [];
  return question
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 2);
}

function rankArticleMatches(question, articles = []) {
  const terms = tokenizeQuestion(question);
  if (!Array.isArray(articles) || articles.length === 0) {
    return [];
  }

  const ranked = articles
    .map((article) => {
      const haystack = [
        article.title,
        article.summary,
        article.content,
        article.category?.name,
        article.categoryName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      let hits = 0;
      for (const term of terms) {
        if (haystack.includes(term)) hits += 1;
      }

      const score = terms.length > 0 ? hits / terms.length : 0;

      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        summary: article.summary ?? null,
        category:
          article.category?.name ?? article.categoryName ?? undefined,
        score,
      };
    })
    .filter((row) => row.score >= aiConfig.minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, aiConfig.maxSources);

  return ranked;
}

function buildSourceContext(sources = []) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return "";
  }

  return sources
    .map((source, index) => {
      const parts = [
        `[Source ${index + 1}]`,
        `Title: ${source.title}`,
        source.category ? `Category: ${source.category}` : null,
        source.summary ? `Summary: ${source.summary}` : null,
        source.slug ? `Slug: ${source.slug}` : null,
      ].filter(Boolean);
      return parts.join("\n");
    })
    .join("\n\n");
}

async function generateAnswerFromSources(question, sources = []) {
  const provider = getProvider();

  if (!isOpenAIConfigured()) {
    return {
      answer:
        "AI Search is not configured on the server. Set OPENAI_API_KEY and AI_SEARCH_USE_OPENAI=true in the backend environment to enable OpenAI.",
      provider: "fallback",
      fallback: true,
      confidence: 0,
    };
  }

  const context = buildSourceContext(sources);
  const contextNote = context
    ? " Source context is available for Phase 12."
    : "";

  return {
    answer: `AI Search is configured and ready.${contextNote} Full answer generation for "${String(question).trim().slice(0, 120)}" will be implemented in Phase 12.`,
    provider: "openai",
    fallback: true,
    confidence: 0,
  };
}

async function runPlaceholderSearch(question) {
  const trimmed =
    typeof question === "string" ? question.trim() : "";

  if (!trimmed) {
    return {
      error: { status: 400, message: "Question is required" },
    };
  }

  const generated = await generateAnswerFromSources(trimmed, []);

  return {
    answer:
      generated.answer ||
      "AI Search is configured and will be implemented in Phase 12.",
    sources: [],
    confidence: generated.confidence ?? 0,
    provider: generated.provider,
    fallback: true,
  };
}

module.exports = {
  getAIStatus,
  rankArticleMatches,
  buildSourceContext,
  generateAnswerFromSources,
  runPlaceholderSearch,
};
