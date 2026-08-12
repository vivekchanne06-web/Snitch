import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, AlertTriangle } from "lucide-react";

/**
 * Snitch Toast Component — Premium Minimalist Fashion-Commerce Notification
 *
 * Props for standalone usage:
 * - show (boolean)
 * - onClose (function)
 * - title (string)
 * - message (string)
 * - icon (React node)
 * - duration (number, default 3500ms)
 * - type ('success' | 'info' | 'warning' | 'error')
 */
export const SnitchToast = ({
  show,
  onClose,
  title = "Payment Successful",
  message = "Your order has been placed successfully.",
  icon,
  duration = 3500,
  type = "success",
}) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, onClose, duration]);

  const renderIcon = () => {
    if (icon) return icon;
    if (type === "success") {
      return <Check size={15} strokeWidth={2.5} color="#A95A3A" />;
    }
    if (type === "warning" || type === "error") {
      return <AlertTriangle size={15} strokeWidth={2} color="#A95A3A" />;
    }
    return <Info size={15} strokeWidth={2} color="#A95A3A" />;
  };

  return (
    <>
      <style>{`
        .snitch-toast-box {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 340px;
          max-width: calc(100vw - 48px);
          z-index: 9999;
          background: #FAF9F5;
          border: 1px solid #DAD9D4;
          border-radius: 12px;
          box-shadow: 0 10px 30px -4px rgba(61, 57, 41, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-family: var(--font-sans, "Outfit", sans-serif);
          pointer-events: auto;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .snitch-toast-box {
            bottom: 16px !important;
            right: 16px !important;
            left: 16px !important;
            width: calc(100% - 32px) !important;
            max-width: 100% !important;
          }
        }
      `}</style>
      <AnimatePresence>
        {show && (
          <motion.div
            key="snitch-toast-notification"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-live="polite"
            className="snitch-toast-box"
          >
            {/* Success / Accent Icon Container */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(169, 90, 58, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              {renderIcon()}
            </div>

            {/* Content Text Area */}
            <div style={{ flex: 1, minWidth: 0, paddingRight: "4px" }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#3D3929",
                  lineHeight: "1.3",
                  letterSpacing: "0.01em",
                }}
              >
                {title}
              </h4>
              {message && (
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: "12.5px",
                    fontWeight: 400,
                    color: "#6E6D68",
                    lineHeight: "1.4",
                  }}
                >
                  {message}
                </p>
              )}
            </div>

            {/* Dismiss X Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notification"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                margin: "-2px -4px 0 0",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B4B2A7",
                transition: "color 0.15s ease, background-color 0.15s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#6E6D68";
                e.currentTarget.style.backgroundColor = "rgba(61, 57, 41, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#B4B2A7";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Global Toast Context & Provider
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toastState, setToastState] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
    duration: 3500,
    icon: null,
  });

  const showToast = useCallback(
    ({
      title = "Payment Successful",
      message = "Your order has been placed successfully.",
      type = "success",
      duration = 3500,
      icon = null,
    }) => {
      // Overwrite existing toast to reset timer & avoid uncontrolled stacking
      setToastState({
        show: true,
        title,
        message,
        type,
        duration,
        icon,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <SnitchToast
        show={toastState.show}
        onClose={hideToast}
        title={toastState.title}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        icon={toastState.icon}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
      hideToast: () => {},
    };
  }
  return context;
};

export default SnitchToast;
