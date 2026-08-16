import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  Home as HomeIcon,
  Upload,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Tag,
  IndianRupee,
  ArrowLeft,
} from "lucide-react";
import { useProduct } from "../hook/useProduct";
import SuccessToast from "../components/SuccessToast";

/* ══════════════════════════════════════════════════════════════════
   DESIGN TOKENS — exact palette, typography & shadows
   ══════════════════════════════════════════════════════════════════ */
const C = {
  bg: "#FAF9F5",
  card: "#F5F4EF",
  white: "#FFFFFF",
  primary: "#A95A3A",
  primaryDk: "#8B4A2F",
  text: "#3D3929",
  muted: "#6E6D68",
  border: "#DAD9D4",
  input: "#B4B2A7",
  secondary: "#E9E6DC",
  dark: "#1E1912",
  success: "#2E7D32",
  error: "#D32F2F",
};

/* ── Keyframes (shimmer, heart beat bounce) ─────────────────────── */
const SHIMMER_CSS = `
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  @keyframes heartBeat {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.35); }
    60%  { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  .product-detail-shell {
    --pd-max-width: clamp(1120px, 90vw, 1520px);
    width: min(100%, var(--pd-max-width));
    margin: 0 auto;
    padding-inline: clamp(20px, 4.8vw, 64px);
    box-sizing: border-box;
  }

  .product-hero-section {
    min-height: calc(100vh - 72px);
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  .product-hero-inner {
    width: 100%;
    padding-block: clamp(10px, 1.4vw, 16px);
  }

  .product-hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 55fr) minmax(0, 45fr);
    gap: clamp(20px, 3.5vw, 56px);
    align-items: start;
  }

  .product-gallery-column,
  .product-info-column {
    min-width: 0;
  }

  .product-gallery-column {
    position: sticky;
    top: calc(72px + clamp(12px, 2vw, 24px));
    align-self: start;
    height: min(100%, clamp(460px, calc(100vh - 106px), 820px));
    overflow: hidden;
  }

  @media (min-width: 1181px) {
    .product-gallery-column {
      height: clamp(460px, calc(100vh - 106px), 820px);
    }
  }

  .product-info-column {
    align-self: start;
  }

  @media (max-width: 1399px) {
    .product-hero-grid {
      grid-template-columns: minmax(0, 58fr) minmax(0, 42fr);
    }
  }

  @media (max-width: 1180px) {
    .product-hero-section {
      min-height: auto;
      height: auto;
    }

    .product-hero-grid {
      grid-template-columns: minmax(0, 1fr);
      min-height: unset;
      height: auto;
    }

    .product-gallery-column {
      position: static;
      top: auto;
      height: auto;
    }
  }

  @media (max-width: 767px) {
    .product-detail-shell {
      --pd-max-width: 100%;
      padding-inline: 20px;
    }

    .product-hero-inner {
      padding-block: 24px 12px;
    }

    .product-hero-grid {
      gap: 24px;
    }
  }
`;

/* ── Currency helper ───────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return "";
  const sym =
    price.currency === "INR" ? "₹"
      : price.currency === "USD" ? "$"
        : (price.currency || "") + " ";
  return sym + Number(price.amount).toLocaleString("en-IN");
};



/* ══════════════════════════════════════════════════════════════════
   STICKY IMAGE GALLERY & TRANSITIONS — Immersive Full Image Fit
   ═══════════════════════════════════════════════════════════════dele═══ */
const ImageGallery = ({ images }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState({});
  const [isMainHovered, setIsMainHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const safeImages = images && images.length > 0 ? images : [];
  const isMultiple = safeImages.length > 1;

  const prev = useCallback(
    () => setActiveIdx((p) => (p - 1 + safeImages.length) % safeImages.length),
    [safeImages.length]
  );

  const next = useCallback(
    () => setActiveIdx((p) => (p + 1) % safeImages.length),
    [safeImages.length]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const handleImgLoad = (idx) => setImgLoaded((p) => ({ ...p, [idx]: true }));

  if (safeImages.length === 0) {
    return (
      <div
        style={{
          width: "100%", height: "100%",
          minHeight: "360px",
          borderRadius: "18px",
          background: `linear-gradient(135deg, ${C.secondary} 0%, ${C.border} 100%)`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "16px",
        }}
      >
        <div
          style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(218,217,212,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Package size={28} color={C.input} />
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.input }}>
          No Image Available
        </span>
      </div>
    );
  }

  /* ── DESKTOP & TABLET Layout ───────────────────────────────────── */
  if (!isMobile) {
    return (
      <div style={{ display: "flex", gap: "clamp(10px, 1.2vw, 16px)", height: "100%", minHeight: 0, alignItems: "stretch", width: "100%" }}>
        {/* Vertical Scrollable Thumbnail Strip */}
        {isMultiple && (
          <div
            className="no-scrollbar"
            style={{
              display: "flex", flexDirection: "column", gap: "clamp(8px, 1vw, 10px)",
              flexShrink: 0, width: "clamp(56px, 5.2vw, 78px)",
              overflowY: "auto",
              maxHeight: "100%",
              paddingRight: "4px",
            }}
          >
            {safeImages.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveIdx(i)}
                whileHover={{ y: -2, opacity: 0.88 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "100%",
                  aspectRatio: "4 / 5",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: i === activeIdx ? `2.5px solid ${C.primary}` : `2px solid transparent`,
                  opacity: i === activeIdx ? 1 : 0.5,
                  cursor: "pointer",
                  padding: 0,
                  background: C.secondary,
                  transition: "opacity 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
                  outline: "none",
                  flexShrink: 0,
                  boxShadow: i === activeIdx ? `0 4px 14px rgba(169,90,58,0.22)` : "none",
                }}
              >
                <img
                  src={img.url || img}
                  alt={`Thumbnail ${i + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
              </motion.button>
            ))}
          </div>
        )}

        {/* Main Image Container */}
        <div
          style={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative", width: "100%" }}
          onMouseEnter={() => setIsMainHovered(true)}
          onMouseLeave={() => setIsMainHovered(false)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minHeight: "clamp(420px, 66vh, 780px)",
              borderRadius: "18px",
              overflow: "hidden",
              background: C.secondary,
              boxShadow: isMainHovered
                ? "0 16px 48px rgba(61,57,41,0.16)"
                : "0 6px 32px rgba(61,57,41,0.08)",
              transition: "box-shadow 0.4s ease",
            }}
          >
            {/* Shimmer skeleton */}
            {!imgLoaded[activeIdx] && (
              <div style={{ position: "absolute", inset: 0, background: C.secondary, zIndex: 2 }}>
                <div
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "60%", height: "100%",
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                    animation: "shimmer 1.6s infinite",
                  }}
                />
              </div>
            )}

            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: isMainHovered ? 1.03 : 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", inset: 0 }}
              >
                <img
                  src={safeImages[activeIdx].url || safeImages[activeIdx]}
                  alt={`Product detail ${activeIdx + 1}`}
                  loading="eager"
                  onLoad={() => handleImgLoad(activeIdx)}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next Arrows */}
            {isMultiple && (
              <AnimatePresence>
                {isMainHovered && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.85, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: -10 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prev}
                      aria-label="Previous image"
                      style={{
                        position: "absolute", left: "16px", top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: "42px", height: "42px",
                        borderRadius: "50%",
                        background: "rgba(250,249,245,0.92)",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(61,57,41,0.14)",
                      }}
                    >
                      <ChevronLeft size={18} color={C.text} />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.85, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: 10 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={next}
                      aria-label="Next image"
                      style={{
                        position: "absolute", right: "16px", top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: "42px", height: "42px",
                        borderRadius: "50%",
                        background: "rgba(250,249,245,0.92)",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${C.border}`,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(61,57,41,0.14)",
                      }}
                    >
                      <ChevronRight size={18} color={C.text} />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
            )}

            {/* Counter badge */}
            {isMultiple && (
              <div
                style={{
                  position: "absolute", bottom: "16px", right: "16px",
                  background: "rgba(20,17,12,0.6)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "99px",
                  padding: "4px 12px",
                  fontSize: "11px", fontWeight: 600,
                  color: "#FFFFFF",
                  letterSpacing: "0.06em",
                  pointerEvents: "none",
                }}
              >
                {activeIdx + 1} / {safeImages.length}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── MOBILE Layout ─────────────────────────────────────────────── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Main Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/5",
          borderRadius: "14px",
          overflow: "hidden",
          background: C.secondary,
          boxShadow: "0 4px 20px rgba(61,57,41,0.1)",
        }}
        onMouseEnter={() => setIsMainHovered(true)}
        onMouseLeave={() => setIsMainHovered(false)}
      >
        {!imgLoaded[activeIdx] && (
          <div style={{ position: "absolute", inset: 0, background: C.secondary, zIndex: 2 }}>
            <div
              style={{
                position: "absolute", top: 0, left: 0, width: "60%", height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                animation: "shimmer 1.6s infinite",
              }}
            />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <img
              src={safeImages[activeIdx].url || safeImages[activeIdx]}
              alt={`Product image ${activeIdx + 1}`}
              loading="lazy"
              onLoad={() => handleImgLoad(activeIdx)}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </motion.div>
        </AnimatePresence>

        {isMultiple && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prev}
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: "36px", height: "36px", borderRadius: "50%", background: "rgba(250,249,245,0.9)", border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <ChevronLeft size={16} color={C.text} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={next}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: "36px", height: "36px", borderRadius: "50%", background: "rgba(250,249,245,0.9)", border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <ChevronRight size={16} color={C.text} />
            </motion.button>
          </>
        )}
      </div>

      {/* Horizontal thumbnail strip */}
      {isMultiple && (
        <div className="no-scrollbar" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {safeImages.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIdx(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: "64px", height: "80px", flexShrink: 0,
                borderRadius: "8px", overflow: "hidden",
                border: i === activeIdx ? `2px solid ${C.primary}` : `2px solid transparent`,
                opacity: i === activeIdx ? 1 : 0.5,
                cursor: "pointer", padding: 0,
                background: C.secondary, outline: "none",
                transition: "opacity 0.2s, border-color 0.2s",
              }}
            >
              <img src={img.url || img} alt={`Thumb ${i + 1}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SELLER PRODUCT INFO & MANAGEMENT PANEL
   ══════════════════════════════════════════════════════════════════ */
const SellerProductInfo = ({ product }) => {
  const totalVariants = product?.variants?.length || 0;
  const currency = product?.price?.currency || "INR";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(12px, 1.4vw, 18px)",
        maxWidth: "56ch",
      }}
    >
      {/* 1. Seller Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: C.primary,
          }}
        >
          SELLER MANAGEMENT
        </span>
        <span
          style={{
            fontSize: "11px", fontWeight: 600,
            color: C.muted, background: C.card,
            padding: "4px 10px", borderRadius: "99px",
            border: `1px solid ${C.border}`,
          }}
        >
          ID: {product?._id ? product._id.slice(-6) : "N/A"}
        </span>
      </div>

      {/* 2. Product Title */}
      <h1
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)",
          fontWeight: 600,
          color: C.text,
          lineHeight: 1.18,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {product.title}
      </h1>

      {/* 3. Base Price */}
      <div>
        <span
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: "clamp(1.5rem, 2.6vw, 1.9rem)",
            fontWeight: 700,
            color: C.primary,
            letterSpacing: "0.01em",
          }}
        >
          {formatPrice(product.price)}
        </span>
        <span
          style={{
            marginLeft: "10px",
            fontSize: "11px", fontWeight: 600,
            color: C.input, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Base Price
        </span>
      </div>

      <div style={{ height: "1px", background: `linear-gradient(to right, ${C.border} 0%, transparent 85%)` }} />

      {/* 4. Description */}
      <div>
        <p
          style={{
            fontSize: "10px", fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: C.input, marginBottom: "6px",
          }}
        >
          About this piece
        </p>
        <p
          style={{
            fontSize: "13.5px",
            color: C.muted,
            lineHeight: 1.65,
            margin: 0,
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          {product.description}
        </p>
      </div>

      {/* 5. SELLER INFORMATION CARDS */}
      <div style={{ marginTop: "8px" }}>
        <p
          style={{
            fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: C.text, marginBottom: "12px",
            display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          <Package size={14} color={C.primary} />
          Product Information
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {/* Base Price Card */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(61,57,41,0.08)" }}
            transition={{ duration: 0.2 }}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 2px 10px rgba(61,57,41,0.04)",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Base Price
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>
              {formatPrice(product.price)}
            </span>
          </motion.div>

          {/* Currency Card */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(61,57,41,0.08)" }}
            transition={{ duration: 0.2 }}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 2px 10px rgba(61,57,41,0.04)",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Currency
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: C.primary }}>
              {currency}
            </span>
          </motion.div>

          {/* Total Variants Card */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(61,57,41,0.08)" }}
            transition={{ duration: 0.2 }}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              boxShadow: "0 2px 10px rgba(61,57,41,0.04)",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Total Variants
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>
              {totalVariants}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   EXISTING VARIANTS SECTION
   ══════════════════════════════════════════════════════════════════ */
const ExistingVariants = ({
  product,
  onDeleteVariant,
  onEditVariant,
}) => {
  const safeVariants = product?.variants || [];


  return (
    <div style={{ marginTop: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "1.4rem",
              fontWeight: 600,
              color: C.text,
              margin: 0,
            }}
          >
            Existing Variants
          </h2>
          <p style={{ fontSize: "12px", color: C.muted, margin: "2px 0 0" }}>
            Configured inventory and attributes for this product
          </p>
        </div>
        <span
          style={{
            fontSize: "11px", fontWeight: 700,
            color: C.primary, background: "rgba(169,90,58,0.08)",
            padding: "4px 12px", borderRadius: "99px",
          }}
        >
          {safeVariants.length} {safeVariants.length === 1 ? "Variant" : "Variants"}
        </span>
      </div>

      {safeVariants.length === 0 ? (
        <div
          style={{
            background: C.white,
            border: `1px dashed ${C.border}`,
            borderRadius: "14px",
            padding: "32px 20px",
            textAlign: "center",
            color: C.muted,
          }}
        >
          <Layers size={32} color={C.input} style={{ marginBottom: "10px" }} />
          <p style={{ fontSize: "14px", fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
            No Variants Created Yet
          </p>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>
            Use the form below to add your first product variant.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {safeVariants.map((variant, idx) => {
            const variantImages = (variant.images || []).map((img) => img.url || img);
            const priceVal =
              variant.price?.amount !== undefined
                ? variant.price.amount
                : typeof variant.price === "number"
                  ? variant.price
                  : variant.priceAmount || "";

            return (
              <motion.div
                key={variant._id || idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(61,57,41,0.1)" }}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px",
                  padding: "18px",
                  boxShadow: "0 3px 14px rgba(61,57,41,0.05)",
                  transition: "box-shadow 0.25s ease, transform 0.25s ease",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em",
                        textTransform: "uppercase", color: C.primary,
                        background: "rgba(169,90,58,0.08)",
                        padding: "4px 10px", borderRadius: "6px",
                      }}
                    >
                      Variant #{idx + 1}
                    </span>
                    {variant.sku && (
                      <span style={{ fontSize: "11px", fontWeight: 600, color: C.muted, letterSpacing: "0.06em" }}>
                        SKU: {variant.sku}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontSize: "12px", fontWeight: 600,
                        color: variant.stock > 0 ? C.success : C.error,
                        display: "flex", alignItems: "center", gap: "4px",
                      }}
                    >
                      ● {variant.stock > 0 ? `Stock: ${variant.stock}` : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Main Variant Row */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  {/* Variant Images Preview */}
                  {variantImages.length > 0 ? (
                    <div style={{ display: "flex", gap: "6px", overflowX: "auto", flexShrink: 0 }} className="no-scrollbar">
                      {variantImages.slice(0, 4).map((img, i) => (
                        <div
                          key={i}
                          style={{
                            width: "56px",
                            height: "68px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: C.secondary,
                            border: `1px solid ${C.border}`,
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={img}
                            alt={`Variant ${idx + 1} image ${i + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      ))}
                      {variantImages.length > 4 && (
                        <div
                          style={{
                            width: "56px", height: "68px", borderRadius: "8px",
                            background: C.card, border: `1px solid ${C.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "11px", fontWeight: 700, color: C.muted, flexShrink: 0,
                          }}
                        >
                          +{variantImages.length - 4}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "64px", height: "74px", borderRadius: "8px",
                        background: C.card, border: `1px solid ${C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", color: C.muted, textTransform: "uppercase",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  {/* Price & Details */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: C.input, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Price
                      </span>
                      <div style={{ fontSize: "17px", fontWeight: 700, color: C.text }}>
                        ₹{Number(priceVal).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons (Edit / Delete) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignSelf: "center" }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEditVariant(variant)}
                      style={{
                        padding: "6px 12px",
                        background: C.bg,
                        color: C.text,
                        border: `1px solid ${C.border}`,
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDeleteVariant(product._id, variant._id)}
                      style={{
                        padding: "6px 12px",
                        background: "rgba(211,47,47,0.06)",
                        color: C.error,
                        border: `1px solid rgba(211,47,47,0.2)`,
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>

                {/* Attributes Grid */}
                {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                  <div
                    style={{
                      marginTop: "14px",
                      paddingTop: "12px",
                      borderTop: `1px solid ${C.secondary}`,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {Object.entries(variant.attributes).map(([attrKey, attrVal]) => (
                      <div
                        key={attrKey}
                        style={{
                          background: C.card,
                          border: `1px solid ${C.border}`,
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: C.muted }}>{attrKey}:</span>
                        <span style={{ fontWeight: 700, color: C.text }}>{String(attrVal)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   ADD NEW VARIANT FORM
   ══════════════════════════════════════════════════════════════════ */
const AddVariantForm = ({ productId, product, onSuccess, onCancel }) => {
  const { handleAddProductVarient,
    handleupdateProductVarient,
    handleProductVarientDelete, } = useProduct();
  const fileInputRef = useRef(null);

  /* Form State */
  const [images, setImages] = useState([]); // [{ file: File, url: string }]
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [attributeRows, setAttributeRows] = useState([
    { key: "Size", value: "" },
    { key: "Color", value: "" },
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* Cleanup preview ObjectURLs on unmount */
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  /* Handle image selection */
  const handleImageFiles = (files) => {
    setErrorMsg("");
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > 7) {
      setErrorMsg("Maximum 7 images allowed for a variant");
      return;
    }

    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newPreviews].slice(0, 7));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  /* Attribute rows management */
  const addAttributeRow = () => {
    setAttributeRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateAttributeRow = (index, field, val) => {
    setAttributeRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  const removeAttributeRow = (index) => {
    setAttributeRows((prev) => prev.filter((_, i) => i !== index));
  };

  /* Validation rules */
  const isImagesValid = images.length >= 1 && images.length <= 7;
  const isPriceValid = price !== "" && !isNaN(Number(price)) && Number(price) > 0;
  const isStockValid = stock !== "" && !isNaN(Number(stock)) && Number(stock) >= 0;
  const isAttributesValid =
    attributeRows.length >= 1 &&
    attributeRows.every((row) => row.key.trim() !== "" && row.value.trim() !== "");

  const isFormValid = isImagesValid && isPriceValid && isStockValid && isAttributesValid;

  /* Handle Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Build attributes object
      const attributesObj = {};
      attributeRows.forEach((row) => {
        const k = row.key.trim();
        const v = row.value.trim();
        if (k && v) {
          attributesObj[k] = v;
        }
      });

      // Construct variant payload (including backend validator fallback fields)
      const newProductVariant = {
        images: images,
        stock: Number(stock),
        price: {
          amount: Number(price),
          currency: product?.price?.currency || "INR",
        },
        title: product?.title || "",
        description: product?.description || "",
        category: product?.category || "",
        brand: product?.brand || "",
        seller: product?.seller || "",
        priceCurrency: product?.price?.currency || "INR",
        attributes: attributesObj,
      };

      await handleAddProductVarient(productId, newProductVariant);


      // Success feedback
      setSuccessMsg("New variant added successfully!");
      setShowToast(true);

      // Clear Form State

      images.forEach((img) => URL.revokeObjectURL(img.url));
      setImages([]);
      setPrice("");
      setStock("");
      setAttributeRows([
        { key: "Size", value: "" },
        { key: "Color", value: "" },
      ]);

      // Re-fetch parent data
      if (onSuccess) {
        await onSuccess();
      }

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to add variant. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        marginTop: "40px",
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        padding: "clamp(20px, 3vw, 28px)",
        boxShadow: "0 6px 24px rgba(61,57,41,0.06)",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "1.4rem",
            fontWeight: 600,
            color: C.text,
            margin: 0,
          }}
        >
          Add New Variant
        </h2>
        <p style={{ fontSize: "12px", color: C.muted, margin: "3px 0 0" }}>
          Expand product inventory with new size, color, or material options
        </p>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(46,125,50,0.08)",
              border: `1px solid ${C.success}`,
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: C.success,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={18} />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(211,47,47,0.08)",
              border: `1px solid ${C.error}`,
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: C.error,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <AlertCircle size={18} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        {/* ── FIELD 1: Upload Images ───────────────────────────────── */}
        <div>
          <label
            style={{
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: C.text, display: "block", marginBottom: "8px",
            }}
          >
            Upload Images <span style={{ color: C.primary }}>* (Max 7)</span>
          </label>

          {/* Drag and drop area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragActive
                ? `2px dashed ${C.primary}`
                : `2px dashed ${C.border}`,
              background: dragActive ? "rgba(169,90,58,0.04)" : C.card,
              borderRadius: "12px",
              padding: "24px 16px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageFiles(e.target.files)}
            />
            <Upload size={24} color={C.primary} style={{ marginBottom: "8px" }} />
            <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
              Click to upload or drag & drop images
            </p>
            <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>
              PNG, JPG, WEBP up to 7 images ({images.length}/7 selected)
            </p>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.div
                    key={img.url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      position: "relative",
                      aspectRatio: "4/5",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: C.secondary,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Preview ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                      style={{
                        position: "absolute",
                        top: "4px", right: "4px",
                        width: "20px", height: "20px",
                        borderRadius: "50%",
                        background: "rgba(20,17,12,0.75)",
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <span
                        style={{
                          position: "absolute", bottom: "4px", left: "4px",
                          fontSize: "8px", fontWeight: 700, color: "#FFFFFF",
                          background: C.primary, padding: "2px 4px", borderRadius: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        Main
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── FIELD 2 & 3: Price & Stock ────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Field 2: Price */}
          <div>
            <label
              style={{
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: C.text, display: "block", marginBottom: "8px",
              }}
            >
              Price (₹) <span style={{ color: C.primary }}>*</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Variant Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                padding: "0 14px",
                borderRadius: "8px",
                border: `1.5px solid ${C.border}`,
                background: C.bg,
                color: C.text,
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.primary)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>

          {/* Field 3: Stock */}
          <div>
            <label
              style={{
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: C.text, display: "block", marginBottom: "8px",
              }}
            >
              Stock <span style={{ color: C.primary }}>*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Available Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                padding: "0 14px",
                borderRadius: "8px",
                border: `1.5px solid ${C.border}`,
                background: C.bg,
                color: C.text,
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.primary)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>
        </div>

        {/* ── FIELD 4: Dynamic Attributes Builder ───────────────────── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <label
              style={{
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: C.text, margin: 0,
              }}
            >
              Dynamic Attributes <span style={{ color: C.primary }}>*</span>
            </label>
            <button
              type="button"
              onClick={addAttributeRow}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                color: C.primary,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: 0,
              }}
            >
              <Plus size={14} /> Add Attribute
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {attributeRows.map((row, idx) => (
              <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Attribute Name (e.g. Size)"
                  value={row.key}
                  onChange={(e) => updateAttributeRow(idx, "key", e.target.value)}
                  style={{
                    flex: 1,
                    height: "42px",
                    padding: "0 12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${C.border}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="text"
                  placeholder="Attribute Value (e.g. XL)"
                  value={row.value}
                  onChange={(e) => updateAttributeRow(idx, "value", e.target.value)}
                  style={{
                    flex: 1,
                    height: "42px",
                    padding: "0 12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${C.border}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {attributeRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttributeRow(idx)}
                    style={{
                      width: "36px", height: "42px",
                      borderRadius: "8px",
                      background: "rgba(211,47,47,0.06)",
                      border: `1px solid rgba(211,47,47,0.2)`,
                      color: C.error,
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Validation Checklist / Inline Feedback */}
        {!isFormValid && (
          <div style={{ fontSize: "11.5px", color: C.muted, background: C.card, padding: "10px 14px", borderRadius: "8px" }}>
            <span style={{ fontWeight: 600, color: C.text }}>Required to submit:</span>
            <ul style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
              {!isImagesValid && <li>At least 1 image uploaded (max 7)</li>}
              {!isPriceValid && <li>Valid numeric variant price</li>}
              {!isStockValid && <li>Valid available stock quantity</li>}
              {!isAttributesValid && <li>At least 1 attribute with non-empty name and value</li>}
            </ul>
          </div>
        )}

        {/* ACTION BUTTONS: Cancel & Submit */}
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: 1,
              height: "50px",
              background: "transparent",
              color: C.text,
              border: `1.5px solid ${C.border}`,
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={isFormValid && !submitting ? { scale: 1.015, y: -1 } : {}}
            whileTap={isFormValid && !submitting ? { scale: 0.98 } : {}}
            type="submit"
            disabled={!isFormValid || submitting}
            style={{
              flex: 2,
              height: "50px",
              background: isFormValid ? C.primary : C.border,
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              cursor: isFormValid && !submitting ? "pointer" : "not-allowed",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: isFormValid ? "0 6px 24px rgba(169,90,58,0.32)" : "none",
              transition: "background 0.2s, box-shadow 0.2s, opacity 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: isFormValid && !submitting ? 1 : 0.65,
            }}
          >
            {submitting ? (
              <>
                <Sparkles size={16} className="spin" />
                Adding Variant...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Variant
              </>
            )}
          </motion.button>
        </div>
      </form>


      {/* Floating Success Toast */}
      <SuccessToast
        show={showToast}
        message="New Variant Added!"
        onClose={() => setShowToast(false)}
        duration={4000}
      />
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   EDIT VARIANT MODAL
   ══════════════════════════════════════════════════════════════════ */
const EditVariantModal = ({ productId, product, variant, onClose }) => {
  const { handleupdateProductVarient } = useProduct();
  const fileInputRef = useRef(null);

  /* Pre-fill Form State */
  const initialPrice =
    variant?.price?.amount !== undefined
      ? variant.price.amount
      : typeof variant?.price === "number"
      ? variant.price
      : variant?.priceAmount || "";

  const initialCurrency =
    variant?.price?.currency || variant?.priceCurrency || product?.price?.currency || "INR";

  const initialStock = variant?.stock !== undefined ? variant.stock : "";

  const initialAttributes = variant?.attributes
    ? Object.entries(variant.attributes).map(([key, value]) => ({ key, value: String(value) }))
    : [];

  const initialExistingImages = (variant?.images || []).map((img) => ({
    url: typeof img === "string" ? img : img.url || "",
    original: img,
  }));

  const [existingImages, setExistingImages] = useState(initialExistingImages);
  const [newImages, setNewImages] = useState([]); // [{ file: File, url: string }]
  const [price, setPrice] = useState(initialPrice);
  const [currency, setCurrency] = useState(initialCurrency);
  const [stock, setStock] = useState(initialStock);
  const [attributeRows, setAttributeRows] = useState(
    initialAttributes.length > 0 ? initialAttributes : [{ key: "", value: "" }]
  );

  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* Cleanup preview ObjectURLs on unmount */
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [newImages]);

  const totalImagesCount = existingImages.length + newImages.length;

  /* Handle image selection */
  const handleImageFiles = (files) => {
    setErrorMsg("");
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) return;

    if (totalImagesCount + validFiles.length > 7) {
      setErrorMsg("Maximum 7 images allowed for a variant");
      return;
    }

    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...newPreviews].slice(0, 7 - existingImages.length));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFiles(e.dataTransfer.files);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  /* Attribute rows management */
  const addAttributeRow = () => {
    setAttributeRows((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateAttributeRow = (index, field, val) => {
    setAttributeRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  const removeAttributeRow = (index) => {
    setAttributeRows((prev) => prev.filter((_, i) => i !== index));
  };

  /* Validation rules */
  const isImagesValid = totalImagesCount >= 1 && totalImagesCount <= 7;
  const isPriceValid = price !== "" && !isNaN(Number(price)) && Number(price) > 0;
  const isStockValid = stock !== "" && !isNaN(Number(stock)) && Number(stock) >= 0;
  const isAttributesValid =
    attributeRows.length >= 1 &&
    attributeRows.every((row) => row.key.trim() !== "" && row.value.trim() !== "");

  const isFormValid = isImagesValid && isPriceValid && isStockValid && isAttributesValid;

  /* Handle Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const attributesObj = {};
      attributeRows.forEach((row) => {
        const k = row.key.trim();
        const v = row.value.trim();
        if (k && v) {
          attributesObj[k] = v;
        }
      });

      const remainingExisting = existingImages.map((img) => img.url);
      const newFiles = newImages.map((img) => img.file);

      const updatedVariantData = {
        price: {
          amount: Number(price),
          currency: currency || "INR",
        },
        stock: Number(stock),
        attributes: attributesObj,
        existingImages: remainingExisting,
        images: newFiles,
      };

      await handleupdateProductVarient(productId, variant._id, updatedVariantData);

      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || "Failed to update variant. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(10px, 3vw, 20px)",
        background: "rgba(30, 25, 18, 0.55)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: "16px",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "calc(100dvh - 24px)",
          overflowY: "auto",
          padding: "clamp(14px, 3vw, 28px)",
          boxShadow: "0 16px 48px rgba(61,57,41,0.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            paddingBottom: "14px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "1.4rem",
                fontWeight: 600,
                color: C.text,
                margin: 0,
              }}
            >
              Edit Variant
            </h2>
            <p style={{ fontSize: "12px", color: C.muted, margin: "3px 0 0" }}>
              Update variant pricing, stock inventory, attributes, and images
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "rgba(211,47,47,0.08)",
                border: `1px solid ${C.error}`,
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: C.error,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <AlertCircle size={18} />
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* ── FIELD 1: Images ────────────────────────────────────── */}
          <div>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.text,
                display: "block",
                marginBottom: "8px",
              }}
            >
              Variant Images <span style={{ color: C.primary }}>* (Max 7)</span>
            </label>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: dragActive ? `2px dashed ${C.primary}` : `2px dashed ${C.border}`,
                background: dragActive ? "rgba(169,90,58,0.04)" : C.card,
                borderRadius: "12px",
                padding: "20px 16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageFiles(e.target.files)}
              />
              <Upload size={22} color={C.primary} style={{ marginBottom: "6px" }} />
              <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
                Click to upload or drag & drop new images
              </p>
              <p style={{ fontSize: "11px", color: C.muted, margin: 0 }}>
                PNG, JPG, WEBP ({totalImagesCount}/7 total images)
              </p>
            </div>

            {/* Image Previews (Existing + New) */}
            {totalImagesCount > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                  gap: "10px",
                  marginTop: "12px",
                }}
              >
                {/* Existing Images */}
                {existingImages.map((img, i) => (
                  <div
                    key={`existing-${i}`}
                    style={{
                      position: "relative",
                      aspectRatio: "4/5",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: C.secondary,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Existing image ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExistingImage(i);
                      }}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "rgba(20,17,12,0.75)",
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={12} />
                    </button>
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "4px",
                        fontSize: "8px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        background: C.dark,
                        padding: "2px 4px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      Saved
                    </span>
                  </div>
                ))}

                {/* New Uploaded Images */}
                {newImages.map((img, i) => (
                  <div
                    key={`new-${i}`}
                    style={{
                      position: "relative",
                      aspectRatio: "4/5",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: C.secondary,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`New image ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNewImage(i);
                      }}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "rgba(20,17,12,0.75)",
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={12} />
                    </button>
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "4px",
                        fontSize: "8px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        background: C.primary,
                        padding: "2px 4px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── FIELD 2 & 3: Price & Stock ────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "16px" }}>
            {/* Field 2: Price */}
            <div>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.text,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Price ({currency === "INR" ? "₹" : currency}) <span style={{ color: C.primary }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="Variant Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${C.border}`,
                  background: C.bg,
                  color: C.text,
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.primary)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
            </div>

            {/* Field 3: Stock */}
            <div>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.text,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Stock <span style={{ color: C.primary }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Available Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${C.border}`,
                  background: C.bg,
                  color: C.text,
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.primary)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
            </div>
          </div>

          {/* ── FIELD 4: Dynamic Attributes Builder ───────────────────── */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.text,
                  margin: 0,
                }}
              >
                Dynamic Attributes <span style={{ color: C.primary }}>*</span>
              </label>
              <button
                type="button"
                onClick={addAttributeRow}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: C.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: 0,
                }}
              >
                <Plus size={14} /> Add Attribute
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {attributeRows.map((row, idx) => (
                <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Attribute Name (e.g. Size)"
                    value={row.key}
                    onChange={(e) => updateAttributeRow(idx, "key", e.target.value)}
                    style={{
                      flex: 1,
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "8px",
                      border: `1.5px solid ${C.border}`,
                      background: C.bg,
                      color: C.text,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Attribute Value (e.g. XL)"
                    value={row.value}
                    onChange={(e) => updateAttributeRow(idx, "value", e.target.value)}
                    style={{
                      flex: 1,
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "8px",
                      border: `1.5px solid ${C.border}`,
                      background: C.bg,
                      color: C.text,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {attributeRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttributeRow(idx)}
                      style={{
                        width: "36px",
                        height: "42px",
                        borderRadius: "8px",
                        background: "rgba(211,47,47,0.06)",
                        border: `1px solid rgba(211,47,47,0.2)`,
                        color: C.error,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Validation Checklist / Inline Feedback */}
          {!isFormValid && (
            <div
              style={{
                fontSize: "11.5px",
                color: C.muted,
                background: C.card,
                padding: "10px 14px",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontWeight: 600, color: C.text }}>Required to submit:</span>
              <ul style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                {!isImagesValid && <li>At least 1 image remaining or uploaded (max 7)</li>}
                {!isPriceValid && <li>Valid numeric variant price</li>}
                {!isStockValid && <li>Valid available stock quantity</li>}
                {!isAttributesValid && <li>At least 1 attribute with non-empty name and value</li>}
              </ul>
            </div>
          )}

          {/* ACTION BUTTONS: Cancel & Save Changes */}
          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <motion.button
              type="button"
              onClick={onClose}
              disabled={submitting}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                height: "50px",
                background: "transparent",
                color: C.text,
                border: `1.5px solid ${C.border}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={isFormValid && !submitting ? { scale: 1.015, y: -1 } : {}}
              whileTap={isFormValid && !submitting ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!isFormValid || submitting}
              style={{
                flex: 2,
                height: "50px",
                background: isFormValid ? C.primary : C.border,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                cursor: isFormValid && !submitting ? "pointer" : "not-allowed",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                boxShadow: isFormValid ? "0 6px 24px rgba(169,90,58,0.32)" : "none",
                transition: "background 0.2s, box-shadow 0.2s, opacity 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                opacity: isFormValid && !submitting ? 1 : 0.65,
              }}
            >
              {submitting ? (
                <>
                  <Sparkles size={16} className="spin" />
                  Updating Variant...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════════════════
   SKELETON & NOT FOUND STATES
   ══════════════════════════════════════════════════════════════════ */
const SkeletonBlock = ({ w = "100%", h = "16px", radius = "8px", delay = 0 }) => (
  <div
    style={{
      width: w, height: h, borderRadius: radius,
      background: C.secondary, overflow: "hidden",
      position: "relative", flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute", top: 0, left: 0, width: "60%", height: "100%",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        animation: `shimmer 1.6s ${delay}s infinite`,
      }}
    />
  </div>
);

const NotFoundState = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 24px", textAlign: "center",
      }}
    >
      <div style={{ position: "relative", marginBottom: "36px" }}>
        <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "rgba(169,90,58,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "84px", height: "84px", borderRadius: "50%", background: "rgba(169,90,58,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Package size={36} color={C.primary} />
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: C.text, margin: "0 0 14px" }}>
        Product Not Found
      </h2>
      <p style={{ fontSize: "14px", color: C.muted, maxWidth: "340px", lineHeight: 1.7, margin: "0 0 36px" }}>
        We couldn't find this product in your seller dashboard.
      </p>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/seller/products")}
        style={{
          height: "50px", padding: "0 36px",
          background: C.primary, color: "#FFFFFF",
          border: "none", borderRadius: "6px",
          cursor: "pointer", fontSize: "13px", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          boxShadow: "0 6px 24px rgba(169,90,58,0.35)",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", gap: "8px",
        }}
      >
        <ArrowLeft size={15} />
        Back to Seller Products
      </motion.button>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN SELLER PRODUCT DETAIL PAGE
   ══════════════════════════════════════════════════════════════════ */
const SellerProductDetail = () => {
  const { productId } = useParams();
  const product = useSelector((state) => state.product.currentProduct);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  const formRef = useRef(null);
  const variantsRef = useRef(null);

  const {
    handleGetProductDetail,
    handleProductDelete,
    handleProductVarientDelete,
    handleupdateProductVarient,
  } = useProduct();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchProductDetails = useCallback(async () => {
    if (!productId) return;
    try {
      const data = await handleGetProductDetail(productId);
      if (data) {
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [productId, handleGetProductDetail]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    variantsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
  };

  const handleCloseEditModal = () => {
    setEditingVariant(null);
  };

  const handleDeleteVariant = async (productId, variantId) => {
    try {
      await handleProductVarientDelete(productId, variantId);
    } catch (error) {
      console.error(
        error.response?.data?.message || error.message
      );
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      style={{
        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
      }}
    >
      <style>{SHIMMER_CSS}</style>

      <main style={{ paddingBottom: "64px" }}>
        <AnimatePresence mode="wait">
          {/* Loading Skeleton */}
          {loading && (
            <div className="product-detail-shell" style={{ paddingBlock: "24px" }}>
              <div style={{ display: isMobile ? "none" : "grid", gridTemplateColumns: "minmax(0, 55fr) minmax(0, 45fr)", gap: "clamp(20px, 3.5vw, 56px)" }}>
                <div style={{ display: "flex", gap: "16px", height: "500px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[0, 1, 2, 3].map((i) => <SkeletonBlock key={i} w="68px" h="86px" radius="10px" delay={i * 0.05} />)}
                  </div>
                  <SkeletonBlock w="100%" h="100%" radius="18px" delay={0} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
                  <SkeletonBlock w="85%" h="36px" radius="6px" delay={0.1} />
                  <SkeletonBlock w="40%" h="28px" radius="6px" delay={0.15} />
                  <SkeletonBlock w="100%" h="100px" radius="10px" delay={0.2} />
                  <SkeletonBlock w="100%" h="120px" radius="10px" delay={0.35} />
                </div>
              </div>
            </div>
          )}

          {/* Not Found */}
          {!loading && notFound && (
            <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NotFoundState />
            </motion.div>
          )}

          {/* Product View */}
          {!loading && product && (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ══ HERO: Gallery (55%) + Product Info Summary (45%) ══ */}
              <section className="product-hero-section">
                <div className="product-detail-shell product-hero-inner">
                  <div className="product-hero-grid">
                    {/* LEFT: Sticky Image Gallery */}
                    <div className="product-gallery-column">
                      <ImageGallery images={product.images || []} />
                    </div>

                    {/* RIGHT: Product Info Summary only (no variants here) */}
                    <div className="product-info-column">
                      <SellerProductInfo product={product} />

                      {/* Quick-access: Add Variant trigger pinned in right column */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ marginTop: "28px" }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.015, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleOpenForm}
                          style={{
                            width: "100%", height: "50px",
                            background: C.primary, color: "#FFFFFF",
                            border: "none", borderRadius: "8px",
                            cursor: "pointer", fontSize: "13px", fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            boxShadow: "0 6px 24px rgba(169,90,58,0.32)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = C.primaryDk;
                            e.currentTarget.style.boxShadow = "0 8px 28px rgba(169,90,58,0.42)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = C.primary;
                            e.currentTarget.style.boxShadow = "0 6px 24px rgba(169,90,58,0.32)";
                          }}
                        >
                          <Plus size={16} />
                          Add New Variant
                        </motion.button>

                        {/* Variant count summary */}
                        {product.variants?.length > 0 && (
                          <p
                            style={{
                              marginTop: "12px",
                              fontSize: "12px",
                              color: C.muted,
                              textAlign: "center",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""} configured — see below
                          </p>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ══ FULL-WIDTH: Existing Variants ══════════════════════════ */}
              <div
                ref={variantsRef}
                style={{
                  borderTop: `1px solid ${C.border}`,
                  background: C.bg,
                  paddingTop: "48px",
                  paddingBottom: "12px",
                }}
              >
                <div className="product-detail-shell">
                  <ExistingVariants
                    product={product}
                    onDeleteVariant={handleDeleteVariant}
                    onEditVariant={handleEditVariant}
                  />
                </div>
              </div>

              {/* ══ FULL-WIDTH: Add Variant Form (collapsible) ═════════════ */}
              <div
                ref={formRef}
                style={{
                  borderTop: `1px solid ${C.border}`,
                  background: C.card,
                  paddingTop: "8px",
                  paddingBottom: "48px",
                }}
              >
                <div className="product-detail-shell">
                  {/* Collapsible header */}
                  <AnimatePresence initial={false}>
                    {!isFormOpen ? (
                      <motion.div
                        key="closed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ paddingTop: "32px" }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={handleOpenForm}
                          style={{
                            width: "100%",
                            height: "56px",
                            background: C.white,
                            color: C.text,
                            border: `1.5px dashed ${C.border}`,
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 12px rgba(61,57,41,0.04)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = C.primary;
                            e.currentTarget.style.color = C.primary;
                            e.currentTarget.style.background = "rgba(169,90,58,0.03)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = C.border;
                            e.currentTarget.style.color = C.text;
                            e.currentTarget.style.background = C.white;
                          }}
                        >
                          <Plus size={16} />
                          Add New Variant
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="open"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <AddVariantForm
                          productId={productId}
                          product={product}
                          onSuccess={async () => {
                            await fetchProductDetails();
                            handleCloseForm();
                          }}
                          onCancel={handleCloseForm}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ══ EDIT VARIANT MODAL ═════════════════════════════════════ */}
              <AnimatePresence>
                {editingVariant && (
                  <EditVariantModal
                    productId={productId}
                    product={product}
                    variant={editingVariant}
                    onClose={handleCloseEditModal}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </motion.div>
  );
};

export default SellerProductDetail;