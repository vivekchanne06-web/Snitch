import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, CreditCard, LockKeyhole, Loader2 } from "lucide-react";

/**
 * PaymentMethodModal — Snitch Marketplace
 *
 * Matches the existing Cart page visual language:
 * warm off-white, terracotta primary, Outfit font, restrained framer-motion.
 *
 * Props:
 *   isOpen         (boolean)
 *   onClose        (function)
 *   onSelectCOD    (function)
 *   onSelectRazorpay (function)
 *   isLoading      (boolean)
 */
const PaymentMethodModal = ({
  isOpen,
  onClose,
  onSelectCOD,
  onSelectRazorpay,
  isLoading = false,
}) => {
  /* Prevent body scroll while modal is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, isLoading, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────── */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => !isLoading && onClose()}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(61, 57, 41, 0.45)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              zIndex: 1000,
            }}
          />

          {/* ── Modal Card ───────────────────────────────────────── */}
          <motion.div
            key="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Select payment method"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              width: "min(440px, calc(100vw - 24px))",
              maxHeight: "calc(100dvh - 32px)",
              overflowY: "auto",
              background: "var(--color-background, #FAF9F5)",
              border: "1px solid var(--color-border, #DAD9D4)",
              borderRadius: "var(--radius-xl, 18px)",
              boxShadow:
                "0 24px 60px -8px rgba(61, 57, 41, 0.22), 0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            {/* ── Header ───────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "clamp(14px, 4vw, 20px) clamp(16px, 4vw, 24px) 14px",
                borderBottom: "1px solid var(--color-border, #DAD9D4)",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-input, #B4B2A7)",
                  }}
                >
                  Checkout
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif)",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--color-foreground, #3D3929)",
                    letterSpacing: "0.01em",
                  }}
                >
                  Select Payment Method
                </h2>
              </div>

              <button
                onClick={() => !isLoading && onClose()}
                disabled={isLoading}
                aria-label="Close payment modal"
                style={{
                  background: "none",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  color: "var(--color-input, #B4B2A7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  borderRadius: "50%",
                  opacity: isLoading ? 0.4 : 1,
                  transition: "color 0.18s ease, background 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading)
                    e.currentTarget.style.background =
                      "rgba(61, 57, 41, 0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Payment Options ───────────────────────────────── */}
            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* ── COD Button ──────────────────────────────────── */}
              <PaymentOption
                icon={<Truck size={22} color="var(--color-foreground, #3D3929)" />}
                title="Cash on Delivery"
                subtitle="Pay when your order arrives"
                onClick={onSelectCOD}
                disabled={isLoading}
                isLoading={isLoading}
                id="cod-option"
              />

              {/* ── Razorpay Button ─────────────────────────────── */}
              <PaymentOption
                icon={<CreditCard size={22} color="#A95A3A" />}
                title="Pay Online"
                subtitle="Cards, UPI, Net Banking & more"
                onClick={onSelectRazorpay}
                disabled={isLoading}
                isLoading={isLoading}
                primary
                id="razorpay-option"
              />
            </div>

            {/* ── Footer ────────────────────────────────────────── */}
            <div
              style={{
                padding: "0 24px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <LockKeyhole size={12} color="var(--color-input, #B4B2A7)" />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "var(--color-input, #B4B2A7)",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                100% Secure &amp; Encrypted Payment
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Payment Option Sub-component ─────────────────────────────────── */
const PaymentOption = ({
  icon,
  title,
  subtitle,
  onClick,
  disabled,
  isLoading,
  primary = false,
  id,
}) => (
  <motion.button
    id={id}
    whileHover={!disabled ? { scale: 1.01, y: -1 } : {}}
    whileTap={!disabled ? { scale: 0.985 } : {}}
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "clamp(10px, 3vw, 16px)",
      padding: "clamp(12px, 3.5vw, 16px) clamp(12px, 3.5vw, 18px)",
      background: primary ? "var(--color-primary, #A95A3A)" : "var(--color-surface, #FFFFFF)",
      border: primary
        ? "1.5px solid var(--color-primary, #A95A3A)"
        : "1.5px solid var(--color-border, #DAD9D4)",
      borderRadius: "var(--radius-md, 10px)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.65 : 1,
      textAlign: "left",
      transition: "background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
      boxShadow: primary ? "var(--shadow-button, 0 4px 20px rgba(169,90,58,0.25))" : "none",
    }}
    onMouseEnter={(e) => {
      if (!disabled && !primary)
        e.currentTarget.style.borderColor = "var(--color-primary, #A95A3A)";
    }}
    onMouseLeave={(e) => {
      if (!disabled && !primary)
        e.currentTarget.style.borderColor = "var(--color-border, #DAD9D4)";
    }}
  >
    {/* Icon */}
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "var(--radius-md, 10px)",
        background: primary
          ? "rgba(255,255,255,0.15)"
          : "var(--color-background, #FAF9F5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {isLoading ? (
        <Loader2
          size={20}
          color={primary ? "#FFFFFF" : "var(--color-input, #B4B2A7)"}
          style={{ animation: "spin 1s linear infinite" }}
        />
      ) : (
        <span
          style={{
            color: primary ? "#FFFFFF" : undefined,
            display: "flex",
          }}
        >
          {primary ? (
            <CreditCard size={22} color="#FFFFFF" />
          ) : (
            icon
          )}
        </span>
      )}
    </div>

    {/* Text */}
    <div style={{ flex: 1 }}>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: "14.5px",
          fontWeight: 700,
          color: primary ? "#FFFFFF" : "var(--color-foreground, #3D3929)",
          letterSpacing: "0.01em",
          lineHeight: 1.3,
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "2px 0 0",
          fontFamily: "var(--font-sans)",
          fontSize: "12px",
          fontWeight: 400,
          color: primary ? "rgba(255,255,255,0.75)" : "var(--color-muted, #6E6D68)",
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>
    </div>
  </motion.button>
);

/* Spinner keyframe injected once */
const MODAL_CSS = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;

const PaymentMethodModalWithStyle = (props) => (
  <>
    <style>{MODAL_CSS}</style>
    <PaymentMethodModal {...props} />
  </>
);

export default PaymentMethodModalWithStyle;
