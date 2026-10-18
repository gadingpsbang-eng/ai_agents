const { test, describe } = require("node:test");
const assert = require("node:assert");

const calculator = require("../src/tools/calculator");
const ConversationStore = require("../src/memory/conversation-store");
const tools = require("../src/agents/planner");
const SYSTEM_PROMPT = require("../src/agents/system-prompt");

describe("calculator tool", () => {
  test("evaluates basic arithmetic", async () => {
    const r = await calculator({ expression: "2 + 2" });
    assert.strictEqual(r.success, true);
    assert.strictEqual(r.result, "4");
  });

  test("handles parentheses and precedence", async () => {
    const r = await calculator({ expression: "(2 + 3) * 4" });
    assert.strictEqual(r.success, true);
    assert.strictEqual(r.result, "20");
  });

  test("rejects invalid input", async () => {
    const r = await calculator({ expression: "abc" });
    assert.strictEqual(r.success, false);
  });
});

describe("ConversationStore", () => {
  test("stores and retrieves messages", () => {
    const store = new ConversationStore(10);
    store.add({ role: "user", content: "hi" });
    store.add({ role: "assistant", content: "hello" });
    assert.strictEqual(store.size(), 2);
    assert.deepStrictEqual(store.getMessages()[0].content, "hi");
  });

  test("trims to max messages", () => {
    const store = new ConversationStore(3);
    for (let i = 0; i < 10; i++) store.add({ role: "user", content: `msg-${i}` });
    assert.strictEqual(store.size(), 3);
    assert.strictEqual(store.getMessages()[2].content, "msg-9");
  });

  test("clear empties store", () => {
    const store = new ConversationStore();
    store.add({ role: "user", content: "hi" });
    store.clear();
    assert.strictEqual(store.size(), 0);
  });
});

describe("planner / tools schema", () => {
  test("exports an array of tool schemas", () => {
    assert.ok(Array.isArray(tools));
    assert.ok(tools.length >= 3);
    tools.forEach((t) => {
      assert.strictEqual(t.type, "function");
      assert.ok(t.function.name);
      assert.ok(t.function.parameters);
    });
  });
});

describe("system prompt", () => {
  test("is a non-empty string", () => {
    assert.strictEqual(typeof SYSTEM_PROMPT, "string");
    assert.ok(SYSTEM_PROMPT.length > 0);
  });
});
