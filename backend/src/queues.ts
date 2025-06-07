 import * as Sentry from "@sentry/node";
 import { Queue, Worker, Job, QueueEvents, JobsOptions, QueueOptions } from "bullmq";
 import IORedis from "ioredis";
 import { MessageData, SendMessage } from "./helpers/SendMessage";
 import Whatsapp from "./models/Whatsapp";
 import { logger } from "./utils/logger";
 import moment from "moment";
 import Schedule from "./models/Schedule";
 import Contact from "./models/Contact";
 import { Op, QueryTypes, Sequelize } from "sequelize";
 import GetDefaultWhatsApp from "./helpers/GetDefaultWhatsApp";
 import Campaign from "./models/Campaign";
 import ContactList from "./models/ContactList";
 import ContactListItem from "./models/ContactListItem";
 import { isEmpty, isNil, isArray } from "lodash";
 import CampaignSetting from "./models/CampaignSetting";
 import CampaignShipping from "./models/CampaignShipping";
 import GetWhatsappWbot from "./helpers/GetWhatsappWbot";
 import sequelize from "./database";
 import { getMessageOptions } from "./services/WbotServices/SendWhatsAppMedia";
 import { getIO } from "./libs/socket";
 import path from "path";
 import User from "./models/User";
 import Company from "./models/Company";
 import Plan from "./models/Plan";
 import Ticket from "./models/Ticket";
 import ShowFileService from "./services/FileServices/ShowService";
 import FilesOptions from './models/FilesOptions';
 import { addSeconds, differenceInSeconds } from "date-fns";
 import formatBody from "./helpers/Mustache";
 import { ClosedAllOpenTickets } from "./services/WbotServices/wbotClosedTickets";


 const nodemailer = require('nodemailer');
 const CronJob = require('cron').CronJob;


const connection = new IORedis(process.env.REDIS_URI || "");
const limiterMax = Number(process.env.REDIS_OPT_LIMITER_MAX || 1);
const limiterDuration = Number(process.env.REDIS_OPT_LIMITER_DURATION || 3000);

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: 0,
  maxRetriesPerRequest: null
};

 interface ProcessCampaignData {
   id: number;
   contactId: number;
   delay: number;
 }

 interface PrepareContactData {
   contactId: number;
   campaignId: number;
   delay: number;
   variables: any[];
 }

 interface DispatchCampaignData {
   campaignId: number;
   campaignShippingId: number;
   contactListItemId: number;
 }

export const userMonitor = new Queue("UserMonitor", {
  connection: redisConnection
});
export const queueMonitor = new Queue("QueueMonitor", {
  connection: redisConnection
});
export const messageQueue = new Queue("MessageQueue", {
  connection: redisConnection
});

(messageQueue as any).opts.limiter = {
  max: limiterMax,
  duration: limiterDuration
};
export const scheduleMonitor = new Queue("ScheduleMonitor", {
  connection: redisConnection
});
export const sendScheduledMessages = new Queue("SendScheduledMessages", {
  connection: redisConnection
});
export const campaignQueue = new Queue("CampaignQueue", {
  connection: redisConnection
});

 async function handleSendMessage(job: Job) {
   try {
     const { data } = job;
     const whatsapp = await Whatsapp.findByPk(data.whatsappId);

     if (whatsapp == null) {
       throw Error("Whatsapp não identificado");
     }

     const messageData: MessageData = data.data;

     await SendMessage(whatsapp, messageData);
   } catch (e: any) {
     Sentry.captureException(e);
     logger.error("MessageQueue -> SendMessage: error", e.message);
     throw e;
   }
 }

 async function handleVerifyQueue(job: Job) {
  logger.info("Buscando atendimentos perdidos nas filas");

  try {
    const companies = await Company.findAll({
      attributes: ['id', 'name'],
      where: {
        status: true,
        dueDate: {
          [Op.gt]: Sequelize.literal('CURRENT_DATE')
        }
      },
      include: [
        {
          model: Whatsapp,
          attributes: ["id", "name", "status", "timeSendQueue", "sendIdQueue"],
          where: {
            timeSendQueue: {
              [Op.gt]: 0
            }
          }
        }
      ]
    });

    for (const company of companies) {
      for (const wpp of company.whatsapps) {
        if (wpp.status !== "CONNECTED") continue;

        const moveQueue = (wpp as any).timeSendQueue || 0;
        const moveQueueId = (wpp as any).sendIdQueue;

        if (!moveQueue || !Number.isInteger(moveQueueId)) continue;

        const cutoffTime = moment().subtract(moveQueue, "minutes").toDate();


        const tickets = await Ticket.findAll({
          where: {
            status: "pending",
            queueId: null,
            companyId: company.id,
            whatsappId: wpp.id,
            updatedAt: {
              [Op.lt]: cutoffTime
            }
          },
          include: [
            {
              model: Contact,
              as: "contact",
              attributes: ["id", "name", "number", "email", "profilePicUrl"],
              include: ["extraInfo"]
            }
          ]
        });

        for (const ticket of tickets) {
          await ticket.update({ queueId: moveQueueId });
          await ticket.reload();

          const io = getIO();
          io.to(ticket.status)
            .to("notification")
            .to(ticket.id.toString())
            .emit(`company-${company.id}-ticket`, {
              action: "update",
              ticket,
              ticketId: ticket.id
            });

          logger.info(`Atendimento Perdido: ${ticket.id} - Empresa: ${company.id}`);
        }

        if (!tickets.length) {
          logger.info(`Nenhum atendimento perdido encontrado - Empresa: ${company.id}`);
        }
      }
    }
  } catch (e: any) {
    Sentry.captureException(e);
    logger.error("SearchForQueue -> VerifyQueue: error", e.message);
    throw e;
  }
}

 async function handleCloseTicketsAutomatic(): Promise<void> {
   const job = new CronJob('*/1 * * * *', async () => {
     const companies = await Company.findAll();
     companies.map(async c => {

       try {
         const companyId = c.id;
         await ClosedAllOpenTickets(companyId);
       } catch (e: any) {
         Sentry.captureException(e);
         logger.error("ClosedAllOpenTickets -> Verify: error", e.message);
         throw e;
       }

     });
   });
   job.start()
 }

 async function handleVerifySchedules(job: Job) {
   try {
     const { count, rows: schedules } = await Schedule.findAndCountAll({
       where: {
         status: "PENDENTE",
         sentAt: null,
         sendAt: {
           [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss"),
           [Op.lte]: moment().add(300, "seconds").format("YYYY-MM-DD HH:mm:ss")
         }
       },
       include: [{ model: Contact, as: "contact" }]
     });

     if (count > 0) {
       for (const schedule of schedules) {
         await schedule.update({ status: "AGENDADA" });
         await sendScheduledMessages.add(
           "SendMessage",
           { schedule },
           {
             delay: 40000,
             removeOnComplete: true
           }
         );

         logger.info(`[🧵] Disparo agendado para: ${schedule.contact.name}`);
       }
     }
   } catch (e: any) {
     Sentry.captureException(e);
     logger.error("SendScheduledMessage -> Verify: error", e.message);
     throw e;
   }
 }


 async function handleSendScheduledMessage(job: Job) {
   const {
     data: { schedule }
   } = job;
   let scheduleRecord: Schedule | null = null;

   try {
     scheduleRecord = await Schedule.findByPk(schedule.id, {
       include: [{ model: Contact, as: "contact" }]
     });

     if (!scheduleRecord) {
       throw new Error("Agendamento não encontrado.");
     }

     const whatsapp = await GetDefaultWhatsApp(scheduleRecord.companyId);

     const filePath = scheduleRecord.mediaPath
       ? path.resolve("public", scheduleRecord.mediaPath)
       : null;

     await SendMessage(whatsapp, {
       number: scheduleRecord.contact.number,
       body: formatBody(scheduleRecord.body, scheduleRecord.contact),
       mediaPath: filePath
     });

     await scheduleRecord.update({
       sentAt: moment().format("YYYY-MM-DD HH:mm"),
       status: "ENVIADA"
     });

     logger.info(`[🧵] Mensagem agendada enviada para: ${scheduleRecord.contact.name}`);

     await sendScheduledMessages.clean(0, 0, "completed");
   } catch (e: any) {
     Sentry.captureException(e);
     if (scheduleRecord) {
       await scheduleRecord.update({ status: "ERRO" });
     }
     logger.error("SendScheduledMessage -> SendMessage: error", e.message);
     throw e;
   }
 }


 async function handleVerifyCampaigns(job: Job): Promise<void> {
   /**
    * @done
    * Implementado filtro por companyId se presente no payload
    */

   logger.info("[🏁] - Verificando campanhas...");

   const companyId = job?.data?.companyId;

   const whereClause = companyId
     ? `AND c."companyId" = ${companyId}`
     : "";

   const campaigns: { id: number; scheduledAt: string }[] =
     await sequelize.query(
       `SELECT id, "scheduledAt" FROM "Campaigns" c
        WHERE "scheduledAt" BETWEEN now() AND now()   '1 hour'::interval
        AND status = 'PROGRAMADA' ${whereClause}`,
       { type: QueryTypes.SELECT }
     );

   if (campaigns.length > 0)
     logger.info(`[🚩] - Campanhas encontradas: ${campaigns.length}`);

   for (let campaign of campaigns) {
     try {
       const now = moment();
       const scheduledAt = moment(campaign.scheduledAt);
       const delay = scheduledAt.diff(now, "milliseconds");
       logger.info(
         `[📌] - Campanha enviada para a fila de processamento: Campanha=${campaign.id}, Delay Inicial=${delay}`
       );
       campaignQueue.add(
         "ProcessCampaign",
         {
           id: campaign.id,
           delay,
           companyId
         },
         {
           removeOnComplete: true
         }
       );
     } catch (err: any) {
       Sentry.captureException(err);
     }
   }

   logger.info("[🏁] - Finalizando verificação de campanhas programadas...");
 }

 async function getCampaign(id: number): Promise<Campaign | null> {
   if (!id || typeof id !== "number") {
     logger.warn(`[⚠️] getCampaign recebeu id inválido: ${id}`);
     return null;
   }

   try {
     const campaign = await Campaign.findByPk(id, {
       include: [
         {
           model: ContactList,
           as: "contactList",
           attributes: ["id", "name"],
           include: [
             {
               model: ContactListItem,
               as: "contacts",
               attributes: ["id", "name", "number", "email", "isWhatsappValid"],
               where: { isWhatsappValid: true }
             }
           ]
         },
         {
           model: Whatsapp,
           as: "whatsapp",
           attributes: ["id", "name"]
         },
         {
           model: CampaignShipping,
           as: "shipping",
           include: [{ model: ContactListItem, as: "contact" }]
         }
       ]
     });

     if (!campaign) {
       logger.warn(`[⚠️] Campanha não encontrada para id: ${id}`);
     }

     return campaign;
   }
   catch (error: any) {
     logger.error(`[❌] Erro ao buscar campanha ${id}: ${error.message}`);
     Sentry.captureException(error);
     return null;
   }
 }


 async function getContact(id: number): Promise<ContactListItem | null> {
   return await ContactListItem.findByPk(id, {
     attributes: ["id", "name", "number", "email"]
   });
 }


 async function getSettings(
   campaign: Campaign
 ): Promise<{ messageInterval: number; longerIntervalAfter: number; greaterInterval: number; variables: any[] }> {
   const settings = await CampaignSetting.findAll({
     where: { companyId: campaign.companyId },
     attributes: ["key", "value"]
   });

   let messageInterval: number = 20;
   let longerIntervalAfter: number = 20;
   let greaterInterval: number = 60;
   let variables: any[] = [];

   settings.forEach(setting => {
     if (setting.key === "messageInterval") {
       messageInterval = JSON.parse(setting.value);
     }
     if (setting.key === "longerIntervalAfter") {
       longerIntervalAfter = JSON.parse(setting.value);
     }
     if (setting.key === "greaterInterval") {
       greaterInterval = JSON.parse(setting.value);
     }
     if (setting.key === "variables") {
       variables = JSON.parse(setting.value);
     }
   });

   return {
     messageInterval,
     longerIntervalAfter,
     greaterInterval,
     variables
   } as const;
 }


 export function parseToMilliseconds(seconds: number) {
   return seconds * 1000;
 }

 async function sleep(seconds: number) {
   logger.info(
     `Sleep de ${seconds} segundos iniciado: ${moment().format("HH:mm:ss")}`
   );
   return new Promise(resolve => {
     setTimeout(() => {
       logger.info(
         `Sleep de ${seconds} segundos finalizado: ${moment().format(
           "HH:mm:ss"
         )}`
       );
       resolve(true);
     }, parseToMilliseconds(seconds));
   });
 }


 function getCampaignValidMessages(campaign: Campaign): string[] {
   const messages: string[] = [];

   if (!isEmpty(campaign.message1) && !isNil(campaign.message1)) {
     messages.push(campaign.message1);
   }

   if (!isEmpty(campaign.message2) && !isNil(campaign.message2)) {
     messages.push(campaign.message2);
   }

   if (!isEmpty(campaign.message3) && !isNil(campaign.message3)) {
     messages.push(campaign.message3);
   }

   if (!isEmpty(campaign.message4) && !isNil(campaign.message4)) {
     messages.push(campaign.message4);
   }

   if (!isEmpty(campaign.message5) && !isNil(campaign.message5)) {
     messages.push(campaign.message5);
   }

   return messages;
 }

 function getProcessedMessage(
   msg: string,
   variables: any[],
   contact: ContactListItem
 ): string {
   let finalMessage = msg;

   if (finalMessage.includes("{nome}")) {
     finalMessage = finalMessage.replace(/{nome}/g, contact.name);
   }

   if (finalMessage.includes("{email}")) {
     finalMessage = finalMessage.replace(/{email}/g, contact.email);
   }

   if (finalMessage.includes("{numero}")) {
     finalMessage = finalMessage.replace(/{numero}/g, contact.number);
   }

   variables.forEach(variable => {
     if (finalMessage.includes(`{${variable.key}}`)) {
       const regex = new RegExp(`{${variable.key}}`, "g");
       finalMessage = finalMessage.replace(regex, variable.value);
     }
   });

   return finalMessage;
 }

export function randomValue(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

 async function verifyAndFinalizeCampaign(campaign) {

   logger.info("[🚨] - Verificando se o envio de campanhas finalizou");
   const { contacts } = campaign.contactList;

   const count1 = contacts.length;
   const count2 = await CampaignShipping.count({
     where: {
       campaignId: campaign.id,
       deliveredAt: {
         [Op.not]: null
       }
     }
   });

   if (count1 === count2) {
     await campaign.update({ status: "FINALIZADA", completedAt: moment() });
   }

   const io = getIO();
   io.to(`company-${campaign.companyId}-mainchannel`).emit(`company-${campaign.companyId}-campaign`, {
     action: "update",
     record: campaign
   });

   logger.info("[🚨] - Fim da verificação de finalização de campanhas");
 }

function calculateDelay(index, baseDelay, longerIntervalAfter, greaterInterval, messageInterval) {
  const diffSeconds = differenceInSeconds(baseDelay, new Date());
  if (index > longerIntervalAfter) {
    return diffSeconds * 1000 + greaterInterval
  } else {
    return diffSeconds * 1000 + messageInterval
  }
}

async function handleProcessCampaign(job: Job<ProcessCampaignData>) {
  logger.info("[🏁] - Iniciou o processamento da campanha de ID: " + job.data.id);

  try {
    const { id }: ProcessCampaignData = job.data;
    const campaign = await getCampaign(id);
    if (!campaign) return;

    const settings = await getSettings(campaign);

    logger.info("[🚩] - Localizando e configurando a campanha");

    const { contacts } = campaign.contactList;

    if (!isArray(contacts) || !contacts.length) return;

    logger.info("[📌] - Quantidade de contatos a serem enviados: " + contacts.length);

    const contactData = contacts.map(contact => ({
      contactId: contact.id,
      campaignId: campaign.id,
      variables: settings.variables,
    }));

    const longerIntervalAfter = settings.longerIntervalAfter;
    const greaterInterval = settings.greaterInterval;
    const messageInterval = settings.messageInterval;

    let baseDelay = moment(campaign.scheduledAt).toDate();

    const queuePromises = [];

    for (let i = 0; i < contactData.length; i++) {
      const { contactId, campaignId, variables } = contactData[i];

      baseDelay = addSeconds(baseDelay, i > longerIntervalAfter ? greaterInterval : messageInterval);

      const delay = calculateDelay(i, baseDelay, longerIntervalAfter, greaterInterval, messageInterval);

      const queuePromise = campaignQueue.add(
        "PrepareContact",
        { contactId, campaignId, variables },
        {
          delay,
          removeOnComplete: true
        }
      );

      queuePromises.push(queuePromise);

      logger.info(`[🚀] - Cliente de ID: ${contactId} da campanha ${campaignId} com delay: ${delay}ms`);
    }

    await Promise.all(queuePromises);
    await campaign.update({ status: "EM_ANDAMENTO" });

  } catch (err: any) {
    Sentry.captureException(err);
    logger.error(`ProcessCampaign -> erro: ${err.message}`);
  }
}

 async function handlePrepareContact(job: Job<PrepareContactData>) {

   logger.info("Preparando contatos");
   try {
     const { contactId, campaignId, delay, variables }: PrepareContactData =
       job.data;
     const campaign = await getCampaign(campaignId);
     const contact = await getContact(contactId);

    if (!contact || !campaign) {
      logger.warn(`[⚠️] Contato ou campanha não encontrado. Contact=${contactId}, Campaign=${campaignId}`);
      return;
    }

    const campaignShipping: any = {};
    campaignShipping.number = contact.number;
    campaignShipping.contactId = contactId;
    campaignShipping.campaignId = campaignId;

    logger.info("[🏁] - Iniciou a preparação do contato | contatoId: " + contactId + " CampanhaID: " + campaignId);

     const messages = getCampaignValidMessages(campaign);
     if (messages.length) {
       const radomIndex = randomValue(0, messages.length);
       const message = getProcessedMessage(
         messages[radomIndex],
         variables,
         contact
       );
       campaignShipping.message = `\u200c ${message}`;
     }

    const [record, created] = await CampaignShipping.findOrCreate({
      where: {
        campaignId: campaignShipping.campaignId,
        contactId: campaignShipping.contactId
      },
      defaults: campaignShipping
    });

    logger.info("[🚩] - Registro de envio de camapanha para contato criado | contatoId: " + contactId + " CampanhaID: " + campaignId);

    if (
      !created &&
      record.deliveredAt === null
    ) {
      record.set(campaignShipping);
      await record.save();
    }

    if (
      record.deliveredAt === null
    ) {
      const nextJob = await campaignQueue.add(
        "DispatchCampaign",
        {
          campaignId: campaign.id,
          campaignShippingId: record.id,
          contactListItemId: contactId
        },
        {
          delay
        }
      );

      await record.update({ jobId: nextJob.id });
    }

    await verifyAndFinalizeCampaign(campaign);
    logger.info("[🏁] - Finalizado a preparação do contato | contatoId: " + contactId + " CampanhaID: " + campaignId);
  } catch (err: any) {
    Sentry.captureException(err);
    logger.error(`campaignQueue -> PrepareContact -> error: ${err.message}`);
  }
}

async function handleDispatchCampaign(job: Job<DispatchCampaignData>) {
  try {
    const { data } = job;
    const { campaignShippingId, campaignId }: DispatchCampaignData = data;
    const campaign = await getCampaign(campaignId);
    const wbot = await GetWhatsappWbot(campaign?.whatsapp);

     logger.info(`[🚩][DispatchCampaign] Disparando campanha | CampaignShippingId: ${campaignShippingId} | CampanhaID: ${campaignId}`);

     if (!wbot) {
       logger.error(`[DispatchCampaign][${campaignShippingId}] wbot not found | CampaignID: ${campaignId}`);
       return;
     }

     if (!campaign?.whatsapp) {
       logger.error(`[DispatchCampaign][${campaignShippingId}] whatsapp not found | CampaignID: ${campaignId}`);
       return;
     }

     if (!wbot?.user?.id) {
       logger.error(`[DispatchCampaign][${campaignShippingId}] wbot user not found | CampaignID: ${campaignId}`);
       return;
     }

     const campaignShipping = await CampaignShipping.findByPk(
       campaignShippingId,
       {
         include: [{ model: ContactListItem, as: "contact" }]
       }
     );

     if (!campaignShipping) {
       logger.error(`[DispatchCampaign][${campaignShippingId}] CampaignShipping não encontrado | CampaignID: ${campaignId}`);
       return;
     }

     const chatId = `${campaignShipping.number}@s.whatsapp.net`;
     const body = campaignShipping.message;

     if (!body) {
       logger.warn(`[DispatchCampaign][${campaignShippingId}] Mensagem da campanha vazia | CampaignID: ${campaignId}`);
       return;
     }

     if (!isNil(campaign.fileListId)) {

       logger.info(`[DispatchCampaign][${campaignShippingId}] Recuperando arquivos para envio | CampaignID: ${campaignId}`);
       try {
         const publicFolder = path.resolve(__dirname, "..", "public");

         const files: { id: number; options: FilesOptions[] } = await ShowFileService(campaign.fileListId, campaign.companyId);
         const folder = path.resolve(publicFolder, "fileList", String(files.id));
         for (const [index, file] of files.options.entries()) {
           const options = await getMessageOptions(file.path, path.resolve(folder, file.path), file.name);
           await wbot.sendMessage(chatId, { ...options });


           logger.info(`[DispatchCampaign][${campaignShippingId}] Arquivo enviado: ${file.name} | CampaignID: ${campaignId}`);
         }
       } catch (error) {
         logger.error(`[DispatchCampaign][${campaignShippingId}] Erro ao enviar arquivos:`, error);
       }
     }

     if (campaign.mediaPath) {
       logger.info(`[DispatchCampaign][${campaignShippingId}] Enviando mídia da campanha: ${campaign.mediaPath} | CampaignID: ${campaignId}`);
       const publicFolder = path.resolve(__dirname, "..", "public");
       const filePath = path.join(publicFolder, campaign.mediaPath);

       const options = await getMessageOptions(campaign.mediaName, filePath, body);
       if (Object.keys(options).length) {
         await wbot.sendMessage(chatId, { ...options });
       }

     } else {
       logger.info(`[DispatchCampaign][${campaignShippingId}] Enviando texto simples da campanha | CampaignID: ${campaignId}`);
       await wbot.sendMessage(chatId, {
         text: body
       });
     }

     logger.info(`[DispatchCampaign][${campaignShippingId}] [🚩] -Atualizando campanha para enviada | CampaignID: ${campaignId}`);

     await campaignShipping.update({ deliveredAt: moment() });

     await verifyAndFinalizeCampaign(campaign);

     const io = getIO();
     io.to(`company-${campaign.companyId}-mainchannel`).emit(`company-${campaign.companyId}-campaign`, {
       action: "update",
       record: campaign
     });

     const contactName =
       campaignShipping.contact && typeof campaignShipping.contact === 'object' && 'name' in campaignShipping.contact
         ? campaignShipping.contact.name
         : "desconhecido";
     logger.info(
       `[🏁][DispatchCampaign] Campanha enviada: Campanha=${campaignId};Contato=${contactName}; CampaignShippingId=${campaignShippingId}`
     );

   } catch (err: any) {
     Sentry.captureException(err);
     logger.error(`[DispatchCampaign][Erro] ${err.message}`);
     logger.error(err.stack);
   }
 }

 async function handleLoginStatus(job) {
   const users: { id: number }[] = await sequelize.query(
     `select id from "Users" where "updatedAt" < now() - '5 minutes'::interval and online = true`,
     { type: QueryTypes.SELECT }
   );
   for (let item of users) {
     try {
       const user = await User.findByPk(item.id);
       await user.update({ online: false });
       logger.info(`Usuário passado para offline: ${item.id}`);
     } catch (e: any) {
       Sentry.captureException(e);
     }
   }
 }



 async function handleInvoiceCreate(): Promise<void> {
   logger.info("Iniciando geração de boletos");

   const companies = await Company.findAll();
   await Promise.all(companies.map(async c => {
     const dueDate = c.dueDate;
     const date = moment(dueDate).format();
     const timestamp = moment().format();
     const hoje = moment().format("DD/MM/yyyy");
     const vencimento = moment(dueDate).format("DD/MM/yyyy");

    const diff = moment(vencimento, "DD/MM/yyyy").diff(moment(hoje, "DD/MM/yyyy"));
    const dias = moment.duration(diff).asDays();

    if (dias < 20) {
      const plan = await Plan.findByPk(c.planId);

       const sql = `SELECT COUNT(*) mycount FROM "Invoices" WHERE "companyId" = ${c.id} AND "dueDate"::text LIKE '${moment(dueDate).format("yyyy-MM-DD")}%';`;
       const invoice: any[] = await sequelize.query(sql, { type: QueryTypes.SELECT });

       if (Number(invoice[0]?.mycount || 0) === 0) {
         const insertSql = `INSERT INTO "Invoices" (detail, status, value, "updatedAt", "createdAt", "dueDate", "companyId")
         VALUES ('${plan.name}', 'open', '${plan.value}', '${timestamp}', '${timestamp}', '${date}', ${c.id});`;

         await sequelize.query(insertSql, { type: QueryTypes.INSERT });

         const transporter = nodemailer.createTransport({
           host: process.env.MAIL_HOST,
           port: Number(process.env.MAIL_PORT),
           secure: false,
           auth: {
             user: process.env.MAIL_USER,
             pass: process.env.MAIL_PASS
           }
         });

         const mailOptions = {
           from: process.env.MAIL_FROM,
           to: `${c.email}`,
           subject: 'Fatura gerada - Sistema',
           html: `Olá ${c.name}, este é um email sobre sua fatura!<br>
           <br>
           Vencimento: ${vencimento}<br>
           Valor: ${plan.value}<br>
           Link: ${process.env.FRONTEND_URL}/financeiro<br>
           <br>
           Qualquer dúvida estamos à disposição!`
         };

         try {
           const info = await transporter.sendMail(mailOptions);
           logger.info('Email enviado:', info.messageId);
         } catch (error) {
           logger.error('Erro ao enviar email:', error);
         }
       }
     }
   }));
 }

 handleCloseTicketsAutomatic()

 export async function startQueueProcess() {

   logger.info("[🏁] - Iniciando processamento de filas");

   // MessageQueue: SendMessage
   new Worker(
     "MessageQueue",
     async job => {
       if (job.name === "SendMessage") await handleSendMessage(job);
       if (job.name === "InvoiceGenerator") await handleInvoiceCreate();
     },
     { connection: redisConnection }
   );

  // ScheduleMonitor: Verify
  new Worker(
    "ScheduleMonitor",
    async job => {
      if (job.name === "Verify") await handleVerifySchedules(job);
    },
    {
      connection: redisConnection
    }
  );

  // SendScheduledMessages: SendMessage
  new Worker(
    "SendScheduledMessages",
    async job => {
      if (job.name === "SendMessage") await handleSendScheduledMessage(job);
    },
    {
      connection: redisConnection
    }
  );

  // UserMonitor: VerifyLoginStatus
  new Worker(
    "UserMonitor",
    async job => {
      if (job.name === "VerifyLoginStatus") await handleLoginStatus(job);
    },
    {
      connection: redisConnection
    }
  );

  // CampaignQueue: VerifyCampaigns, ProcessCampaign, PrepareContact, DispatchCampaign
  new Worker(
    "CampaignQueue",
    async job => {
      if (job.name === "VerifyCampaigns") await handleVerifyCampaigns(job);
      else if (job.name === "ProcessCampaign") await handleProcessCampaign(job);
      else if (job.name === "PrepareContact") await handlePrepareContact(job);
      else if (job.name === "DispatchCampaign") await handleDispatchCampaign(job);
    },
    {
      connection: redisConnection
    }
  );

    new Worker(
     "QueueMonitor",
     async job => {
       if (job.name === "VerifyQueueStatus") await handleVerifyQueue(job);
     },
     {
       connection: redisConnection
     }
   );

  async function cleanupCampaignQueue() {
    try {
      await campaignQueue.clean(12 * 3600 * 1000, 0, "completed");
      await campaignQueue.clean(24 * 3600 * 1000, 0, "failed");

      const jobs = await campaignQueue.getJobs(['waiting', 'active']);
      for (const job of jobs) {
        if (Date.now() - job.timestamp > 24 * 3600 * 1000) {
          await job.remove();
        }
      }
    } catch (error) {
      logger.error('[🚨] - Erro na limpeza da fila de campanhas:', error);
    }
  }

  // Limpeza a cada 6 horas
  setInterval(cleanupCampaignQueue, 6 * 3600 * 1000);

  // Monitoramento a cada 5 minutos
  setInterval(async () => {
    const jobCounts = await campaignQueue.getJobCounts();
    const memoryUsage = process.memoryUsage();

    logger.info('[📌] - Status da fila de campanhas:', {
      jobs: jobCounts,
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
      }
    });
  }, 5 * 60 * 1000);

   // Log de conclusão da fila de campanha
   const campaignQueueEvents = new QueueEvents("CampaignQueue", { connection: redisConnection });
   campaignQueueEvents.on("completed", ({ jobId }) => {
     logger.info(`[📌] - Campanha completada com jobId=${jobId}`);
   });

   // Agendamento de tarefas recorrentes
   // BullMQ utiliza formato cron de 5 campos: min hour day month week
   await scheduleMonitor.add(
     "Verify",
     {},
     {

       repeat: { pattern: "*/5 * * * *", jobId: "verify" },
       removeOnComplete: true

     } as JobsOptions
   );


   await campaignQueue.add(
     "VerifyCampaigns",

     { companyId: null },
     {
       repeat: {
         pattern: "*/20 * * * *",
         jobId: "verify-campaign"
       }
       , removeOnComplete: true
     } as JobsOptions
   );


   await userMonitor.add(
     "VerifyLoginStatus",
     {},
     {
       repeat: {
         pattern: "*/1 * * * *",
         jobId: "verify-login"
       }
       , removeOnComplete: true
     } as JobsOptions
   );

   await messageQueue.add(
     "InvoiceGenerator",
     {},
     {
       repeat: {
         pattern: "0 */6 6-23 * *",
         jobId: "invoice-generator"
       }
       , removeOnComplete: true
     } as JobsOptions
   );


   await queueMonitor.add(
     "VerifyQueueStatus",
     {},
     {

       repeat: {
         pattern: "*/20 * * * *",
         jobId: "verify-queue"
       }
       , removeOnComplete: true
     } as JobsOptions
   );
 }

