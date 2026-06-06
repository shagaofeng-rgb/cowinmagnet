import nodemailer from "nodemailer";

function smtpPassword() {
  return process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "";
}

function smtpFrom() {
  return process.env.SMTP_FROM || process.env.INQUIRY_FROM_EMAIL || "";
}

export function isMonitorEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && smtpPassword() && smtpFrom());
}

export async function sendMonitorEmail({ recipients, subject, text, html, attachments = [] }) {
  if (!isMonitorEmailConfigured()) {
    return { sent: false, reason: "smtp-not-configured" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPassword()
    }
  });

  await transporter.sendMail({
    from: smtpFrom(),
    to: recipients,
    subject,
    text,
    html,
    attachments
  });

  return { sent: true };
}
