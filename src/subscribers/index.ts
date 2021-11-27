import { sendEventRegistrationEmail } from './event-registration.subsciber';
import { sendResetPasswordEmail } from './reset-password.subscriber';
import { sendCommonEmail } from './email-sent.subsciber';

export default {
  sendResetPasswordEmail,
  sendEventRegistrationEmail,
  sendCommonEmail,
};
