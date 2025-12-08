import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

console.log("SMTP_USER =", SMTP_USER);
console.log("SMTP_PASS exists =", !!SMTP_PASS);

if (!SMTP_USER || !SMTP_PASS) {
  console.warn("⚠️ SMTP_USER / SMTP_PASS manquants dans .env");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendPaymentSuccessEmail({ to, courseId, amount }) {
  if (!to) throw new Error("email destinataire manquant");

  const mailOptions = {
    from: `"Plateforme éducative" <${SMTP_USER}>`,
    to,
    subject: "✅ Confirmation de votre achat",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">
        <h2>Merci pour votre achat !</h2>
        <p>Votre paiement a été validé avec succès.</p>
        <ul>
          <li><b>Cours :</b> ${courseId}</li>
          <li><b>Montant :</b> ${amount} DT</li>
        </ul>
        <p>Vous pouvez maintenant accéder au cours complet.</p>
        <br/>
        <p>Equipe Plateforme éducative</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
