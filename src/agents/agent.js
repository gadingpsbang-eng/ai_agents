const aiConfig = require("../config/ai.config");
const aiService = require("../services/ai.service");
const memoryService = require("../services/memory.service");
const SYSTEM_PROMPT = require("./system-prompt");
const tools = require("./planner");
const calculator = require("../tools/calculator");
const webSearch = require("../tools/web-search");
const fileReader = require("../tools/file-reader");
const logger = require("../utils/logger");

const toolHandlers = {
  calculator,
  web_search: webSearch,
  file_reader: fileReader,
};

class Agent {
  constructor() {
    this.maxIterations = aiConfig.maxIterations;
  }

  async run({ message, sessionId = "default" }) {
    memoryService.append(sessionId, { role: "user", content: message });

    const history = memoryService.getHistory(sessionId);
    const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...history];

    for (let i = 0; i < this.maxIterations; i++) {
      const aiMessage = await aiService.chatCompletion({ messages, tools });

      if (!aiMessage.tool_calls || aiMessage.tool_calls.length === 0) {
        memoryService.append(sessionId, {
          role: "assistant",
          content: aiMessage.content,
        });
        return { reply: aiMessage.content, iterations: i + 1 };
      }

      messages.push({
        role: "assistant",
        content: aiMessage.content || null,
        tool_calls: aiMessage.tool_calls,
      });

      for (const call of aiMessage.tool_calls) {
        const handler = toolHandlers[call.function.name];
        let result;
        if (handler) {
          logger.info("Tool call", { tool: call.function.name });
          try {
            const args = JSON.parse(call.function.arguments || "{}");
            result = await handler(args);
          } catch (err) {
            result = { success: false, error: err.message };
          }
        } else {
          result = { success: false, error: `Unknown tool: ${call.function.name}` };
        }

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
    }

    const fallback = "I wasn't able to complete that within the allowed steps.";
    memoryService.append(sessionId, { role: "assistant", content: fallback });
    return { reply: fallback, iterations: this.maxIterations };
  }
}

module.exports = Agent;
