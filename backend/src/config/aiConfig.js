function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return defaultValue;
  }
  return String(value).trim().toLowerCase() === "true";
}

function parsePositiveInt(value, defaultValue) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return defaultValue;
  return n;
}

function parseFloatInRange(value, defaultValue) {
  const n = Number.parseFloat(String(value ?? ""));
  if (!Number.isFinite(n)) return defaultValue;
  return Math.min(1, Math.max(0, n));
}

const apiKey = process.env.OPENAI_API_KEY?.trim() || "";
const useOpenAIRequested = parseBoolean(process.env.AI_SEARCH_USE_OPENAI, false);

const aiConfig = {
  useOpenAI: useOpenAIRequested && apiKey.length > 0,
  useOpenAIRequested,
  apiKey,
  model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
  embeddingModel:
    process.env.OPENAI_EMBEDDING_MODEL?.trim() || "text-embedding-3-small",
  maxSources: parsePositiveInt(process.env.AI_SEARCH_MAX_SOURCES, 5),
  minScore: parseFloatInRange(process.env.AI_SEARCH_MIN_SCORE, 0.15),
};

module.exports = aiConfig;
