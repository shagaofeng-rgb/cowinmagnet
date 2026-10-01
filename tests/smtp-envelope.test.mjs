import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("site emails use the authenticated SMTP account for MAIL FROM", async () => {
  const paths = [
    "../app/api/inquiry/route.js",
    "../lib/adminEmail.js",
    "../lib/monitor/email.mjs"
  ];
  const sources = await Promise.all(paths.map((path) => readFile(new URL(path, import.meta.url), "utf8")));

  assert.match(sources[0], /envelope: \{ from: smtpUser, to: \[toEmail, \.\.\.bccEmails\] \}/);
  assert.match(sources[1], /envelope: \{ from: process\.env\.SMTP_USER, to \}/);
  assert.match(sources[2], /envelope: \{ from: process\.env\.SMTP_USER, to: recipients \}/);
});

test("marked form checks do not create customer attribution or Meta Lead events", async () => {
  const inquiry = await readFile(new URL("../app/api/inquiry/route.js", import.meta.url), "utf8");
  const monthly = await readFile(new URL("../app/api/cron/monthly-inquiry-test/route.js", import.meta.url), "utf8");

  assert.match(inquiry, /const isMarkedTest = payload\.isTest === true && payload\.formType === "test"/);
  assert.match(inquiry, /if \(!isMarkedTest\) await recordInquiryAttribution\(payload\)/);
  assert.match(monthly, /formType: "test",\s+isTest: true/);
  assert.match(monthly, /const ok = response\.status === 200 && delivery\?\.deliveryStatus === "sent"/);
});
