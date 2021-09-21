import nodemailer from 'nodemailer';

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
      user: 'amrutiyajay98@gmail.com',
      pass: 'jay@28101998',
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
