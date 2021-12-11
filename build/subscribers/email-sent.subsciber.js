"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCommonEmail = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
const env_1 = __importDefault(require("../config/env"));
const node_mailer_1 = require("../utils/node-mailer");
const container_1 = require("../config/container");
const types_1 = require("../config/types");
// Handle send password reset email event
async function sendCommonEmail(args) {
    const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
    const databaseService = container_1.iocContainer.get(types_1.TYPES.DatabaseService);
    loggerService.getLogger().info(`Sending ${args.subject} email`);
    // Get the database client
    const client = databaseService.Client();
    const body = `${args.body}`;
    const subject = `${args.subject}`;
    console.log(body);
    try {
        await node_mailer_1.sendEmail(env_1.default.EMAIL_SENDER_ADDRESS, args.emailId, subject, body, 'donotreply@knn.com');
        await client.email.create({
            data: {
                address: args.emailId,
                content: body,
                subject,
                status: 'SUCCESS',
                sentAt: new Date(),
                createdAt: new Date(),
            },
        });
        await client.$disconnect();
        loggerService.getLogger().info(`${args.subject} email sent successfully.`);
    }
    catch (error) {
        console.log('Error: ', error);
        await client.email.create({
            data: {
                address: args.emailId,
                content: body,
                subject,
                status: 'FAILED',
                sentAt: new Date(),
                createdAt: new Date(),
            },
        });
        await client.$disconnect();
        loggerService.getLogger().error(`${args.subject} email failed. ${error}`);
    }
}
exports.sendCommonEmail = sendCommonEmail;
