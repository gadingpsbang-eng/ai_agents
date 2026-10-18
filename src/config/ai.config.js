const aiConfig = {
  apiKey: process.env.GROQ_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
  model: process.env.AI_MODEL || "openai/gpt-oss-120b",
  maxTokens: 1024,
  temperature: 0.7,
  maxIterations: parseInt(process.env.AGENT_MAX_ITERATIONS, 10) || 5,
};

module.exports = aiConfig;
