import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   NOT FOUND — 404 page, Snitch design system
   ══════════════════════════════════════════════════════════════════════ */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative", marginBottom: "36px" }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "rgba(169,90,58,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "50%",
              background: "rgba(169,90,58,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBag size={36} color="var(--color-primary)" />
          </div>
        </div>

        {/* 404 badge */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: "var(--color-primary)",
            color: "#FFFFFF",
            borderRadius: "99px",
            padding: "4px 10px",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            boxShadow: "var(--shadow-button)",
          }}
        >
          404
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          fontWeight: 600,
          color: "var(--color-foreground)",
          margin: "0 0 14px",
          letterSpacing: "0.01em",
          lineHeight: 1.18,
        }}
      >
        Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        style={{
          fontSize: "14px",
          color: "var(--color-muted)",
          maxWidth: "360px",
          lineHeight: 1.7,
          margin: "0 0 36px",
          fontWeight: 400,
        }}
      >
        The page you're looking for doesn't exist or may have been moved.
        Head back to the collection to keep browsing.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.26 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/home")}
        style={{
          height: "50px",
          padding: "0 36px",
          background: "var(--color-primary)",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "var(--shadow-button)",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-dark)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-primary)")}
      >
        Explore Collection
        <ArrowRight size={15} />
      </motion.button>
    </div>
  );
};

export default NotFound;
