import nodemailer from "nodemailer";

function smtpPassword() {
  return process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "";
}

function smtpFrom() {
  return process.env.SMTP_FROM || process.env.INQUIRY_FROM_EMAIL || "";
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && smtpPassword() && smtpFrom());
}

export function createSmtpTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: String(process.env.SMTP_SECURE || "true") !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPassword()
    }
  });
}

export async function sendAdminPasswordResetEmail({ to, resetUrl }) {
  if (!isSmtpConfigured()) {
    console.warn("Admin password reset email skipped because SMTP is not configured.");
    return { sent: false, reason: "smtp-not-configured" };
  }

  const transporter = createSmtpTransporter();
  await transporter.sendMail({
    from: smtpFrom(),
    to,
    subject: "Reset Your Admin Password",
    text: [
      "Hello,",
      "",
      "We received a request to reset the password for your website admin account.",
      "",
      "Click the link below to set a new password:",
      resetUrl,
      "",
      "This link will expire in 60 minutes. If you did not request this, please ignore this email.",
      "",
      "Best regards,",
      "Cowinmagnet Website Admin System"
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.65">
        <h2 style="margin:0 0 14px">Reset Your Admin Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your website admin account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#facc15;color:#0f172a;font-weight:700;text-decoration:none">
            Reset Password
          </a>
        </p>
        <p style="word-break:break-all;color:#475569">${resetUrl}</p>
        <p>This link will expire in 60 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br />Cowinmagnet Website Admin System</p>
      </div>
    `
  });

  return { sent: true };
}
