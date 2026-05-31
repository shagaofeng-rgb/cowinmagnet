import nodemailer from "nodemailer";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\+?[0-9\s().-]{7,24}$/;

function parseEmailList(value) {
  return String(value || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function validate(payload) {
  const errors = {};
  if (!payload.name?.trim()) errors.name = "Name is required.";
  if (!payload.email?.trim()) errors.email = "Email is required.";
  else if (!emailPattern.test(payload.email.trim())) errors.email = "Email format is invalid.";
  if (!payload.phone?.trim()) errors.phone = "Phone is required.";
  else if (!phonePattern.test(payload.phone.trim())) errors.phone = "Phone format is invalid.";
  if (payload.website?.trim()) errors.website = "Spam submission blocked.";
  if (!payload.consent) errors.consent = "Business inquiry confirmation is required.";
  return errors;
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
    `Product Requirement: ${payload.productRequirement || "-"}`,
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
    ["Product Requirement", payload.productRequirement || "-"]
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
                <td style="padding:10px;border:1px solid #d9e1ea">${String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
              </tr>
            `
          )
          .join("")}
      </table>
      <h3 style="margin:20px 0 8px">Message</h3>
      <div style="padding:14px;border:1px solid #d9e1ea;background:#f9fbfe;white-space:pre-wrap">${String(payload.message || "-")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</div>
    </div>
  `;
}

export async function POST(request) {
  const payload = await request.json();
  const errors = validate(payload);

  if (Object.keys(errors).length > 0) {
    return Response.json({ message: "Please complete the required fields.", errors }, { status: 400 });
  }

  const toEmail = process.env.INQUIRY_TO_EMAIL;
  const bccEmails = parseEmailList(process.env.INQUIRY_BCC_EMAILS);
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || "Cowinmagnet Website <davidsha@cowinmagnet.com>";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
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

  console.info(inquiryText(payload));
  return Response.json({
    message: "Thank you. Your inquiry has been captured in preview mode. Configure email settings before production."
  });
}
