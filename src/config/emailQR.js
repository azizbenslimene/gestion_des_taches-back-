import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import fs from 'fs';

// Configure nodemailer transporter with correct SMTP settings
const transporter = nodemailer.createTransport({
  host: 'mail.wicotech.net', // Your SMTP server
  port: 587, // For TLS (STARTTLS)
  secure: false, // Use TLS, not SSL
  auth: {
    user: "yassinem@wicotech.net", // Your email address
    pass: "yassine123", // Your email password
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates (if necessary)
  }
});

// Function to generate QR code with unique data
const generateQRCode = async (data) => {
  try {
    const qrPath = './qrcode.png'; // Path to save the QR code image temporarily
    await QRCode.toFile(qrPath, data);
    return qrPath;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Function to send email with QR code
const sendEmailWithQRCode = async (to, subject, body, qrData) => {
  try {
    const qrPath = await generateQRCode(qrData);

    const mailData = {
      from: "yassinem@wicotech.net", // Sender email
      to: to, // Receiver email
      subject: subject,
      text: body,
      html: `<p>${body}</p><p>Scan the QR code below to verify your account:</p><img src="cid:unique@qrcode"/>`,
      attachments: [
        {
          filename: 'qrcode.png',
          path: qrPath,
          cid: 'unique@qrcode', // Embeds QR code in the email
        },
      ],
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error('Failed to send email:', err);
          reject(err);
        } else {
          console.log("Email sent successfully:", info);
          fs.unlinkSync(qrPath); // Delete the QR code file after sending the email
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error('Error sending email with QR code:', error);
    throw error;
  }
};

// Exporting the functions for use in other files
export { sendEmailWithQRCode, generateQRCode, transporter };
