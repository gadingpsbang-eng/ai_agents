class ConversationStore {
  constructor(maxMessages = 20) {
    this.maxMessages = maxMessages;
    this.messages = [];
  }

  add(message) {
    this.messages.push(message);
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }

  getMessages() {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }

  size() {
    return this.messages.length;
  }
}

module.exports = ConversationStore;
