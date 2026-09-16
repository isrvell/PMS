import express from "express";
import auth from "../middleware/auth.js";
import {
  getChannels,
  createChannel,
  getOrCreateDirectChannel,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const router = express.Router({ mergeParams: true });

router.use(auth);

router.get("/channels", getChannels);
router.post("/channels", createChannel);
router.post("/direct", getOrCreateDirectChannel);
router.get("/channels/:channelId/messages", getMessages);
router.post("/channels/:channelId/messages", sendMessage);

export default router;
