const fs = require("fs/promises");
const path = require("path");

const MAX_BYTES = 50 * 1024;

async function fileReader({ path: filePath }) {
  try {
    const resolved = path.resolve(filePath);
    const stat = await fs.stat(resolved);
    if (!stat.isFile()) {
      return { success: false, error: "Path is not a file" };
    }
    if (stat.size > MAX_BYTES) {
      return {
        success: false,
        error: `File too large (${stat.size} bytes). Max is ${MAX_BYTES}.`,
      };
    }
    const content = await fs.readFile(resolved, "utf-8");
    return { success: true, result: content };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = fileReader;
