"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../config/env"));
function sendEmail(fromAddress, toAddress, subject, htmlBody, replyTo) {
    console.log('in sendMail');
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
            user: env_1.default.EMAIL_SENDER_ADDRESS,
            pass: env_1.default.EMAIL_SENDER_PASSWORD,
        },
    });
    const mailOption = {
        from: fromAddress,
        to: toAddress,
        subject: subject,
        html: htmlBody,
    };
    return transporter.sendMail(mailOption);
}
exports.sendEmail = sendEmail;
