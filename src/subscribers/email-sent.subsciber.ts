/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import ENV from '../config/env';
import { sendEmail } from '../utils/node-mailer';

import { iocContainer as Container } from '../config/container';
import { TYPES } from '../config/types';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IDatabaseService } from '../interfaces/IDatabaseService';

// Handle send password reset email event
export async function sendCommonEmail(args: any) {
  const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
  const databaseService = Container.get<IDatabaseService>(
    TYPES.DatabaseService,
  );

  loggerService.getLogger().info(`Sending ${args.subject} email`);

  // Get the database client
  const client = databaseService.Client();
  const body = `${args.body}`;
  const subject = `${args.subject}`;
  console.log(body);

  try {
    await sendEmail(
      ENV.EMAIL_SENDER_ADDRESS!,
      args.emailId,
      subject,
      body,
      'donotreply@knn.com',
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

    loggerService.getLogger().info(`${args.subject} email sent successfully.`);
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

    loggerService.getLogger().error(`${args.subject} email failed. ${error}`);
  }
}
