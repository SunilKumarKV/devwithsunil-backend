const nodemailer = require("nodemailer");
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_TO,
} = process.env;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
  console.warn(
    "Mailer is not fully configured via environment variables. Email sending may fail.",
  );
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT) || 587,
  secure: EMAIL_SECURE === "true",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

exports.sendContactNotification = async ({ name, email, message }) => {
  const mailOptions = {
    from: `DevWithSunil Website <${EMAIL_USER}>`,
    to: EMAIL_TO,
    subject: `New contact message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>`,
  };

  return transporter.sendMail(mailOptions);
};

exports.sendNewsletterWelcome = async (email) => {
  const mailOptions = {
    from: `DevWithSunil <${EMAIL_USER}>`,
    to: email,
    subject: "Welcome to DevWithSunil Newsletter!",
    text: `Thank you for subscribing to the DevWithSunil newsletter!\n\nYou'll receive updates on the latest blog posts, tutorials, and tech insights.\n\nBest regards,\nSunil Kumar`,
    html: `<h2>Welcome to DevWithSunil Newsletter!</h2><p>Thank you for subscribing!</p><p>You'll receive updates on the latest blog posts, tutorials, and tech insights.</p><p>Best regards,<br>Sunil Kumar</p>`,
  };

  return transporter.sendMail(mailOptions);
};
