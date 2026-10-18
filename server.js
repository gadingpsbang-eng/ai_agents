require("dotenv").config();

const express = require("express");
const path = require("path");
const chatRoutes = require("./src/routes/chat.routes");
const logger = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/chat", chatRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { message: err.message });
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
