"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEventRegistrationEmail = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
const env_1 = __importDefault(require("../config/env"));
const node_mailer_1 = require("../utils/node-mailer");
const container_1 = require("../config/container");
const types_1 = require("../config/types");
// Handle send password reset email event
async function sendEventRegistrationEmail(args) {
    const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
    const databaseService = container_1.iocContainer.get(types_1.TYPES.DatabaseService);
    loggerService.getLogger().info('Sending event registration email');
    // Get the database client
    const client = databaseService.Client();
    const body = `<p>You successfully register for <b>${args.eventName}</b>.</p><br><b>Start At:</b><p>${args.eventStartAt}</p><br><b>End At:</b><p>${args.eventEndAt}</p><br><b>Venue:</b><p>${args.eventVenue}</p>`;
    const subject = 'Knn - Event Registration';
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
        loggerService
            .getLogger()
            .info('Event registration email sent successfully.');
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
        loggerService
            .getLogger()
            .error(`Sending Event registration email failed. ${error}`);
    }
}
exports.sendEventRegistrationEmail = sendEventRegistrationEmail;
