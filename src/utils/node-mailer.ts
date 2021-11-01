import nodemailer from 'nodemailer';
import ENV from '../config/env';

export function sendEmail(
  fromAddress: string,
  toAddress: string,
  subject: string,
  htmlBody: string,
  replyTo: string,
) {
  console.log('in sendMail');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    auth: {
      user: ENV.EMAIL_SENDER_ADDRESS,
      pass: ENV.EMAIL_SENDER_PASSWORD,
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
