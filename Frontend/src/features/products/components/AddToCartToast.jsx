import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════════════════
   AddToCartToast — Premium add-to-cart confirmation popup
   Snitch design system: var(--color-*), var(--font-*), var(--radius-*)

   Props:
     show        boolean  — controls visibility
     onClose     fn       — called when user dismisses or timer expires
     snapshot    object   — frozen snapshot of the added item:
                            { productTitle, price, variantImage, attributes }
     duration    number   — auto-dismiss ms (default 5000)
   ══════════════════════════════════════════════════════════════════════ */

const TOAST_CSS = `
  .atc-toast-root {
    position: fixed;
    top: 88px;
    right: clamp(16px, 3vw, 32px);
    z-index: 200;
    max-width: 360px;
    width: calc(100vw - 32px);
  }

  @media (max-width: 480px) {
    .atc-toast-root {
      top: auto;
      bottom: 24px;
      right: 16px;
      left: 16px;
      max-width: none;
      width: auto;
    }
  }
`;

/* ── Currency helper ───────────────────────────────────────────────── */
const formatPrice = (amount, currency = "INR") => {
  const sym =
    currency === "INR" ? "₹" : currency === "USD" ? "$" : currency + " ";
  return sym + Number(amount).toLocaleString("en-IN");
};

const AddToCartToast = ({ show, onClose, snapshot, duration = 5000 }) => {
  const navigate = useNavigate();

  /* Auto-dismiss */
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, onClose, duration]);

  const handleViewBag = () => {
    onClose();
    navigate("/cart");
  };

  if (!snapshot) return null;

  const { productTitle, price, variantImage, attributes } = snapshot;
  const attrEntries = attributes ? Object.entries(attributes) : [];
  const attrLine = attrEntries
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");

  return (
    <>
      <style>{TOAST_CSS}</style>

      <AnimatePresence>
        {show && (
          <div className="atc-toast-root">
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="status"
              aria-live="polite"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "0 8px 40px rgba(61,57,41,0.16)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* ── Main content row ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "16px",
                }}
              >
                {/* Product image */}
                <div
                  style={{
                    width: "80px",
                    flexShrink: 0,
                    aspectRatio: "3/4",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #F5F4EF 0%, #E9E6DC 100%)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {variantImage ? (
                    <img
                      src={variantImage}
                      alt={productTitle}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ShoppingBag size={22} color="var(--color-input)" />
                    </div>
                  )}
                </div>

                {/* Text area */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {/* Success badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <CheckCircle2
                      size={14}
                      color="var(--color-primary)"
                      strokeWidth={2.5}
                    />
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Added to your bag
                    </span>
                  </div>

                  {/* Product title */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--color-foreground)",
                      fontFamily: "var(--font-sans)",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {productTitle}
                  </p>

                  {/* Variant attributes */}
                  {attrLine && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11.5px",
                        color: "var(--color-muted)",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {attrLine}
                    </p>
                  )}

                  {/* Price */}
                  {price && (
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-sans)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {formatPrice(price.amount, price.currency)}
                    </p>
                  )}
                </div>

                {/* Dismiss button */}
                <button
                  onClick={onClose}
                  aria-label="Dismiss"
                  style={{
                    flexShrink: 0,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-muted)",
                    transition: "background 0.15s ease, color 0.15s ease",
                    marginTop: "-2px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-secondary)";
                    e.currentTarget.style.color = "var(--color-foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--color-card)";
                    e.currentTarget.style.color = "var(--color-muted)";
                  }}
                >
                  <X size={13} />
                </button>
              </div>

              {/* ── CTA row ── */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  padding: "0 16px 16px",
                }}
              >
                {/* VIEW BAG */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleViewBag}
                  style={{
                    flex: 1,
                    height: "40px",
                    background: "var(--color-primary)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "background 0.2s ease",
                    boxShadow: "var(--shadow-button)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-primary-dark)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--color-primary)")
                  }
                >
                  View Bag
                  <ArrowRight size={13} />
                </motion.button>

                {/* CONTINUE SHOPPING */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  style={{
                    flex: 1,
                    height: "40px",
                    background: "transparent",
                    color: "var(--color-foreground)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transition: "border-color 0.18s ease, color 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-foreground)";
                  }}
                >
                  Continue
                </motion.button>
              </div>

              {/* ── Auto-dismiss progress bar ── */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "2px",
                  width: "100%",
                  background: "var(--color-primary)",
                  transformOrigin: "left",
                  opacity: 0.5,
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddToCartToast;
