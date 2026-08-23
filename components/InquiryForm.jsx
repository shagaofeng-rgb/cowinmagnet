"use client";

import { useMemo, useState } from "react";
import { getClientTrackingIdentity } from "@/lib/clientTrackingIdentity";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  buyerType: "",
  productRequirement: "",
  applicationIndustry: "",
  materialType: "",
  beltWidth: "",
  installationPosition: "",
  expectedQuantity: "",
  message: "",
  website: "",
  consent: false
};

const productRequirementGroups = [
  {
    label: "Permanent Magnetic Separation Equipment",
    options: [
      "Permanent overband magnetic separator",
      "Suspended permanent magnetic separator",
      "Self-cleaning permanent magnetic separator",
      "Suspended permanent self-unloading magnetic separator",
      "Permanent magnetic drum",
      "Permanent magnetic pulley",
      "Permanent magnetic plate separator",
      "Pipeline permanent magnetic separator"
    ]
  },
  {
    label: "Electromagnetic Separation Equipment",
    options: [
      "Suspended electromagnetic iron separator",
      "Suspended electromagnetic self-unloading magnetic separator",
      "Air-cooled electromagnetic separator",
      "Oil-cooled electromagnetic separator",
      "Self-cooled electromagnetic separator",
      "Explosion-proof electromagnetic separator",
      "Dry-type electromagnetic separator",
      "Electromagnetic belt pulley"
    ]
  },
  {
    label: "Magnetic Rollers, Bars & Components",
    options: [
      "Magnetic roller",
      "Magnetic bar / magnetic rod",
      "Magnetic grid / magnetic grate",
      "Magnetic drawer separator",
      "Magnetic trap / liquid line separator",
      "Rotary pipe magnet",
      "Fine powder magnetic separator"
    ]
  },
  {
    label: "Broader Magnetic Separation Equipment",
    options: [
      "Wet drum magnetic separator",
      "Dry drum magnetic separator",
      "Dry magnetic separator",
      "High-intensity magnetic separator",
      "Drum separator",
      "Eddy current separator",
      "Stainless steel separator",
      "Conveyor metal detector"
    ]
  },
  {
    label: "Project Support",
    options: [
      "Not sure, need product recommendation",
      "Custom magnetic separation solution",
      "OEM / ODM magnetic separator",
      "Spare parts or magnetic components"
    ]
  }
];

const buyerTypes = ["Distributor", "Project Buyer", "End User", "EPC Contractor", "Equipment Integrator", "Consultant", "Other"];
const applicationIndustries = ["Mining", "Recycling", "Cement", "Coal", "Power Plant", "Aggregate", "Waste Sorting", "Food & Grain", "Plastic Recycling", "Bulk Material Handling", "Other"];
const beltWidths = ["500 mm", "650 mm", "800 mm", "1000 mm", "1200 mm", "1400 mm+", "Custom", "Not sure yet"];
const installationPositions = ["Suspended Over Conveyor", "Cross Belt", "Inline Belt", "Head Pulley", "Drum Separation", "Not sure yet"];

function validate(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^\+?[0-9\s().-]{7,24}$/;

  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!phonePattern.test(values.phone.trim())) errors.phone = "Please enter a valid international phone number.";
  if (!values.message.trim()) errors.message = "Please describe your project requirements.";
  if (values.website.trim()) errors.website = "Spam submission blocked.";
  if (!values.consent) errors.consent = "Please confirm this is a real business inquiry.";

  return errors;
}

export default function InquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errors = useMemo(() => validate(values), [values]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function markTouched(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextTouched = Object.keys(initialValues).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(nextTouched);
    setStatus({ type: "idle", message: "" });

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please complete the required fields before submitting." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "loading", message: "Sending your inquiry..." });

    try {
      const trackingIdentity = getClientTrackingIdentity();
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          sourcePath: window.location.pathname,
          pageUrl: window.location.href,
          sourceLanguage: document.documentElement.lang || window.location.pathname.split("/").filter(Boolean)[0] || "en",
          utm: window.location.search,
          attribution: window.__cowinAttribution || null,
          visitorId: trackingIdentity.visitorId,
          sessionId: trackingIdentity.sessionId
        })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Submission failed.");
      }

      setValues(initialValues);
      setTouched({});
      if (window.__cowinTrackEvent) {
        window.__cowinTrackEvent("submit_inquiry", {
          page: window.location.pathname,
          attribution: window.__cowinAttribution || null
        });
      }
      setStatus({
        type: "success",
        message: result?.message || "Thank you. Your inquiry has been submitted successfully."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Submission failed. Please email us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function fieldError(name) {
    return touched[name] && errors[name] ? errors[name] : "";
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
      <input
        className="inquiry-honeypot"
        name="website"
        value={values.website}
        onChange={updateField}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={`inquiry-field ${fieldError("name") ? "is-invalid" : ""}`}>
        <label htmlFor="name">Name <span>*</span></label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={updateField}
          onBlur={markTouched}
          placeholder="Your full name"
          required
        />
        <small>{fieldError("name") || "Who should our sales team contact?"}</small>
      </div>

      <div className={`inquiry-field ${fieldError("email") ? "is-invalid" : ""}`}>
        <label htmlFor="email">Email <span>*</span></label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={updateField}
          onBlur={markTouched}
          placeholder="name@company.com"
          required
        />
        <small>{fieldError("email") || "Use a business email if possible."}</small>
      </div>

      <div className={`inquiry-field ${fieldError("phone") ? "is-invalid" : ""}`}>
        <label htmlFor="phone">Phone / WhatsApp <span>*</span></label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={updateField}
          onBlur={markTouched}
          placeholder="+1 555 000 0000"
          required
        />
        <small>{fieldError("phone") || "International format is supported."}</small>
      </div>

      <div className="inquiry-field">
        <label htmlFor="productRequirement">Product Requirement</label>
        <select
          id="productRequirement"
          name="productRequirement"
          value={values.productRequirement}
          onChange={updateField}
        >
          <option value="">Select a product or leave open</option>
          {productRequirementGroups.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <small>Choose the closest product if you already know it.</small>
      </div>

      <div className={`inquiry-field inquiry-field-wide ${fieldError("message") ? "is-invalid" : ""}`}>
        <label htmlFor="message">Message <span>*</span></label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={updateField}
          onBlur={markTouched}
          placeholder="Tell us your material type, belt width, material layer depth, iron size, installation height, quantity or target application."
          rows="5"
          required
        />
        <small>{fieldError("message") || "More working-condition details help us recommend a suitable model faster."}</small>
      </div>

      <details className="inquiry-more-details inquiry-field-wide">
        <summary>More Working Condition Details</summary>
        <div className="inquiry-more-grid">
          <div className="inquiry-field">
            <label htmlFor="company">Company Name</label>
            <input
              id="company"
              name="company"
              value={values.company}
              onChange={updateField}
              placeholder="Your company or project name"
            />
            <small>Optional, useful for distributors and project buyers.</small>
          </div>

          <div className={`inquiry-field ${fieldError("country") ? "is-invalid" : ""}`}>
            <label htmlFor="country">Country / Region</label>
            <input
              id="country"
              name="country"
              value={values.country}
              onChange={updateField}
              onBlur={markTouched}
              placeholder="United States, Germany, Saudi Arabia..."
            />
            <small>{fieldError("country") || "Helps us estimate shipping and export support."}</small>
          </div>

          <div className="inquiry-field">
            <label htmlFor="buyerType">Buyer Type</label>
            <select id="buyerType" name="buyerType" value={values.buyerType} onChange={updateField}>
              <option value="">Select buyer type</option>
              {buyerTypes.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <small>Helps route your inquiry to the right support path.</small>
          </div>

          <div className="inquiry-field">
            <label htmlFor="applicationIndustry">Application Industry</label>
            <select id="applicationIndustry" name="applicationIndustry" value={values.applicationIndustry} onChange={updateField}>
              <option value="">Select industry</option>
              {applicationIndustries.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <small>Mining, recycling, cement, coal, power plant and other applications are supported.</small>
          </div>

          <div className="inquiry-field">
            <label htmlFor="materialType">Material Type</label>
            <input
              id="materialType"
              name="materialType"
              value={values.materialType}
              onChange={updateField}
              placeholder="Ore, coal, aggregate, scrap, powder..."
            />
            <small>Tell us what material is moving through the line.</small>
          </div>

          <div className="inquiry-field">
            <label htmlFor="beltWidth">Belt Width / Capacity</label>
            <select id="beltWidth" name="beltWidth" value={values.beltWidth} onChange={updateField}>
              <option value="">Select belt width</option>
              {beltWidths.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <small>Choose the closest width or select custom.</small>
          </div>

          <div className="inquiry-field">
            <label htmlFor="installationPosition">Installation Position</label>
            <select id="installationPosition" name="installationPosition" value={values.installationPosition} onChange={updateField}>
              <option value="">Select installation type</option>
              {installationPositions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <small>Cross belt, inline, suspended and head pulley layouts are common.</small>
          </div>

          <div className="inquiry-field">
            <label htmlFor="expectedQuantity">Expected Quantity</label>
            <input
              id="expectedQuantity"
              name="expectedQuantity"
              value={values.expectedQuantity}
              onChange={updateField}
              placeholder="1 set, 2 units, monthly demand..."
            />
            <small>Optional, useful for project and distributor pricing.</small>
          </div>
        </div>
      </details>

      <label className={`inquiry-check ${fieldError("consent") ? "is-invalid" : ""}`}>
        <input
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={updateField}
          onBlur={markTouched}
        />
        <span>I confirm this is a real business inquiry.</span>
      </label>
      {fieldError("consent") && <p className="inquiry-inline-error">{fieldError("consent")}</p>}

      <button className="inquiry-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Submit Inquiry"}
      </button>

      {status.message && (
        <p className={`inquiry-status ${status.type}`} role="status" aria-live="polite">
          {status.message}
        </p>
      )}
    </form>
  );
}
