"use client";

import { useMemo, useState } from "react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  productRequirement: "",
  message: "",
  website: "",
  consent: false
};

function validate(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^\+?[0-9\s().-]{7,24}$/;

  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!phonePattern.test(values.phone.trim())) errors.phone = "Please enter a valid international phone number.";
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
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Submission failed.");
      }

      setValues(initialValues);
      setTouched({});
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

      <div className="inquiry-field">
        <label htmlFor="country">Country / Region</label>
        <input
          id="country"
          name="country"
          value={values.country}
          onChange={updateField}
          placeholder="United States, Germany, Saudi Arabia..."
        />
        <small>Helps us estimate shipping and export support.</small>
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
          <option>Permanent overband magnetic separator</option>
          <option>Suspended permanent magnetic separator</option>
          <option>Electromagnetic separator</option>
          <option>Magnetic drum / pulley / roller</option>
          <option>Magnetic bars / grids / components</option>
          <option>Not sure, need product recommendation</option>
        </select>
        <small>Choose the closest product if you already know it.</small>
      </div>

      <div className="inquiry-field inquiry-field-wide">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={updateField}
          placeholder="Tell us your material type, belt width, material layer depth, iron size, installation height, quantity or target application."
          rows="5"
        />
        <small>More working-condition details help us recommend a suitable model faster.</small>
      </div>

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
