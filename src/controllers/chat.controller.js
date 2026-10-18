const Agent = require("../agents/agent");
const memoryService = require("../services/memory.service");
const logger = require("../utils/logger");

const agent = new Agent();

async function chat(req, res) {
  try {
    const { message, sessionId = "default" } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    logger.info("Chat request", { sessionId, message: message.slice(0, 100) });
    const result = await agent.run({ message: message.trim(), sessionId });
    res.json(result);
  } catch (err) {
    logger.error("Chat failed", { message: err.message });
    res.status(500).json({ error: err.message });
  }
}

async function clearSession(req, res) {
  const { sessionId } = req.params;
  memoryService.clear(sessionId);
  res.json({ success: true });
}

module.exports = { chat, clearSession };
