const OpenAI = require("openai");
const aiConfig = require("../config/aiConfig");

let cachedClient = null;
let clientInitialized = false;

function isOpenAIConfigured() {
  return aiConfig.useOpenAI;
}

function getOpenAIClient() {
  if (!isOpenAIConfigured()) {
    return null;
  }

  if (clientInitialized) {
    return cachedClient;
  }

  clientInitialized = true;
  cachedClient = new OpenAI({ apiKey: aiConfig.apiKey });
  return cachedClient;
}

module.exports = {
  getOpenAIClient,
  isOpenAIConfigured,
};
