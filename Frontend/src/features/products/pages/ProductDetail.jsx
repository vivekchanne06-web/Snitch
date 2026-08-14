import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
} from "lucide-react";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import AddToCartToast from "../components/AddToCartToast";
import DirectCheckoutModal from "../../order/components/DirectCheckoutModal";
import { useToast } from "../../../shared/components/Toast";

/* ══════════════════════════════════════════════════════════════════
   DESIGN TOKENS — exact palette, typography & shadows
   ══════════════════════════════════════════════════════════════════ */
const C = {
  bg:          "#FAF9F5",
  card:        "#F5F4EF",
  white:       "#FFFFFF",
  primary:     "#A95A3A",
  primaryDk:   "#8B4A2F",
  text:        "#3D3929",
  muted:       "#6E6D68",
  border:      "#DAD9D4",
  input:       "#B4B2A7",
  secondary:   "#E9E6DC",
  dark:        "#1E1912",
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
    min-height: clamp(460px, calc(100vh - 104px), 820px);
    align-items: stretch;
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
    .product-hero-section {
      height: calc(100vh - 72px);
    }

    .product-hero-inner {
      min-height: 100%;
    }

    .product-hero-grid {
      height: 100%;
      min-height: 0;
    }

    .product-gallery-column {
      height: 100%;
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

  .product-detail-main {
    padding-bottom: 64px;
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

    .product-detail-main {
      padding-bottom: 100px;
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
   VARIANT SELECTOR
   Groups variant attributes into premium full-width dropdowns.
   Handles availability cascading so no impossible combination is selectable.
   ══════════════════════════════════════════════════════════════════ */
const VariantSelector = ({ variants, selectedVariant, onVariantChange }) => {
  const safeVariants = variants || [];
  if (safeVariants.length === 0) return null;

  /* ── Collect all unique attribute keys across all variants ─── */
  const attrKeys = useMemo(() => {
    const keys = new Set();
    safeVariants.forEach((v) => {
      if (v.attributes) Object.keys(v.attributes).forEach((k) => keys.add(k));
    });
    return [...keys];
  }, [safeVariants]);

  /* ── Current selections (derived from selectedVariant) ───────── */
  const currentAttrs = useMemo(
    () => selectedVariant?.attributes || {},
    [selectedVariant]
  );

  /* ── Given current selections, find all variants still reachable
       after locking the keys already set BEFORE `changedKey` ───── */
  const getAvailableValues = useCallback(
    (keyToQuery, lockedSelections) => {
      const reachable = safeVariants.filter((v) => {
        if (!v.attributes) return false;
        return Object.entries(lockedSelections).every(
          ([k, val]) => String(v.attributes[k] ?? "") === String(val)
        );
      });
      const vals = new Set();
      reachable.forEach((v) => {
        const val = v.attributes?.[keyToQuery];
        if (val !== undefined) vals.add(String(val));
      });
      return [...vals];
    },
    [safeVariants]
  );

  /* ── Stock status label ─────────────────────────────────────── */
  const stockStatus = useMemo(() => {
    if (!selectedVariant) return null;
    const s = selectedVariant.stock ?? 0;
    if (s === 0) return { label: "Out of Stock", color: "#D32F2F", bg: "rgba(211,47,47,0.08)" };
    if (s <= 5) return { label: `Low Stock — ${s} left`, color: "#B45309", bg: "rgba(180,83,9,0.08)" };
    return { label: `In Stock — ${s} available`, color: "#2E7D32", bg: "rgba(46,125,50,0.08)" };
  }, [selectedVariant]);

  /* ── Handle a dropdown change ───────────────────────────────── */
  const handleChange = useCallback(
    (changedKey, newVal) => {
      /* Build the new selection by updating the changed key */
      const next = { ...currentAttrs, [changedKey]: newVal };

      /* Find exact matching variant or closest match */
      const exact = safeVariants.find((v) =>
        attrKeys.every(
          (k) => String(v.attributes?.[k] ?? "") === String(next[k] ?? "")
        )
      );

      if (exact) {
        onVariantChange(exact);
        return;
      }

      /* No exact match — find best partial match (most keys matching) */
      const candidates = safeVariants.filter(
        (v) => String(v.attributes?.[changedKey] ?? "") === String(newVal)
      );
      if (candidates.length > 0) {
        onVariantChange(candidates[0]);
      }
    },
    [currentAttrs, safeVariants, attrKeys, onVariantChange]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        width: "100%",
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.input,
            margin: 0,
          }}
        >
          Select Options
        </p>
        {selectedVariant?.sku && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: C.muted,
              letterSpacing: "0.06em",
            }}
          >
            SKU: {selectedVariant.sku}
          </span>
        )}
      </div>

      {/* One full-width dropdown per attribute key */}
      {attrKeys.map((attrKey, keyIdx) => {
        /* Selections locked BEFORE this key in order */
        const locked = {};
        attrKeys.slice(0, keyIdx).forEach((k) => {
          if (currentAttrs[k]) locked[k] = currentAttrs[k];
        });
        const available = getAvailableValues(attrKey, locked);
        const currentVal = String(currentAttrs[attrKey] ?? "");

        return (
          <div key={attrKey} style={{ width: "100%" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "7px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.text,
                }}
              >
                {attrKey}
              </span>
              {currentVal && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: C.primary,
                  }}
                >
                  {currentVal}
                </span>
              )}
            </label>

            {/* Premium select — full width, consistent with design tokens */}
            <div style={{ position: "relative", width: "100%" }}>
              <select
                value={currentVal}
                onChange={(e) => handleChange(attrKey, e.target.value)}
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 42px 0 16px",
                  borderRadius: "8px",
                  border: `1.5px solid ${C.border}`,
                  background: C.white,
                  color: currentVal ? C.text : C.input,
                  fontSize: "13.5px",
                  fontWeight: 600,
                  fontFamily: '"Outfit", sans-serif',
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = C.primary;
                  e.target.style.boxShadow = `0 0 0 3px rgba(169,90,58,0.12)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = C.border;
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="" disabled>
                  Select {attrKey}
                </option>
                {available.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>

              {/* Custom chevron icon */}
              <svg
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: C.muted,
                }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        );
      })}

      {/* Stock status pill */}
      {stockStatus && (
        <motion.div
          key={stockStatus.label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "99px",
            background: stockStatus.bg,
            border: `1px solid ${stockStatus.color}22`,
            fontSize: "11.5px",
            fontWeight: 700,
            color: stockStatus.color,
            letterSpacing: "0.04em",
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: stockStatus.color,
              flexShrink: 0,
            }}
          />
          {stockStatus.label}
        </motion.div>
      )}
    </div>
  );
};



/* ══════════════════════════════════════════════════════════════════
   STICKY IMAGE GALLERY & TRANSITIONS — Immersive Full Image Fit
   ══════════════════════════════════════════════════════════════════ */
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
          <ShoppingBag size={28} color={C.input} />
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

        {/* Main Image Container — object-fit: cover for complete fill */}
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

            {/* Main Image with objectFit: cover for immersive fill */}
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

            {/* Prev / Next Arrows — Only visible on Hover */}
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
   PRODUCT INFO PANEL — Compact, Hugging Vertical Flow
   ══════════════════════════════════════════════════════════════════ */
const HIGHLIGHTS = [
  { icon: <Star size={13} />, label: "Premium Quality" },
  { icon: <Shield size={13} />, label: "Secure Checkout" },
  { icon: <Truck size={13} />, label: "Fast Delivery" },
  { icon: <RotateCcw size={13} />, label: "Easy Returns" },
];

const ProductInfoPanel = ({ product, selectedVariant, onVariantChange, onBuyNow }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  /* Derive display price — selected variant overrides base product price */
  const displayPrice = useMemo(
    () => selectedVariant?.price || product?.price,
    [selectedVariant, product]
  );

  const{handleAddToCart} = useCart();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSnapshot, setToastSnapshot] = useState(null);

  const handleAddToCartProduct = async () => {
    if (!selectedVariant) return;

    try {
      await handleAddToCart(product._id, selectedVariant._id);

      // Build a frozen snapshot so the popup shows the correctly added item
      // even if the user changes the variant selection afterward.
      const variantImages =
        selectedVariant.images?.length > 0
          ? selectedVariant.images
          : product.images || [];

      setToastSnapshot({
        productTitle: product.title,
        price: selectedVariant.price || product.price,
        variantImage: variantImages[0]?.url || variantImages[0] || null,
        attributes: selectedVariant.attributes || {},
      });
      setToastOpen(true);

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1800);
    } catch (error) {
      console.error("Add to cart failed:", error.response?.data?.message || error.message);
      // Do NOT show the success toast — the API failed.
    }
  };

  return (
    <div
      className="product-info-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(8px, 1vw, 12px)",
        padding: "clamp(2px, 0.4vw, 6px) 0",
        maxWidth: "56ch",
      }}
    >
      {/* 1. Brand Eyebrow & Wishlist Button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: C.primary,
          }}
        >
          SNITCH
        </span>
      </div>

      {/* 2. Product Title (Compact gap to Price) */}
      <h1
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)",
          fontWeight: 600,
          color: C.text,
          lineHeight: 1.18,
          margin: "0 0 2px",
          letterSpacing: "-0.01em",
        }}
      >
        {product.title}
      </h1>

      {/* 3. Price — shows selected variant price or base product price */}
      <div>
        <motion.span
          key={displayPrice?.amount}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: "clamp(1.5rem, 2.6vw, 1.9rem)",
            fontWeight: 700,
            color: C.primary,
            letterSpacing: "0.01em",
            display: "inline-block",
          }}
        >
          {formatPrice(displayPrice)}
        </motion.span>
        <span
          style={{
            marginLeft: "10px",
            fontSize: "11px", fontWeight: 600,
            color: C.input, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Inclusive of all taxes
        </span>
      </div>

      <div style={{ height: "1px", background: `linear-gradient(to right, ${C.border} 0%, transparent 85%)` }} />

      {/* 4a. Variant Selector — appears between price and description */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onVariantChange={onVariantChange}
        />
      )}

      {product.variants && product.variants.length > 0 && (
        <div style={{ height: "1px", background: `linear-gradient(to right, ${C.border} 0%, transparent 85%)` }} />
      )}

      {/* 4. Description (Compact) */}
      <div
        className="no-scrollbar"
        style={{
          maxHeight: "clamp(88px, 12vh, 140px)",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        <p
          style={{
            fontSize: "10px", fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: C.input, marginBottom: "4px",
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

      {/* 5. Feature Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {HIGHLIGHTS.map(({ icon, label }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.03, y: -1 }}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px",
              borderRadius: "99px",
              background: C.card,
              border: `1px solid ${C.border}`,
              fontSize: "11px", fontWeight: 600,
              color: C.text,
              letterSpacing: "0.02em",
              cursor: "default",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(61,57,41,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <span style={{ color: C.primary }}>{icon}</span>
            {label}
          </motion.div>
        ))}
      </div>

      {/* 6. Buy Now & Add to Cart (Hugging immediately after Feature Chips) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "4px" }}>
        {/* Buy Now */}
        <motion.button
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBuyNow}
          style={{
            width: "100%", height: "50px",
            background: C.primary,
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            boxShadow: "0 6px 24px rgba(169,90,58,0.32)",
            transition: "background 0.2s, box-shadow 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
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
          <ShoppingBag size={16} />
          Buy Now
        </motion.button>

        {/* Add to Cart */}
        <motion.button
          whileHover={{ scale: 1.015, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAddToCartProduct()}
          style={{
            width: "100%", height: "50px",
            background: addedToCart ? "rgba(169,90,58,0.06)" : "transparent",
            color: addedToCart ? C.primary : C.text,
            border: addedToCart ? `1.5px solid ${C.primary}` : `1.5px solid ${C.border}`,
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "all 0.25s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}
          onMouseEnter={(e) => {
            if (!addedToCart) {
              e.currentTarget.style.borderColor = C.primary;
              e.currentTarget.style.color = C.primary;
              e.currentTarget.style.background = "rgba(169,90,58,0.04)";
            }
          }}
          onMouseLeave={(e) => {
            if (!addedToCart) {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.text;
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {addedToCart ? (
            <>
              <Sparkles size={15} />
              Added to Cart
            </>
          ) : (
            <>
              <Eye size={15} />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>

      {/* Add-to-Cart success toast — rendered outside the panel flow */}
      <AddToCartToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        snapshot={toastSnapshot}
      />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   RELATED PRODUCTS — Up to 8 products with slideshow
   ══════════════════════════════════════════════════════════════════ */
const RelatedProductSlideshow = ({ images, title, hovered }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);
  const isMultiple = images && images.length > 1;

  const advance = useCallback(() => {
    setActiveIdx((p) => (p + 1) % images.length);
  }, [images]);

  useEffect(() => {
    if (!isMultiple) return;
    if (hovered) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(advance, 3500);
    return () => clearInterval(intervalRef.current);
  }, [hovered, isMultiple, advance]);

  useEffect(() => { setActiveIdx(0); }, [images]);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${C.secondary} 0%, ${C.border} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <ShoppingBag size={22} color={C.input} />
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
            initial={{ scale: 1.0 }}
            animate={{ scale: hovered ? 1.07 : 1.04 }}
            transition={{ duration: hovered ? 0.55 : 6, ease: hovered ? [0.22, 1, 0.36, 1] : "linear" }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </motion.div>
      </AnimatePresence>
      {isMultiple && (
        <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 30, display: "flex", alignItems: "center", gap: "5px" }}>
          {images.map((_, i) => (
            <motion.span
              key={i}
              animate={{ width: i === activeIdx ? 16 : 5, opacity: i === activeIdx ? 1 : 0.45, backgroundColor: i === activeIdx ? "#ffffff" : "rgba(255,255,255,0.7)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "block", height: "4px", borderRadius: "99px" }}
            />
          ))}
        </div>
      )}
    </>
  );
};

const RelatedProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const images = (product.images || []).map((img) => img.url || img);
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index % 4, 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "16px", overflow: "hidden",
        background: C.white,
        border: `1px solid rgba(218,217,212,0.65)`,
        boxShadow: hovered ? "0 12px 40px rgba(61,57,41,0.14)" : "0 2px 16px rgba(61,57,41,0.06)",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        style={{ position: "relative", paddingBottom: "125%", overflow: "hidden", background: C.secondary }}
      >
        <RelatedProductSlideshow images={images} title={product.title} hovered={hovered} />

        <AnimatePresence>
          {hovered && (
            <motion.div
              key="hover-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: "absolute", inset: 0, zIndex: 20,
                background: "linear-gradient(to top, rgba(20,17,12,0.82) 0%, rgba(20,17,12,0.35) 50%, transparent 100%)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
                padding: "0 16px 18px", gap: "10px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}
              >
                <motion.button
                  onClick={() => navigate(`/product/${product._id}`)}
                  whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1, height: "36px", background: C.white, color: C.text,
                    border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                >
                  <Eye size={12} /> View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setWishlisted((p) => !p); }}
                  style={{
                    width: "36px", height: "36px", flexShrink: 0,
                    background: wishlisted ? C.primary : "rgba(255,255,255,0.15)",
                    border: wishlisted ? "none" : "1.5px solid rgba(255,255,255,0.35)",
                    backdropFilter: "blur(4px)", borderRadius: "50%",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <Heart size={14} color="#FFFFFF" fill={wishlisted ? "#FFFFFF" : "none"} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1, height: "36px", background: C.primary, color: "#FFFFFF",
                    border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    boxShadow: "0 4px 12px rgba(169,90,58,0.35)",
                  }}
                >
                  <ShoppingBag size={12} /> Add
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{
          fontFamily: '"Outfit", sans-serif', fontSize: "13.5px", fontWeight: 600,
          color: C.text, margin: "0 0 5px", lineHeight: 1.3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {product.title}
        </h3>
        {product.description && (
          <p style={{
            fontSize: "11.5px", color: C.muted, lineHeight: 1.55, margin: "0 0 10px",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {product.description}
          </p>
        )}
        <span style={{ fontSize: "15px", fontWeight: 700, color: C.primary, letterSpacing: "0.01em" }}>
          {formatPrice(product.price)}
        </span>
      </div>
    </motion.article>
  );
};

const RelatedProducts = ({ currentId }) => {
  const allProducts = useSelector((s) => s.product.products);
  const related = allProducts
    .filter((p) => p._id !== currentId)
    .slice(0, 8);

  if (related.length === 0) return null;

  return (
    <section style={{ padding: "clamp(26px, 3.2vw, 46px) 0 clamp(44px, 5vw, 68px)", borderTop: `1px solid ${C.border}` }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}
      >
        <p style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em",
          textTransform: "uppercase", color: C.primary, marginBottom: "10px",
        }}>
          Curated Recommendations
        </p>
        <h2 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
          fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.15,
        }}>
          You May Also Like
        </h2>
      </motion.div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        {related.map((product, index) => (
          <RelatedProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════
   STICKY MOBILE BOTTOM ACTION BAR
   ══════════════════════════════════════════════════════════════════ */
const MobileStickyBar = ({ product, selectedVariant, onBuyNow }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSnapshot, setToastSnapshot] = useState(null);
  const { handleAddToCart } = useCart();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return null;

  const handleMobileAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      await handleAddToCart(product._id, selectedVariant._id);

      const variantImages =
        selectedVariant.images?.length > 0
          ? selectedVariant.images
          : product.images || [];

      setToastSnapshot({
        productTitle: product.title,
        price: selectedVariant.price || product.price,
        variantImage: variantImages[0]?.url || variantImages[0] || null,
        attributes: selectedVariant.attributes || {},
      });
      setToastOpen(true);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1800);
    } catch (error) {
      console.error("Mobile add to cart failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 90,
          background: "rgba(250,249,245,0.96)",
          backdropFilter: "blur(14px)",
          borderTop: `1px solid ${C.border}`,
          padding: "12px 20px 20px",
          display: "flex", gap: "10px",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
          onClick={handleMobileAddToCart}
          disabled={!selectedVariant}
          style={{
            flex: 1, height: "50px",
            background: addedToCart ? "rgba(169,90,58,0.06)" : "transparent",
            color: addedToCart ? C.primary : C.text,
            border: addedToCart ? `1.5px solid ${C.primary}` : `1.5px solid ${C.border}`,
            borderRadius: "8px", cursor: selectedVariant ? "pointer" : "not-allowed",
            fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
            transition: "all 0.2s",
            opacity: selectedVariant ? 1 : 0.5,
          }}
        >
          {addedToCart ? "Added ✓" : "Add to Cart"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
          onClick={onBuyNow}
          style={{
            flex: 1.5, height: "50px",
            background: C.primary, color: "#FFFFFF",
            border: "none", borderRadius: "8px",
            cursor: "pointer", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            boxShadow: "0 4px 16px rgba(169,90,58,0.35)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryDk)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
        >
          Buy Now
        </motion.button>
      </motion.div>

      <AddToCartToast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        snapshot={toastSnapshot}
      />
    </>
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
            <ShoppingBag size={36} color={C.primary} />
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", top: "-6px", right: "-6px",
            width: "34px", height: "34px", borderRadius: "50%",
            background: C.secondary, border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Sparkles size={14} color={C.primary} />
        </motion.div>
      </div>

      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: C.text, margin: "0 0 14px" }}>
        Product Not Found
      </h2>
      <p style={{ fontSize: "14px", color: C.muted, maxWidth: "340px", lineHeight: 1.7, margin: "0 0 36px" }}>
        We couldn't find this item. It may have been removed or the link might be incorrect.
      </p>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/home")}
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
        onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryDk; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.primary; }}
      >
        <HomeIcon size={15} />
        Return Home
      </motion.button>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN PRODUCT DETAIL PAGE
   ══════════════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { ProductId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [directCheckoutOpen, setDirectCheckoutOpen] = useState(false);
  const { handleGetProductDetail } = useProduct();

  const handleBuyNowClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedVariant) {
      showToast({
        title: "Variant Required",
        message: "Please select a size/variant before clicking Buy Now.",
        type: "error",
        duration: 3500,
      });
      return;
    }
    setDirectCheckoutOpen(true);
  };

  /* Auto-select first variant when product loads */
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  /* Gallery images — use selected variant images if available */
  const galleryImages = useMemo(() => {
    if (selectedVariant?.images?.length > 0) return selectedVariant.images;
    return product?.images || [];
  }, [selectedVariant, product]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await handleGetProductDetail(ProductId);
        if (!cancelled) {
          if (data) setProduct(data);
          else setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => { cancelled = true; };
  }, [ProductId]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [ProductId]);

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

      <main className="product-detail-main">
        <AnimatePresence mode="wait">
          {/* Loading Skeleton */}
          {loading && (
            <div className="product-detail-shell" style={{ paddingBlock: "24px" }}>
              <div style={{ display: isMobile ? "none" : "grid", gridTemplateColumns: "minmax(0, 55fr) minmax(0, 45fr)", gap: "clamp(20px, 3.5vw, 56px)", minHeight: "clamp(500px, calc(100vh - 120px), 860px)" }}>
                <div style={{ display: "flex", gap: "16px", height: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[0, 1, 2, 3].map((i) => <SkeletonBlock key={i} w="68px" h="86px" radius="10px" delay={i * 0.05} />)}
                  </div>
                  <SkeletonBlock w="100%" h="100%" radius="18px" delay={0} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
                  <SkeletonBlock w="85%" h="36px" radius="6px" delay={0.1} />
                  <SkeletonBlock w="40%" h="28px" radius="6px" delay={0.15} />
                  <SkeletonBlock w="100%" h="100px" radius="10px" delay={0.2} />
                  <SkeletonBlock w="100%" h="52px" radius="8px" delay={0.35} />
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
              {/* ── HERO PRODUCT SECTION — calc(100vh - 72px) ── */}
              <section
                className="product-hero-section"
                style={{
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="product-detail-shell product-hero-inner"
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    className="product-hero-grid"
                  >
                    {/* ── LEFT (55%): Sticky Image Gallery ────────── */}
                    <div className="product-gallery-column">
                      <ImageGallery images={galleryImages} />
                    </div>

                    {/* ── RIGHT (45%): Compact Product Info ───── */}
                    <div className="product-info-column">
                      <ProductInfoPanel
                        product={product}
                        selectedVariant={selectedVariant}
                        onVariantChange={setSelectedVariant}
                        onBuyNow={handleBuyNowClick}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ── RELATED PRODUCTS ──────────────────────────────── */}
              <div
                className="product-detail-shell"
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              >
                <RelatedProducts currentId={product._id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky mobile bar — pass selectedVariant so it can call the real API */}
        {!loading && product && (
          <MobileStickyBar
            product={product}
            selectedVariant={selectedVariant}
            onBuyNow={handleBuyNowClick}
          />
        )}

        {/* Direct Checkout Modal for Buy Now (Zero Cart Interference) */}
        {product && selectedVariant && (
          <DirectCheckoutModal
            isOpen={directCheckoutOpen}
            onClose={() => setDirectCheckoutOpen(false)}
            product={product}
            selectedVariant={selectedVariant}
            quantity={1}
          />
        )}
      </main>
    </motion.div>
  );
};

export default ProductDetail;