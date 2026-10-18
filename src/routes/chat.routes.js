const express = require("express");
const chatController = require("../controllers/chat.controller");

const router = express.Router();

router.post("/", chatController.chat);
router.delete("/session/:sessionId", chatController.clearSession);

module.exports = router;
