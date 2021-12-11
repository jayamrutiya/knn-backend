"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
const env_1 = __importDefault(require("../config/env"));
const node_mailer_1 = require("../utils/node-mailer");
const container_1 = require("../config/container");
const types_1 = require("../config/types");
// Handle send password reset email event
async function sendResetPasswordEmail(args) {
    const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
    const databaseService = container_1.iocContainer.get(types_1.TYPES.DatabaseService);
    loggerService.getLogger().info('Sending reset password email');
    // Get the database client
    const client = databaseService.Client();
    const body = `<p>We recieved a request to reset your account password. Please <a href="${env_1.default.RESET_PASSWORD_ROUTE}?userId=${args.userId}&nonce=${args.nonce}">click here</a> to reset you password.</p>`;
    const subject = 'Knn - Password Reset';
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
        loggerService.getLogger().info('Reset password email sent successfully.');
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
            .error(`Sending reset password email failed. ${error}`);
    }
}
exports.sendResetPasswordEmail = sendResetPasswordEmail;
