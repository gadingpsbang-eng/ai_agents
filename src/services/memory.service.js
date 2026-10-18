const ConversationStore = require("../memory/conversation-store");

const stores = new Map();
const MAX_HISTORY = parseInt(process.env.MEMORY_MAX_HISTORY, 10) || 20;

function getStore(sessionId) {
  if (!stores.has(sessionId)) {
    stores.set(sessionId, new ConversationStore(MAX_HISTORY));
  }
  return stores.get(sessionId);
}

function getHistory(sessionId) {
  return getStore(sessionId).getMessages();
}

function append(sessionId, message) {
  getStore(sessionId).add(message);
}

function clear(sessionId) {
  stores.delete(sessionId);
}

module.exports = { getStore, getHistory, append, clear };
