/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import ENV from '../config/env';
import { sendEmail } from '../utils/node-mailer';

import { iocContainer as Container } from '../config/container';
import { TYPES } from '../config/types';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IDatabaseService } from '../interfaces/IDatabaseService';

// Handle send password reset email event
export async function sendEventRegistrationEmail(args: any) {
  const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
  const databaseService = Container.get<IDatabaseService>(
    TYPES.DatabaseService,
  );

  loggerService.getLogger().info('Sending event registration email');

  // Get the database client
  const client = databaseService.Client();
  const body = `<p>You successfully register for <b>${args.eventName}</b>.</p><br><b>Start At:</b><p>${args.eventStartAt}</p><br><b>End At:</b><p>${args.eventEndAt}</p><br><b>Venue:</b><p>${args.eventVenue}</p>`;
  const subject = 'Knn - Event Registration';
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

    loggerService
      .getLogger()
      .info('Event registration email sent successfully.');
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
      .error(`Sending Event registration email failed. ${error}`);
  }
}
