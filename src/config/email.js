import nodemailer from 'nodemailer';

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

const sendEmail = async (to, subject, body) => {
    const mailData = {
        from: "yassinem@wicotech.net",
        to: to,
        subject: subject,
        text: body,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error('Failed to send email:', err);
                reject(err);
            } else {
                console.log("Email sent successfully:", info);
                resolve(info);
            }
        });
    });
};

export { sendEmail };
