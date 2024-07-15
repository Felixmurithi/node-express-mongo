import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  //create promises
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // for gmail you need to activate ''less secure option
  });

  //    email options
  const mailOptions = {
    from: 'mimi sasaa',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the mail
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
