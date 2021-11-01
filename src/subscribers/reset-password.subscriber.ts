/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import ENV from '../config/env';
import { sendEmail } from '../utils/node-mailer';

import { iocContainer as Container } from '../config/container';
import { TYPES } from '../config/types';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IDatabaseService } from '../interfaces/IDatabaseService';

// Handle send password reset email event
export async function sendResetPasswordEmail(args: any) {
  const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
  const databaseService = Container.get<IDatabaseService>(
    TYPES.DatabaseService,
  );

  loggerService.getLogger().info('Sending reset password email');

  // Get the database client
  const client = databaseService.Client();
  const body = `<p>We recieved a request to reset your account password. Please <a href="${ENV.RESET_PASSWORD_ROUTE}?userId=${args.userId}&nonce=${args.nonce}">click here</a> to reset you password.</p>`;
  const subject = 'Knn - Password Reset';
  console.log(body);

  try {
    await sendEmail(
      ENV.EMAIL_SENDER_ADDRESS!,
      args.emailId,
      subject,
      body,
      'donotreply@thelink.com',
    );

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
  } catch (error) {
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
