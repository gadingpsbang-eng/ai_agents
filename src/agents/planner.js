const calculatorTool = {
  type: "function",
  function: {
    name: "calculator",
    description: "Evaluate a basic math expression (+, -, *, /, **, %, parentheses).",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "Math expression to evaluate, e.g. '(2 + 3) * 4'",
        },
      },
      required: ["expression"],
    },
  },
};

const webSearchTool = {
  type: "function",
  function: {
    name: "web_search",
    description: "Search the web for current information or facts.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
      },
      required: ["query"],
    },
  },
};

const fileReaderTool = {
  type: "function",
  function: {
    name: "file_reader",
    description: "Read the contents of a text file by path.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Absolute or relative path to the file",
        },
      },
      required: ["path"],
    },
  },
};

const allTools = [calculatorTool, webSearchTool, fileReaderTool];

module.exports = allTools;
