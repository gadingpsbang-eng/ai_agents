const axios = require("axios");

async function webSearch({ query }) {
  try {
    const { data } = await axios.get(
      "https://api.duckduckgo.com/",
      {
        params: {
          q: query,
          format: "json",
          no_html: 1,
          skip_disambig: 1,
        },
        timeout: 8000,
      }
    );

    const snippets = [];
    if (data.AbstractText) snippets.push(data.AbstractText);
    if (data.Answer) snippets.push(data.Answer);
    (data.RelatedTopics || []).slice(0, 5).forEach((t) => {
      if (t.Text) snippets.push(t.Text);
    });

    if (snippets.length === 0) {
      return {
        success: true,
        result: `No direct answer found for "${query}". Try a more specific query.`,
      };
    }

    return { success: true, result: snippets.join("\n") };
  } catch (err) {
    return { success: false, error: `Search failed: ${err.message}` };
  }
}

module.exports = webSearch;
