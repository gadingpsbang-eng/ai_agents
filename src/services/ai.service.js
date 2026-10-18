const OpenAI = require("openai");
const aiConfig = require("../config/ai.config");
const logger = require("../utils/logger");

const client = new OpenAI({
  apiKey: aiConfig.apiKey,
  baseURL: aiConfig.baseURL,
});

async function chatCompletion({ messages, tools = [] }) {
  const payload = {
    model: aiConfig.model,
    messages,
    max_tokens: aiConfig.maxTokens,
    temperature: aiConfig.temperature,
  };
  if (tools.length > 0) {
    payload.tools = tools;
    payload.tool_choice = "auto";
  }

  try {
    const response = await client.chat.completions.create(payload);
    const msg = response.choices[0].message;

    if (msg.reasoning_content) {
      logger.debug("Reasoning", { preview: msg.reasoning_content.slice(0, 200) });
    }

    return msg;
  } catch (err) {
    const detail = err?.error?.message || err.message;
    logger.error("AI API error", { detail });
    throw new Error(`AI API error: ${detail}`);
  }
}

module.exports = { chatCompletion };
