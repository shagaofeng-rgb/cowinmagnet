import nodemailer from "nodemailer";

const recipient = "info@cowinmagnet.com";

function parseEmailList(value) {
  return String(value || "").split(",").map((email) => email.trim()).filter(Boolean);
}

function safeLine(value) {
  return String(value ?? "-").replace(/[\r\n]+/g, " ").trim() || "-";
}

function messageText(payload) {
  const fields = [
    ["Inquiry ID", payload.inquiryId],
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone / WhatsApp", payload.phone],
    ["Company", payload.company],
    ["Country / Region", payload.country],
    ["Buyer Type", payload.buyerType],
    ["Product Page", payload.productName],
    ["Product Model", payload.productModel],
    ["Product Family", payload.productFamily],
    ["Product Requirement", payload.productRequirement],
    ["Application Industry", payload.applicationIndustry],
    ["Material Type", payload.materialType],
    ["Belt Width / Capacity", payload.beltWidth],
    ["Installation Position", payload.installationPosition],
    ["Product Selection Details", payload.selectionDetails],
    ["Expected Quantity", payload.expectedQuantity],
    ["Source Page", payload.sourcePath],
    ["Source Language", payload.sourceLanguage],
    ["UTM / Query", payload.utm],
    ["Client IP", payload.clientIp],
    ["User Agent", payload.userAgent],
    ["Submitted At", payload.submittedAt]
  ];
  const attribution = payload.attribution || {};
  for (const key of ["firstTouch", "lastTouch", "sessionTouch"]) {
    const touch = attribution[key] || {};
    fields.push([key, [touch.source, touch.medium, touch.campaign, touch.platform, touch.landingPage].filter(Boolean).join(" / ")]);
  }
  return [
    "New Cowinmagnet B2B Inquiry",
    "",
    ...fields.map(([label, value]) => `${label}: ${safeLine(value)}`),
    "",
    "Message:",
    String(payload.message || "-")
  ].join("\n");
}

export function inquiryNotificationConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && (process.env.SMTP_PASSWORD || process.env.SMTP_PASS));
}

export async function sendInquiryNotification(payload, { text, html } = {}) {
  if (!inquiryNotificationConfigured()) return { sent: false, reason: "smtp-not-configured" };

  const smtpUser = process.env.SMTP_USER;
  const bcc = parseEmailList(process.env.INQUIRY_BCC_EMAILS).filter((email) => email.toLowerCase() !== recipient);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user: smtpUser, pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.INQUIRY_FROM_EMAIL || `Cowinmagnet Website <${recipient}>`,
      envelope: { from: smtpUser, to: [recipient, ...bcc] },
      to: recipient,
      bcc,
      replyTo: payload.email,
      messageId: payload.inquiryId ? `<${payload.inquiryId}@cowinmagnet.com>` : undefined,
      subject: `New inquiry from ${safeLine(payload.name)} - Cowinmagnet`,
      text: text || messageText(payload),
      ...(html ? { html } : {})
    });
    return { sent: true, messageId: info.messageId || "" };
  } catch (error) {
    const reason = error?.code ? `smtp-${String(error.code).toLowerCase()}` : "smtp-delivery-failed";
    console.error("SMTP inquiry delivery failed", { inquiryId: payload.inquiryId || "", reason });
    return { sent: false, reason };
  } finally {
    transporter.close();
  }
}
