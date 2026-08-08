"use client";

import { useState } from "react";
import { Send } from "lucide-react";

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
};

export function QuoteForm({ compact = false, defaultProduct = "", productContext }: QuoteFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
      payload.sourceUrl = window.location.href;
      payload.sourceLanguage = document.documentElement.lang || window.location.pathname.split("/").filter(Boolean)[0] || "en";
      payload.utm = window.location.search;
      payload.attribution = (window as typeof window & { __cowinAttribution?: unknown }).__cowinAttribution || null;

      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const tracker = (window as typeof window & { __cowinTrackEvent?: (type: string, extra?: Record<string, unknown>) => void }).__cowinTrackEvent;
      if (response.ok && tracker) {
        tracker("submit_inquiry", { page: window.location.pathname, attribution: payload.attribution });
      }
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form action={submit} className={`quote-form ${compact ? "quote-form-compact" : ""}`}>
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
        <label>
          Name
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required placeholder="name@company.com" />
        </label>
        <label>
          Country
          <input name="country" required placeholder="Country / region" />
        </label>
        <label>
          Phone / WhatsApp
          <input name="phone" required placeholder="+1 555 000 0000" />
        </label>
        {!compact && !productContext && (
          <>
            <label>
              Industry
              <input name="industry" placeholder="Mining, recycling, cement..." />
            </label>
            <label>
              Material
              <input name="material" placeholder="Ore, coal, aggregate, waste..." />
            </label>
            <label>
              Belt Width
              <input name="beltWidth" placeholder="e.g. 800 mm" />
            </label>
            <label>
              Installation Method
              <input name="installation" placeholder="Cross-belt, inline, chute..." />
            </label>
          </>
        )}
        {productContext ? (
          <label className="field-wide">
            Product selected
            <input value={productContext.name} readOnly aria-readonly="true" />
          </label>
        ) : (
          <label className="field-wide">
            Product of interest
            <input name="requiredProduct" defaultValue={defaultProduct} placeholder="Product name or equipment type" />
          </label>
        )}
        {productContext?.selectionFields?.map((field) => (
          <label key={field.name}>
            {field.label}
            <input name={field.name} placeholder={field.placeholder} />
          </label>
        ))}
        <label className="field-wide">
          Product Requirement / Message
          <textarea name="message" required placeholder="Tell us your material, belt width, capacity, installation height, and target iron removal result." rows={compact ? 4 : 6} />
        </label>
        {!compact && (
          <label className="field-wide">
            Upload Drawing / Photo
            <input name="attachmentNote" placeholder="Paste a file link or note that drawings/photos are available" />
          </label>
        )}
      </div>
      <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>
        <Send size={17} aria-hidden />
        {status === "submitting" ? "Sending..." : "Submit Inquiry"}
      </button>
      {status === "success" && (
        <p className="form-success" role="status" aria-live="polite">Thank you. Our sales team will contact you soon.</p>
      )}
      {status === "error" && (
        <p className="form-error" role="alert">The form could not be sent. Please email us directly and we will help you quickly.</p>
      )}
    </form>
  );
}
