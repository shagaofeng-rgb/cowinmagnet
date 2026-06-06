import nodemailer from "nodemailer";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\+?[0-9\s().-]{7,24}$/;
const MAX_TEXT_LENGTH = 3000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const inquiryRateLimit = globalThis.__cowinInquiryRateLimit || new Map();
globalThis.__cowinInquiryRateLimit = inquiryRateLimit;

function parseEmailList(value) {
  return String(value || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function validate(payload) {
  const errors = {};
  if (!payload || typeof payload !== "object") errors.form = "Invalid inquiry payload.";
  if (!payload.name?.trim()) errors.name = "Name is required.";
  if (!payload.email?.trim()) errors.email = "Email is required.";
  else if (!emailPattern.test(payload.email.trim())) errors.email = "Email format is invalid.";
  if (!payload.phone?.trim()) errors.phone = "Phone is required.";
  else if (!phonePattern.test(payload.phone.trim())) errors.phone = "Phone format is invalid.";
  if (!payload.country?.trim()) errors.country = "Country / Region is required.";
  if (!payload.message?.trim()) errors.message = "Message is required.";
  if (payload.website?.trim()) errors.website = "Spam submission blocked.";
  if (!payload.consent) errors.consent = "Business inquiry confirmation is required.";
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" && value.length > MAX_TEXT_LENGTH) {
      errors[key] = "This field is too long.";
    }
  }
  return errors;
}

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(key) {
  const now = Date.now();
  const bucket = inquiryRateLimit.get(key) || [];
  const recent = bucket.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  inquiryRateLimit.set(key, recent);
  return recent.length <= RATE_LIMIT_MAX;
}

function escapeHtml(value) {
  return String(value || "-").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inquiryText(payload) {
  return [
    "New Cowinmagnet B2B Inquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone / WhatsApp: ${payload.phone}`,
    `Company: ${payload.company || "-"}`,
    `Country / Region: ${payload.country || "-"}`,
    `Buyer Type: ${payload.buyerType || "-"}`,
    `Product Requirement: ${payload.productRequirement || "-"}`,
    `Application Industry: ${payload.applicationIndustry || "-"}`,
    `Material Type: ${payload.materialType || "-"}`,
    `Belt Width / Capacity: ${payload.beltWidth || "-"}`,
    `Installation Position: ${payload.installationPosition || "-"}`,
    `Expected Quantity: ${payload.expectedQuantity || "-"}`,
    `Source Page: ${payload.sourcePath || "-"}`,
    `Source Language: ${payload.sourceLanguage || "-"}`,
    `UTM / Query: ${payload.utm || "-"}`,
    `Client IP: ${payload.clientIp || "-"}`,
    `User Agent: ${payload.userAgent || "-"}`,
    `Submitted At: ${payload.submittedAt || "-"}`,
    "",
    "Message:",
    payload.message || "-"
  ].join("\n");
}

function inquiryHtml(payload) {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone / WhatsApp", payload.phone],
    ["Company", payload.company || "-"],
    ["Country / Region", payload.country || "-"],
    ["Buyer Type", payload.buyerType || "-"],
    ["Product Requirement", payload.productRequirement || "-"],
    ["Application Industry", payload.applicationIndustry || "-"],
    ["Material Type", payload.materialType || "-"],
    ["Belt Width / Capacity", payload.beltWidth || "-"],
    ["Installation Position", payload.installationPosition || "-"],
    ["Expected Quantity", payload.expectedQuantity || "-"],
    ["Source Page", payload.sourcePath || "-"],
    ["Source Language", payload.sourceLanguage || "-"],
    ["UTM / Query", payload.utm || "-"],
    ["Client IP", payload.clientIp || "-"],
    ["User Agent", payload.userAgent || "-"],
    ["Submitted At", payload.submittedAt || "-"]
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#101722;line-height:1.6">
      <h2 style="margin:0 0 16px;color:#07111f">New Cowinmagnet B2B Inquiry</h2>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="width:180px;padding:10px;border:1px solid #d9e1ea;background:#f6f8fb;font-weight:700">${label}</td>
                <td style="padding:10px;border:1px solid #d9e1ea">${escapeHtml(value)}</td>
              </tr>
            `
          )
          .join("")}
      </table>
      <h3 style="margin:20px 0 8px">Message</h3>
      <div style="padding:14px;border:1px solid #d9e1ea;background:#f9fbfe;white-space:pre-wrap">${escapeHtml(payload.message)}</div>
    </div>
  `;
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const ip = clientIp(request);
  payload = {
    ...payload,
    clientIp: ip,
    userAgent: request.headers.get("user-agent") || "-",
    submittedAt: new Date().toISOString()
  };
  const errors = validate(payload);

  if (Object.keys(errors).length > 0) {
    return Response.json({ message: "Please complete the required fields.", errors }, { status: 400 });
  }

  const rateLimitKey = `${ip}:${String(payload.email || "").trim().toLowerCase()}`;
  if (!checkRateLimit(rateLimitKey)) {
    return Response.json(
      { message: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const toEmail = process.env.INQUIRY_TO_EMAIL;
  const bccEmails = parseEmailList(process.env.INQUIRY_BCC_EMAILS);
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || "Cowinmagnet Website <davidsha@cowinmagnet.com>";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE !== "false";

  if (smtpHost && smtpUser && smtpPass && toEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: fromEmail,
        to: [toEmail],
        bcc: bccEmails,
        replyTo: payload.email,
        subject: `New inquiry from ${payload.name} - Cowinmagnet`,
        text: inquiryText(payload),
        html: inquiryHtml(payload)
      });

      return Response.json({ message: "Thank you. Your inquiry has been sent successfully." });
    } catch (error) {
      console.error("SMTP inquiry delivery failed", error);
      return Response.json(
        { message: "Inquiry received, but email delivery failed. Please check SMTP settings." },
        { status: 502 }
      );
    }
  }

  console.info(`Inquiry received without SMTP delivery: ${payload.email} from ${payload.country || "-"} via ${payload.sourcePath || "-"}`);
  return Response.json({
    message: "Thank you. Your inquiry has been received. Email delivery is not configured on this environment."
  });
}
