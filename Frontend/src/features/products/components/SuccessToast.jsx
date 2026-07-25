import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

/**
 * SuccessToast — Premium animated toast notification.
 * Auto-dismisses after `duration` ms (default 4000ms).
 */
const SuccessToast = ({ message = "Success!", show, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, onClose, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 pl-4 pr-5 py-3.5 rounded-2xl bg-white border border-[#DAD9D4] shadow-[0_8px_32px_rgba(61,57,41,0.16)] max-w-sm"
        >
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-[#A95A3A]/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#A95A3A]" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#3D3929] leading-tight">
              {message}
            </p>
            <p className="text-xs text-[#6E6D68] mt-0.5">
              Your listing is now live on the marketplace.
            </p>
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[#B4B2A7] hover:text-[#6E6D68] hover:bg-[#F5F4EF] transition-colors duration-150"
          >
            <X size={14} />
          </button>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 rounded-full bg-[#A95A3A]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessToast;
