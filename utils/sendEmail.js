const nodemailer = require("nodemailer");

// Konfiguracja transportera Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // lub inny dostawca SMTP
  auth: {
    user: process.env.EMAIL_USER, // Twój adres e-mail
    pass: process.env.EMAIL_PASS, // Hasło aplikacji do konta Gmail
  },
});

// Funkcja do wysyłania e-maili
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Nadawca wiadomości (Twój e-mail)
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
