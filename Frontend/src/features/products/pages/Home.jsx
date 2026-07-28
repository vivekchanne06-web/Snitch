import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  Eye,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { useProduct } from "../hook/useProduct";

/* ── Inline social icons (lucide-react v1.x removed all brand icons) ─── */
const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const TwitterIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   SNITCH — Premium Fashion Homepage
   Design system: Zara · COS · H&M · Apple · Nike
   Colors: #FAF9F5 bg · #A95A3A primary · #3D3929 text · #6E6D68 muted
   Fonts: Outfit (sans) · Playfair Display (serif)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Hero editorial images ──────────────────────────────────────────────── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=90&fm=webp&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=90&fm=webp&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=90&fm=webp&fit=crop&crop=top",
  "https://images.unsplash.com/photo-1558171813-1e6b9a69a4be?w=1800&q=90&fm=webp&fit=crop&crop=top",
];

/* ── Featured categories ────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    label: "Shirts",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80&fit=crop",
  },
  {
    label: "Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&fit=crop",
  },
  {
    label: "Oversized",
    image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=600&q=80&fit=crop",
  },
  {
    label: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&fit=crop",
  },
  {
    label: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&fit=crop",
  },
  {
    label: "Jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&fit=crop",
  },
];

/* ── Sort/filter options ────────────────────────────────────────────────── */
const FILTERS = [
  { label: "All", value: "all" },
  { label: "Newest", value: "newest" },
  { label: "Price Low → High", value: "price_asc" },
  { label: "Price High → Low", value: "price_desc" },
];

/* ── Currency helper ────────────────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return "";
  const sym =
    price.currency === "INR" ? "₹" : price.currency === "USD" ? "$" : (price.currency || "") + " ";
  return sym + Number(price.amount).toLocaleString("en-IN");
};

/* ── Shimmer keyframes (injected once) ─────────────────────────────────── */
const SHIMMER_STYLE = `
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  @keyframes snitchFadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;

/* ════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Navbar ─────────────────────────────────────────────────────────────── */
const Navbar = ({ scrolled }) => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 clamp(20px, 5vw, 64px)",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.35s ease, box-shadow 0.35s ease",
        background: scrolled
          ? "rgba(250,249,245,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(61,57,41,0.08)" : "none",
      }}
    >
      {/* Wordmark */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: scrolled ? "#3D3929" : "#FFFFFF",
          background: "none",
          border: "none",
          cursor: "pointer",
          lineHeight: 1,
          transition: "color 0.35s ease",
        }}
      >
        Snitch<span style={{ color: "#A95A3A" }}>.</span>
      </button>

      {/* Nav links — desktop */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
        className="hidden sm:flex"
      >
        {["New Arrivals", "Collections", "Brands", "Sale"].map((item) => (
          <button
            key={item}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: scrolled ? "#3D3929" : "rgba(255,255,255,0.88)",
              transition: "color 0.2s ease",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.target.style.color = "#A95A3A")}
            onMouseLeave={(e) =>
              (e.target.style.color = scrolled ? "#3D3929" : "rgba(255,255,255,0.88)")
            }
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: scrolled ? "#3D3929" : "#FFFFFF",
            transition: "color 0.35s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ShoppingBag size={20} />
        </motion.button>

        {user ? (
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              user.role === "seller" ? navigate("/seller/products") : null
            }
            style={{
              height: "36px",
              padding: "0 18px",
              background: "#A95A3A",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 4px 16px rgba(169,90,58,0.28)",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#8B4A2F")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#A95A3A")}
          >
            {user.role === "seller" ? "Dashboard" : "Account"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            style={{
              height: "36px",
              padding: "0 18px",
              background: "transparent",
              color: scrolled ? "#3D3929" : "#FFFFFF",
              border: `1.5px solid ${scrolled ? "#DAD9D4" : "rgba(255,255,255,0.5)"}`,
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
          >
            Sign In
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

/* ── Hero Section ───────────────────────────────────────────────────────── */
const HeroSection = () => {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIdx((p) => (p + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        background: "#1E1912",
      }}
    >
      {/* Crossfade hero images */}
      <AnimatePresence>
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <motion.img
            src={HERO_IMAGES[activeIdx]}
            alt="Fashion editorial"
            loading="eager"
            decoding="async"
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.07 }}
            transition={{ duration: 8, ease: "linear" }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              display: "block",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Multi-layer gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(20,17,12,0.82) 0%, rgba(20,17,12,0.45) 55%, rgba(20,17,12,0.15) 100%), linear-gradient(to top, rgba(20,17,12,0.6) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 clamp(24px, 8vw, 120px)",
          maxWidth: "760px",
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#A95A3A",
            marginBottom: "20px",
          }}
        >
          New Season · 2025 Collection
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            margin: "0 0 20px",
          }}
        >
          Elevate Your
          <br />
          <em style={{ fontStyle: "italic", color: "#E9DDD5" }}>Everyday Style.</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(14px, 1.8vw, 17px)",
            color: "rgba(255,255,255,0.68)",
            marginBottom: "40px",
            lineHeight: 1.6,
            maxWidth: "420px",
          }}
        >
          Discover curated fashion for modern lifestyles. Premium pieces, thoughtfully selected.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              document
                .getElementById("collection")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              height: "50px",
              padding: "0 36px",
              background: "#A95A3A",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: "0 6px 24px rgba(169,90,58,0.4)",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8B4A2F";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(169,90,58,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#A95A3A";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(169,90,58,0.4)";
            }}
          >
            Shop Collection
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              document
                .getElementById("collection")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              height: "50px",
              padding: "0 36px",
              background: "transparent",
              color: "#FFFFFF",
              border: "1.5px solid rgba(255,255,255,0.45)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Explore New Arrivals
          </motion.button>
        </motion.div>
      </div>

      {/* Slide dots */}
      <div
        style={{
          position: "absolute",
          bottom: "36px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
        }}
      >
        {HERO_IMAGES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveIdx(i)}
            animate={{
              width: i === activeIdx ? "28px" : "6px",
              opacity: i === activeIdx ? 1 : 0.4,
              background: i === activeIdx ? "#A95A3A" : "#FFFFFF",
            }}
            transition={{ duration: 0.35 }}
            style={{
              height: "4px",
              borderRadius: "99px",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "36px",
          right: "clamp(24px, 5vw, 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ── Category card ──────────────────────────────────────────────────────── */
const CategoryCard = ({ label, image, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: "clamp(140px, 16vw, 200px)",
        cursor: "pointer",
        borderRadius: "14px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "2/3",
          overflow: "hidden",
          background: "#E9E6DC",
          borderRadius: "14px",
        }}
      >
        <motion.img
          src={image}
          alt={label}
          loading="lazy"
          decoding="async"
          animate={{ scale: hovered ? 1.08 : 1.0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(20,17,12,0.72) 0%, rgba(20,17,12,0.18) 55%, transparent 100%)",
          }}
        />
        {/* Label */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            {label}
          </span>
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(169,90,58,0.16)",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ── Categories Section ─────────────────────────────────────────────────── */
const CategoriesSection = () => (
  <section style={{ padding: "80px 0", background: "#FAF9F5" }}>
    <div style={{ padding: "0 clamp(20px, 5vw, 64px)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: "44px" }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#A95A3A",
            marginBottom: "10px",
          }}
        >
          Browse
        </p>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            fontWeight: 600,
            color: "#3D3929",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Featured Categories
        </h2>
      </motion.div>

      {/* Scrollable row */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "12px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.label} {...cat} index={i} />
        ))}
      </div>
    </div>
  </section>
);

/* ── Product image slideshow (reused from Dashboard, adapted for buyer) ── */
const ProductImageSlideshow = ({ images, title, hovered }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);
  const isMultiple = images && images.length > 1;

  const advance = useCallback(() => {
    setActiveIdx((p) => (p + 1) % images.length);
  }, [images]);

  useEffect(() => {
    if (!isMultiple) return;
    if (hovered) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(advance, 3500);
    return () => clearInterval(intervalRef.current);
  }, [hovered, isMultiple, advance]);

  useEffect(() => {
    setActiveIdx(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #F5F4EF 0%, #E9E6DC 50%, #DAD9D4 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "rgba(218,217,212,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingBag size={22} color="#B4B2A7" />
        </div>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#B4B2A7",
          }}
        >
          No Image
        </span>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <motion.img
            src={images[activeIdx]}
            alt={`${title} — image ${activeIdx + 1}`}
            loading="lazy"
            decoding="async"
            initial={{ scale: 1.0 }}
            animate={{ scale: hovered ? 1.07 : 1.04 }}
            transition={{
              duration: hovered ? 0.55 : 6,
              ease: hovered ? [0.22, 1, 0.36, 1] : "linear",
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              willChange: "transform",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      {isMultiple && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {images.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === activeIdx ? 16 : 5,
                opacity: i === activeIdx ? 1 : 0.45,
                backgroundColor: i === activeIdx ? "#ffffff" : "rgba(255,255,255,0.7)",
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "block", height: "4px", borderRadius: "99px" }}
            />
          ))}
        </div>
      )}
    </>
  );
};

/* ── Product card ───────────────────────────────────────────────────────── */
const ProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const images = (product.images || []).map((img) => img.url || img);
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index % 4, 3) * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: "#FFFFFF",
        border: "1px solid rgba(218,217,212,0.65)",
        boxShadow: hovered
          ? "0 12px 40px rgba(61,57,41,0.14)"
          : "0 2px 16px rgba(61,57,41,0.06)",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
      }}
    >
      {/* Image container — 4:5 */}
      <div
      onClick={()=>navigate(`/product/${product._id}`)}
        style={{
          position: "relative",
          paddingBottom: "125%",
          overflow: "hidden",
          background: "#E9E6DC",
        }}
      >
        <ProductImageSlideshow images={images} title={product.title} hovered={hovered} />

        {/* Hover overlay with actions */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="hover-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                background:
                  "linear-gradient(to top, rgba(20,17,12,0.82) 0%, rgba(20,17,12,0.35) 50%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0 16px 18px",
                gap: "10px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}
              >
                {/* View Details */}
                <motion.button
                onClick={()=>navigate(`/product/${product._id}`)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    height: "36px",
                    background: "#FFFFFF",
                    color: "#3D3929",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <Eye size={12} />
                  View
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setWishlisted((p) => !p);
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    flexShrink: 0,
                    background: wishlisted ? "#A95A3A" : "rgba(255,255,255,0.15)",
                    border: wishlisted ? "none" : "1.5px solid rgba(255,255,255,0.35)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <Heart
                    size={14}
                    color="#FFFFFF"
                    fill={wishlisted ? "#FFFFFF" : "none"}
                  />
                </motion.button>

                {/* Add to Cart */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    height: "36px",
                    background: "#A95A3A",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(169,90,58,0.35)",
                  }}
                >
                  <ShoppingBag size={12} />
                  Add
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div
      
       style={{ padding: "14px 16px 16px" }}>
        <h3
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: "13.5px",
            fontWeight: 600,
            color: "#3D3929",
            margin: "0 0 5px",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.title}
        </h3>

        {product.description && (
          <p
            style={{
              fontSize: "11.5px",
              color: "#6E6D68",
              lineHeight: 1.55,
              margin: "0 0 10px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>
        )}

        <span
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#A95A3A",
            letterSpacing: "0.01em",
          }}
        >
          {formatPrice(product.price)}
        </span>
      </div>
    </motion.article>
  );
};

/* ── Skeleton card ──────────────────────────────────────────────────────── */
const SkeletonCard = ({ index }) => (
  <div
    style={{
      borderRadius: "16px",
      overflow: "hidden",
      background: "#FFFFFF",
      border: "1px solid rgba(218,217,212,0.65)",
      boxShadow: "0 2px 16px rgba(61,57,41,0.06)",
      animation: `snitchFadeUp 0.45s ${index * 0.04}s both`,
    }}
  >
    <div style={{ position: "relative", paddingBottom: "125%", background: "#E9E6DC" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
          animation: "shimmer 1.6s infinite",
        }}
      />
    </div>
    <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      {[["70%", "14px"], ["50%", "11px"], ["35%", "16px"]].map(([w, h], i) => (
        <div
          key={i}
          style={{
            width: w,
            height: h,
            borderRadius: "8px",
            background: "#E9E6DC",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
              animation: `shimmer 1.6s ${0.1 * (i + 1)}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

/* ── Empty state ────────────────────────────────────────────────────────── */
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 24px",
      textAlign: "center",
    }}
  >
    <div style={{ position: "relative", marginBottom: "32px" }}>
      <div
        style={{
          width: "108px",
          height: "108px",
          borderRadius: "50%",
          background: "rgba(169,90,58,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "76px",
            height: "76px",
            borderRadius: "50%",
            background: "rgba(169,90,58,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingBag size={34} color="#A95A3A" />
        </div>
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "-4px",
          right: "-4px",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "#E9E6DC",
          border: "1px solid #DAD9D4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sparkles size={12} color="#A95A3A" />
      </motion.div>
    </div>

    <h2
      style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        fontWeight: 600,
        color: "#3D3929",
        margin: "0 0 12px",
      }}
    >
      No Products Available
    </h2>
    <p
      style={{
        fontSize: "14px",
        color: "#6E6D68",
        maxWidth: "320px",
        lineHeight: 1.65,
        margin: 0,
      }}
    >
      New arrivals are coming soon. Check back to discover our latest curated pieces.
    </p>
  </motion.div>
);

/* ── Collection Section ─────────────────────────────────────────────────── */
const CollectionSection = ({ products, loading }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const displayProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    switch (filter) {
      case "newest":
        list = [...list].reverse();
        break;
      case "price_asc":
        list.sort((a, b) => (Number(a.price?.amount) || 0) - (Number(b.price?.amount) || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (Number(b.price?.amount) || 0) - (Number(a.price?.amount) || 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, search, filter]);

  return (
    <section id="collection" style={{ padding: "80px 0 100px", background: "#FAF9F5" }}>
      <div style={{ padding: "0 clamp(20px, 5vw, 64px)" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "44px" }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#A95A3A",
              marginBottom: "10px",
            }}
          >
            Latest
          </p>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 600,
              color: "#3D3929",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            The Collection
          </h2>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: "380px" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#B4B2A7",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search premium fashion..."
              style={{
                width: "100%",
                height: "44px",
                paddingLeft: "40px",
                paddingRight: search ? "36px" : "14px",
                borderRadius: "22px",
                border: "1.5px solid #DAD9D4",
                background: "#FFFFFF",
                fontSize: "13px",
                color: "#3D3929",
                outline: "none",
                fontFamily: '"Outfit", sans-serif',
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#A95A3A";
                e.target.style.boxShadow = "0 0 0 3px rgba(169,90,58,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#DAD9D4";
                e.target.style.boxShadow = "none";
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#B4B2A7",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  height: "38px",
                  padding: "0 18px",
                  borderRadius: "99px",
                  border: filter === f.value ? "1.5px solid #A95A3A" : "1.5px solid #DAD9D4",
                  background: filter === f.value ? "#A95A3A" : "#FFFFFF",
                  color: filter === f.value ? "#FFFFFF" : "#6E6D68",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "all 0.2s ease",
                  boxShadow:
                    filter === f.value ? "0 2px 10px rgba(169,90,58,0.25)" : "none",
                  fontFamily: '"Outfit", sans-serif',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid / States */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </motion.div>
          )}

          {!loading && products.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState />
            </motion.div>
          )}

          {!loading && products.length > 0 && displayProducts.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 24px",
                textAlign: "center",
              }}
            >
              <Search size={40} color="#DAD9D4" style={{ marginBottom: "20px" }} />
              <h3
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "#3D3929",
                  margin: "0 0 10px",
                }}
              >
                No Results Found
              </h3>
              <p style={{ fontSize: "13px", color: "#6E6D68", margin: "0 0 24px" }}>
                Try a different keyword or clear the filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                style={{
                  height: "38px",
                  padding: "0 24px",
                  borderRadius: "99px",
                  border: "1.5px solid #DAD9D4",
                  background: "#FFFFFF",
                  color: "#6E6D68",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: '"Outfit", sans-serif',
                  transition: "all 0.2s",
                }}
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {!loading && displayProducts.length > 0 && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {displayProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Count */}
        {!loading && displayProducts.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: "52px",
              textAlign: "center",
              fontSize: "11px",
              color: "#B4B2A7",
              letterSpacing: "0.04em",
            }}
          >
            Showing {displayProducts.length} of {products.length}{" "}
            {products.length === 1 ? "piece" : "pieces"}
          </motion.p>
        )}
      </div>
    </section>
  );
};

/* ── Footer ─────────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer
    style={{
      background: "#F5F4EF",
      borderTop: "1px solid #DAD9D4",
      padding: "60px clamp(20px, 5vw, 64px) 32px",
    }}
  >
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "40px",
        marginBottom: "48px",
      }}
    >
      {/* Brand column */}
      <div style={{ flex: "0 0 auto", maxWidth: "280px" }}>
        <div
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#3D3929",
            marginBottom: "12px",
          }}
        >
          Snitch<span style={{ color: "#A95A3A" }}>.</span>
        </div>
        <p
          style={{
            fontSize: "12.5px",
            color: "#6E6D68",
            lineHeight: 1.7,
            margin: "0 0 20px",
            maxWidth: "240px",
          }}
        >
          Premium curated fashion for the modern wardrobe. Style without compromise.
        </p>

        {/* Social icons */}
        <div style={{ display: "flex", gap: "14px" }}>
          {[[InstagramIcon, "instagram"], [TwitterIcon, "twitter"], [FacebookIcon, "facebook"]].map(([Icon, key]) => (
            <motion.a
              key={key}
              href="#"
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "1px solid #DAD9D4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6E6D68",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#A95A3A";
                e.currentTarget.style.color = "#A95A3A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DAD9D4";
                e.currentTarget.style.color = "#6E6D68";
              }}
            >
              <Icon size={15} />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Links columns */}
      {[
        {
          title: "Company",
          links: ["About", "Careers", "Press", "Contact"],
        },
        {
          title: "Legal",
          links: ["Privacy", "Terms", "Cookie Policy", "Returns"],
        },
      ].map((col) => (
        <div key={col.title}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#B4B2A7",
              marginBottom: "16px",
            }}
          >
            {col.title}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {col.links.map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: "13px",
                  color: "#6E6D68",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  fontFamily: '"Outfit", sans-serif',
                }}
                onMouseEnter={(e) => (e.target.style.color = "#A95A3A")}
                onMouseLeave={(e) => (e.target.style.color = "#6E6D68")}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Newsletter */}
      <div style={{ flex: "0 0 auto", maxWidth: "260px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#B4B2A7",
            marginBottom: "16px",
          }}
        >
          Newsletter
        </p>
        <p style={{ fontSize: "12.5px", color: "#6E6D68", margin: "0 0 14px", lineHeight: 1.6 }}>
          Get early access to new arrivals and exclusive offers.
        </p>
        <div style={{ display: "flex", gap: "0" }}>
          <input
            type="email"
            placeholder="Your email"
            style={{
              flex: 1,
              height: "40px",
              padding: "0 14px",
              border: "1.5px solid #DAD9D4",
              borderRight: "none",
              background: "#FFFFFF",
              fontSize: "12px",
              color: "#3D3929",
              outline: "none",
              fontFamily: '"Outfit", sans-serif',
              minWidth: 0,
            }}
          />
          <button
            style={{
              height: "40px",
              padding: "0 16px",
              background: "#A95A3A",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#8B4A2F")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#A95A3A")}
          >
            Join
          </button>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div
      style={{
        paddingTop: "24px",
        borderTop: "1px solid #DAD9D4",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <p style={{ fontSize: "11px", color: "#B4B2A7", margin: 0 }}>
        © {new Date().getFullYear()} Snitch Marketplace. All rights reserved.
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        {["About", "Contact", "Privacy", "Terms"].map((link) => (
          <a
            key={link}
            href="#"
            style={{
              fontSize: "11px",
              color: "#B4B2A7",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#A95A3A")}
            onMouseLeave={(e) => (e.target.style.color = "#B4B2A7")}
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

/* ════════════════════════════════════════════════════════════════════════════
   HOME PAGE
   ════════════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const products = useSelector((state) => state.product.products);
  const { handleAllProducts } = useProduct();
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  /* Fetch all products */
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        await handleAllProducts();
      } catch (_) {}
      finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Navbar scroll detection */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
        background: "#FAF9F5",
        minHeight: "100vh",
      }}
    >
      {/* Inject shimmer keyframes */}
      <style>{SHIMMER_STYLE}</style>

      {/* Navigation */}
      <Navbar scrolled={scrolled} />

      {/* Hero */}
      <HeroSection />

      {/* Decorative separator */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, #DAD9D4 30%, #DAD9D4 70%, transparent)",
        }}
      />

      {/* Featured Categories */}
      <CategoriesSection />

      {/* Thin rule */}
      <div
        style={{
          margin: "0 clamp(20px, 5vw, 64px)",
          height: "1px",
          background: "#DAD9D4",
        }}
      />

      {/* Latest Collection */}
      <CollectionSection products={products} loading={loading} />

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Home;