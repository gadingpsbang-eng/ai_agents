function safeEval(expression) {
  const cleaned = String(expression).replace(/[^0-9+\-*/().%^\s]/g, "");
  if (!cleaned.trim()) throw new Error("Empty or invalid expression");
  const jsExpr = cleaned.replace(/\^/g, "**");
  // eslint-disable-next-line no-new-func
  const result = Function(`"use strict"; return (${jsExpr});`)();
  if (typeof result !== "number" || !isFinite(result)) {
    throw new Error("Expression did not evaluate to a finite number");
  }
  return result;
}

async function calculator({ expression }) {
  try {
    const result = safeEval(expression);
    return { success: true, result: String(result) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = calculator;
