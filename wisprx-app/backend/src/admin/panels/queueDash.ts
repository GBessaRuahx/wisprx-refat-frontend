import express from "express";
import { createQueueDashExpressMiddleware } from "@queuedash/api";


import {
  userMonitor,
  queueMonitor,
  messageQueue,
  scheduleMonitor,
  sendScheduledMessages,
  campaignQueue
} from "../../queues";

const queueDash = express.Router();

queueDash.use(
  "/",
  createQueueDashExpressMiddleware({
    ctx: {
      queues: [
        { queue: userMonitor, displayName: "User Monitor", type: "bullmq" },
        { queue: queueMonitor, displayName: "Queue Monitor", type: "bullmq" },
        { queue: messageQueue, displayName: "Message Queue", type: "bullmq" },
        {
          queue: scheduleMonitor,
          displayName: "Schedule Monitor",
          type: "bullmq"
        },
        {
          queue: sendScheduledMessages,
          displayName: "Send Scheduled Messages",
          type: "bullmq"
        },
        { queue: campaignQueue, displayName: "Campaign Queue", type: "bullmq" }
      ]
    }
  })
);

export default queueDash;
