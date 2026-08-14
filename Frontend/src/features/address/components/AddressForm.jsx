import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import FloatingLabelInput from "../../../shared/components/FloatingLabelInput";

/**
 * AddressForm — inline form for creating a new address.
 * Reuses FloatingLabelInput from shared/components.
 *
 * Props:
 *  - onSubmit      : async (formData) => void — called with validated form data
 *  - onCancel      : () => void — called when user dismisses the form
 *  - isSubmitting  : boolean — disables submit during network call
 */

const INITIAL_FORM = {
  fullName: "",
  emailId: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  isDefault: false,
};

const REQUIRED_FIELDS = [
  "fullName",
  "emailId",
  "phoneNumber",
  "addressLine1",
  "city",
  "state",
  "postalCode",
];

const AddressForm = ({ onSubmit, onCancel, isSubmitting, initialData = null }) => {
  const [form, setForm] = useState(() => ({
    fullName: initialData?.fullName || "",
    emailId: initialData?.emailId || "",
    phoneNumber: initialData?.phoneNumber || "",
    addressLine1: initialData?.addressLine1 || "",
    addressLine2: initialData?.addressLine2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postalCode: initialData?.postalCode || "",
    isDefault: initialData?.isDefault || false,
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field]?.trim()) {
        newErrors[field] = "Required";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #DAD9D4",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(16px, 4vw, 24px)",
      }}
    >
      {/* ── Form header ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#B4B2A7",
          }}
        >
          {initialData ? "Edit Address" : "New Address"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#B4B2A7",
            display: "flex",
            alignItems: "center",
            borderRadius: "50%",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#6E6D68")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#B4B2A7")}
        >
          <X size={17} />
        </button>
      </div>

      {/* ── Form fields ─────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Row: Full Name + Email */}
          <div className="addr-grid-2">
            <FloatingLabelInput
              label="Full Name *"
              id="addr-fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
              autoComplete="name"
            />
            <FloatingLabelInput
              label="Email *"
              id="addr-emailId"
              name="emailId"
              type="email"
              value={form.emailId}
              onChange={handleChange}
              error={errors.emailId}
              autoComplete="email"
            />
          </div>

          {/* Phone */}
          <FloatingLabelInput
            label="Phone Number *"
            id="addr-phoneNumber"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            autoComplete="tel"
          />

          {/* Address Line 1 */}
          <FloatingLabelInput
            label="Address Line 1 *"
            id="addr-addressLine1"
            name="addressLine1"
            type="text"
            value={form.addressLine1}
            onChange={handleChange}
            error={errors.addressLine1}
            autoComplete="address-line1"
          />

          {/* Address Line 2 (optional) */}
          <FloatingLabelInput
            label="Address Line 2"
            id="addr-addressLine2"
            name="addressLine2"
            type="text"
            value={form.addressLine2}
            onChange={handleChange}
            autoComplete="address-line2"
          />

          {/* Row: City + State */}
          <div className="addr-grid-2">
            <FloatingLabelInput
              label="City *"
              id="addr-city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
              autoComplete="address-level2"
            />
            <FloatingLabelInput
              label="State *"
              id="addr-state"
              name="state"
              type="text"
              value={form.state}
              onChange={handleChange}
              error={errors.state}
              autoComplete="address-level1"
            />
          </div>

          {/* Postal Code */}
          <FloatingLabelInput
            label="Postal Code *"
            id="addr-postalCode"
            name="postalCode"
            type="text"
            value={form.postalCode}
            onChange={handleChange}
            error={errors.postalCode}
            autoComplete="postal-code"
          />

          {/* ── Default address checkbox ─────────────────── */}
          <label
            htmlFor="addr-isDefault"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              userSelect: "none",
              paddingTop: "2px",
            }}
          >
            {/* Hidden native checkbox */}
            <input
              id="addr-isDefault"
              name="isDefault"
              type="checkbox"
              checked={form.isDefault}
              onChange={handleChange}
              style={{
                position: "absolute",
                opacity: 0,
                width: 0,
                height: 0,
                pointerEvents: "none",
              }}
            />
            {/* Custom checkbox visual */}
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "6px",
                border: `2px solid ${form.isDefault ? "#A95A3A" : "#DAD9D4"}`,
                background: form.isDefault ? "#A95A3A" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
                boxShadow: form.isDefault
                  ? "0 2px 8px rgba(169,90,58,0.28)"
                  : "none",
              }}
              onClick={() =>
                setForm((prev) => ({ ...prev, isDefault: !prev.isDefault }))
              }
            >
              {form.isDefault && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6 5 8.5 9.5 3.5"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13.5px",
                color: form.isDefault ? "#3D3929" : "#6E6D68",
                fontWeight: 400,
                transition: "color 0.15s ease",
              }}
            >
              Set as default address
            </span>
          </label>

          {/* ── Submit button ───────────────────────────── */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.01, y: -1 } : {}}
            whileTap={!isSubmitting ? { scale: 0.985 } : {}}
            style={{
              height: "48px",
              background: isSubmitting ? "#B4B2A7" : "#A95A3A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "12.5px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "6px",
              transition: "background 0.22s ease, box-shadow 0.22s ease",
              boxShadow: isSubmitting ? "none" : "var(--shadow-button)",
            }}
          >
            {isSubmitting ? "Saving…" : initialData ? "Update Address" : "Save Address"}
          </motion.button>
        </div>
      </form>

      {/* Responsive 2-column grid for form rows */}
      <style>{`
        .addr-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 560px) {
          .addr-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AddressForm;
