import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import {
  userMonitor,
  queueMonitor,
  messageQueue,
  scheduleMonitor,
  sendScheduledMessages,
  campaignQueue
} from "../../queues";

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [
    new BullMQAdapter(userMonitor),
    new BullMQAdapter(queueMonitor),
    new BullMQAdapter(messageQueue),
    new BullMQAdapter(scheduleMonitor),
    new BullMQAdapter(sendScheduledMessages),
    new BullMQAdapter(campaignQueue)
  ],
  serverAdapter
});

export default serverAdapter;
