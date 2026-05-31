const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\+?[0-9\s().-]{7,24}$/;

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

export async function POST(request) {
  const payload = await request.json();
  const errors = validate(payload);

  if (Object.keys(errors).length > 0) {
    return Response.json({ message: "Please complete the required fields.", errors }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL;
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || "Cowinmagnet Website <davidsha@zaihaisurfing.com>";

  if (resendKey && toEmail) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: payload.email,
        subject: `New inquiry from ${payload.name} - Cowinmagnet`,
        text: inquiryText(payload)
      })
    });

    if (!response.ok) {
      return Response.json(
        { message: "Inquiry received, but email delivery failed. Please check email API settings." },
        { status: 502 }
      );
    }

    return Response.json({ message: "Thank you. Your inquiry has been sent successfully." });
  }

  console.info(inquiryText(payload));
  return Response.json({
    message: "Thank you. Your inquiry has been captured in preview mode. Configure email settings before production."
  });
}
