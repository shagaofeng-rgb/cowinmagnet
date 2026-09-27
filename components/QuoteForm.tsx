"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Send } from "lucide-react";
import { getClientTrackingIdentity } from "@/lib/clientTrackingIdentity";
import { getLocaleFromPath } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

type ProductInquiryContext = {
  name: string;
  model?: string;
  family?: string;
  selectionFields?: { name: string; label: string; placeholder: string }[];
};

type QuoteFormProps = {
  compact?: boolean;
  defaultProduct?: string;
  productContext?: ProductInquiryContext;
  variant?: "default" | "home";
};

export function QuoteForm({ compact = false, defaultProduct = "", productContext, variant = "default" }: QuoteFormProps) {
  const locale = getLocaleFromPath(usePathname());
  const ui = getPublicUi(locale);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const isHomeForm = variant === "home";

  async function submit(formData: FormData) {
    setStatus("submitting");
    try {
      const payload: Record<string, unknown> = Object.fromEntries(formData.entries());
      payload.phone = payload.phone || payload.whatsapp || "";
      payload.productRequirement = payload.productRequirement || payload.requiredProduct || payload.productName || "";
      payload.materialType = payload.material || "";
      payload.applicationIndustry = payload.applicationIndustry || payload.industry || "";
      payload.installationPosition = payload.installationPosition || payload.installation || "";
      payload.selectionDetails = Object.entries(payload)
        .filter(([key, value]) => key.startsWith("selection") && value)
        .map(([key, value]) => `${key.replace(/^selection/, "")}: ${value}`)
        .join(" | ");
      payload.consent = "true";
      payload.sourcePath = window.location.pathname;
      payload.pageUrl = window.location.href;
      payload.sourceLanguage = document.documentElement.lang || window.location.pathname.split("/").filter(Boolean)[0] || "en";
      payload.utm = window.location.search;
      payload.attribution = (window as typeof window & { __cowinAttribution?: unknown }).__cowinAttribution || null;
      const trackingIdentity = getClientTrackingIdentity();
      payload.visitorId = trackingIdentity.visitorId;
      payload.sessionId = trackingIdentity.sessionId;
      const metaEventId = window.__cowinMetaCreateEventId?.("lead") || `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      payload.metaEventId = metaEventId;
      const metaBrowserIds = window.__cowinMetaBrowserIds?.() || { fbp: "", fbc: "" };
      payload.metaFbp = metaBrowserIds.fbp || "";
      payload.metaFbc = metaBrowserIds.fbc || "";

      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const tracker = (window as typeof window & { __cowinTrackEvent?: (type: string, extra?: Record<string, unknown>) => void }).__cowinTrackEvent;
      if (response.ok && tracker) {
        tracker("submit_inquiry", { page: window.location.pathname, attribution: payload.attribution });
      }
      if (response.ok) {
        window.__cowinMetaTrack?.("Lead", {
          content_name: String(payload.productRequirement || "Website inquiry"),
          content_category: "B2B inquiry"
        }, { eventId: metaEventId, sendServer: false });
      }
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form action={submit} className={`quote-form ${compact ? "quote-form-compact" : ""} ${isHomeForm ? "quote-form-home" : ""}`}>
      {productContext ? (
        <>
          <input type="hidden" name="productName" value={productContext.name} />
          <input type="hidden" name="productModel" value={productContext.model || ""} />
          <input type="hidden" name="productFamily" value={productContext.family || ""} />
          <input type="hidden" name="requiredProduct" value={productContext.name} />
        </>
      ) : null}
      <div className="field-grid">
        <label className="form-honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        {isHomeForm ? (
          <>
            <input type="hidden" name="country" value="Not provided" readOnly />
            <label className="field-wide">
              {ui.name} <span aria-hidden="true">*</span>
              <input name="name" required placeholder={ui.yourName} />
            </label>
            <label className="field-wide">
              {ui.company} <span aria-hidden="true">*</span>
              <input name="company" required placeholder={ui.yourCompany} />
            </label>
            <label>
              {ui.email} <span aria-hidden="true">*</span>
              <input name="email" type="email" required placeholder="name@company.com" />
            </label>
            <label>
              {ui.phone}
              <input name="phone" required placeholder="+1 555 000 0000" />
            </label>
            <label className="field-wide">
              {ui.selectProduct} <span aria-hidden="true">*</span>
              <select name="requiredProduct" defaultValue={defaultProduct} required>
                <option value="" disabled>{ui.selectProductHint}</option>
                <option value="Suspended Magnets">{ui.suspendedMagnets}</option>
                <option value="Magnetic Pulleys">{ui.magneticPulleys}</option>
                <option value="Drum Magnetic Separators">{ui.drumSeparators}</option>
                <option value="Magnetic Bars & Grates">{ui.barsGrates}</option>
                <option value="Customized Solution">{ui.customizedSolution}</option>
              </select>
            </label>
            <label className="field-wide">
              {ui.project}
              <textarea name="message" required placeholder={ui.projectHint} rows={4} />
            </label>
          </>
        ) : (
          <>
            <label>
              {ui.name}
              <input name="name" required placeholder={ui.yourName} />
            </label>
            <label>
              {ui.email}
              <input name="email" type="email" required placeholder="name@company.com" />
            </label>
            <label>
              {ui.country}
              <input name="country" required placeholder={ui.countryHint} />
            </label>
            <label>
              {ui.phone}
              <input name="phone" required placeholder="+1 555 000 0000" />
            </label>
            {!compact && !productContext && (
              <>
                <label>
                  {ui.industry}
                  <input name="industry" placeholder={ui.industry} />
                </label>
                <label>
                  {ui.material}
                  <input name="material" placeholder={ui.material} />
                </label>
                <label>
                  {ui.beltWidth}
                  <input name="beltWidth" placeholder="800 mm" />
                </label>
                <label>
                  {ui.installation}
                  <input name="installation" placeholder={ui.installation} />
                </label>
              </>
            )}
            {productContext ? (
              <label className="field-wide">
                {ui.selectedProduct}
                <input value={productContext.name} readOnly aria-readonly="true" />
              </label>
            ) : (
              <label className="field-wide">
                {ui.productInterest}
                <input name="requiredProduct" defaultValue={defaultProduct} placeholder={ui.productInterestHint} />
              </label>
            )}
            {productContext?.selectionFields?.map((field) => (
              <label key={field.name}>
                {field.label}
                <input name={field.name} placeholder={field.placeholder} />
              </label>
            ))}
            <label className="field-wide">
              {ui.requirements}
              <textarea name="message" required placeholder={ui.requirementsHint} rows={compact ? 4 : 6} />
            </label>
            {!compact && (
              <label className="field-wide">
                {ui.attachment}
                <input name="attachmentNote" placeholder={ui.attachmentHint} />
              </label>
            )}
          </>
        )}
      </div>
      <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>
        <Send size={17} aria-hidden />
        {status === "submitting" ? ui.sending : ui.submit}
      </button>
      {status === "success" && (
        <p className="form-success" role="status" aria-live="polite">{ui.success}</p>
      )}
      {status === "error" && (
        <p className="form-error" role="alert">{ui.error}</p>
      )}
    </form>
  );
}
