import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

async function sendMail({ receiverMail, mailSubject, route, token, expires }) {
  const mailOptions = {
    to: receiverMail,
    subject: mailSubject,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Account Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                text-align: center;
            }
            .container {
                max-width: 600px;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: auto;
            }
            h2 {
                color: #333;
            }
            p {
                color: #666;
            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: #ffffff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .link-container {
                background: #eee;
                padding: 10px;
                border-radius: 5px;
                word-break: break-word;
                overflow-wrap: break-word;
            }
            .note {
                color: #ff0000;
                margin-top: 20px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>${mailSubject}</h2>
            <p>Please click on the button below:</p>
            <a href="${process.env.BASE_URL}/api/v1/users${route}?token=${token}" class="button">${mailSubject}</a>
            <p style="margin-top: 20px;">Or, copy and paste the following link into your browser:</p>
            <p class="link-container">${process.env.BASE_URL}/api/v1/users${route}?token=${token}</p>
            <p class="note">Note: This token expires within ${expires} minutes.</p>
        </div>
    </body>
    </html>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email");
  }
}

export default sendMail;
