"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_registration_subsciber_1 = require("./event-registration.subsciber");
const reset_password_subscriber_1 = require("./reset-password.subscriber");
const email_sent_subsciber_1 = require("./email-sent.subsciber");
exports.default = {
    sendResetPasswordEmail: reset_password_subscriber_1.sendResetPasswordEmail,
    sendEventRegistrationEmail: event_registration_subsciber_1.sendEventRegistrationEmail,
    sendCommonEmail: email_sent_subsciber_1.sendCommonEmail,
};
