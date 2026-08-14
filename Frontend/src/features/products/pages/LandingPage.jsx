import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  ArrowUpRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useProduct } from "../hook/useProduct";

/* ═══════════════════════════════════════════════════════════════════════════
   SNITCH — Luxury Fashion Editorial Landing Page
   Palette: #FAF9F5 bg · #A95A3A primary · #8B4A2F hover · #3D3929 text
   Fonts: Outfit (sans) · Playfair Display (serif)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Editorial Curated Hero Assets ─────────────────────────────────────── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=85&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=85&fm=webp&fit=crop",
];

const CATEGORY_TILES = [
  {
    id: "tailoring",
    title: "Urban Tailoring",
    subtitle: "Precision Shirts & Blazers",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80&fit=crop",
    tag: "ESSENTIAL",
  },
  {
    id: "basics",
    title: "Luxury Basics",
    subtitle: "Heavyweight Tees & Polos",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80&fit=crop",
    tag: "BESTSELLER",
  },
  {
    id: "denim",
    title: "Refined Denim",
    subtitle: "Selvedge & Structured Cut",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80&fit=crop",
    tag: "NEW EDIT",
  },
  {
    id: "outerwear",
    title: "Outerwear & Jackets",
    subtitle: "All-Weather Statement Pieces",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=900&q=80&fit=crop",
    tag: "LIMITED",
  },
];

/* ── Currency helper ────────────────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return "";
  const sym =
    price.currency === "INR" ? "₹" : price.currency === "USD" ? "$" : (price.currency || "") + " ";
  return sym + Number(price.amount).toLocaleString("en-IN");
};

/* ── Scoped animations & custom CSS ────────────────────────────────────── */
const LANDING_CSS = `
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: flex;
    width: 200%;
    animation: marquee 24s linear infinite;
  }
  .animate-marquee:hover {
    animation-play-state: paused;
  }
  .editorial-img-hover {
    transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), filter 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .editorial-card:hover .editorial-img-hover {
    transform: scale(1.05);
    filter: brightness(0.95);
  }
`;

/* ════════════════════════════════════════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════════════════════════════════════════ */
const HeroSection = ({ onExplore }) => {
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "calc(100vh - 72px)",
        background: "#FAF9F5",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "40px clamp(20px, 5vw, 64px) 60px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "center",
        }}
      >
        {/* Left Column: Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "99px",
              background: "rgba(169,90,58,0.08)",
              border: "1px solid rgba(169,90,58,0.2)",
              width: "fit-content",
            }}
          >
            <Sparkles size={13} color="#A95A3A" />
            <span
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#A95A3A",
              }}
            >
              Autumn / Winter 2026 Collection
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
              fontWeight: 600,
              color: "#3D3929",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            DEFINED BY THE <br />
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#A95A3A" }}>
              WAY YOU MOVE.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "clamp(14px, 1.8vw, 16px)",
              color: "#6E6D68",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: "520px",
            }}
          >
            Explore luxury menswear engineered with precision tailoring, premium organic fabrics, and a clean minimalist aesthetic designed to transcend trends.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "16px",
              paddingTop: "8px",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExplore}
              style={{
                height: "52px",
                padding: "0 34px",
                background: "#A95A3A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "99px",
                fontFamily: '"Outfit", sans-serif',
                fontSize: "12.5px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 24px rgba(169,90,58,0.28)",
                transition: "background 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#8B4A2F")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#A95A3A")}
            >
              Explore Collection
              <ArrowRight size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExplore}
              style={{
                height: "52px",
                padding: "0 28px",
                background: "#FFFFFF",
                color: "#3D3929",
                border: "1.5px solid #DAD9D4",
                borderRadius: "99px",
                fontFamily: '"Outfit", sans-serif',
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#A95A3A";
                e.currentTarget.style.color = "#A95A3A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DAD9D4";
                e.currentTarget.style.color = "#3D3929";
              }}
            >
              View New Arrivals
            </motion.button>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(218,217,212,0.7)",
              marginTop: "8px",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#3D3929",
                  margin: 0,
                }}
              >
                100%
              </p>
              <p
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "11px",
                  color: "#6E6D68",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                Organic Materials
              </p>
            </div>
            <div style={{ width: "1px", height: "28px", background: "#DAD9D4" }} />
            <div>
              <p
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#3D3929",
                  margin: 0,
                }}
              >
                4.9 ★
              </p>
              <p
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "11px",
                  color: "#6E6D68",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                Customer Rating
              </p>
            </div>
            <div style={{ width: "1px", height: "28px", background: "#DAD9D4" }} />
            <div>
              <p
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#3D3929",
                  margin: 0,
                }}
              >
                Fast
              </p>
              <p
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "11px",
                  color: "#6E6D68",
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                Pan-India Shipping
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/5",
            maxHeight: "580px",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 24px 60px -12px rgba(61,57,41,0.22)",
            background: "#E9E6DC",
          }}
        >
          {/* Animated Hero Carousel */}
          <AnimatePresence mode="wait">
            <motion.img
              key={activeHeroIdx}
              src={HERO_IMAGES[activeHeroIdx]}
              alt="Snitch Fashion Editorial"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
              }}
            />
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(30,26,18,0.7) 0%, rgba(30,26,18,0.1) 45%, transparent 100%)",
            }}
          />

          {/* Floating Editorial Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "24px",
              right: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(250,249,245,0.92)",
              backdropFilter: "blur(12px)",
              padding: "16px 20px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#A95A3A",
                  margin: "0 0 2px",
                }}
              >
                Signature Cut
              </p>
              <h4
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#3D3929",
                  margin: 0,
                }}
              >
                Minimalist Linen Overshirt
              </h4>
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExplore}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#A95A3A",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(169,90,58,0.3)",
              }}
            >
              <ArrowUpRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   BRAND TICKER / MARQUEE
   ════════════════════════════════════════════════════════════════════════════ */
const BrandTicker = () => {
  const items = [
    "SNITCH EDITORIAL",
    "AUTUMN / WINTER 2026",
    "HAND-CRAFTED TAILORING",
    "ORGANIC COTTON ESSENTIALS",
    "FREE DOMESTIC EXPRESS SHIPPING",
    "100% ETHICAL CRAFTSMANSHIP",
  ];

  return (
    <div
      style={{
        background: "#3D3929",
        color: "#FAF9F5",
        padding: "16px 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="animate-marquee">
        {[...items, ...items].map((text, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "36px",
              paddingRight: "36px",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "11.5px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#FAF9F5",
              }}
            >
              {text}
            </span>
            <span style={{ color: "#A95A3A", fontSize: "14px" }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL BRAND STORY
   ════════════════════════════════════════════════════════════════════════════ */
const EditorialStorySection = ({ onExplore }) => {
  return (
    <section
      style={{
        padding: "100px clamp(20px, 5vw, 64px)",
        background: "#FAF9F5",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
        }}
      >
        {/* Editorial Image Stack */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative" }}
        >
          <div
            style={{
              width: "88%",
              aspectRatio: "3/4",
              borderRadius: "20px",
              overflow: "hidden",
              background: "#E9E6DC",
              boxShadow: "0 20px 48px rgba(61,57,41,0.12)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=85&fit=crop"
              alt="Snitch Tailoring"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Secondary Overlapping Accent Image */}
          <div
            style={{
              position: "absolute",
              bottom: "-32px",
              right: "0",
              width: "48%",
              aspectRatio: "1/1",
              borderRadius: "16px",
              overflow: "hidden",
              border: "6px solid #FAF9F5",
              boxShadow: "0 16px 40px rgba(61,57,41,0.18)",
              background: "#E9E6DC",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=700&q=85&fit=crop"
              alt="Craftsmanship Details"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </motion.div>

        {/* Story Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#A95A3A",
              margin: 0,
            }}
          >
            The New Standard
          </p>

          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 600,
              color: "#3D3929",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            MADE FOR EVERYDAY. <br />
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>
              DESIGNED TO STAND OUT.
            </span>
          </h2>

          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "15px",
              color: "#6E6D68",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            At Snitch, we reject disposable fashion. Every shirt, trouser, and jacket is crafted from high-density natural textiles, cut to accentuate form without restricting movement.
          </p>

          {/* Pillars List */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "16px",
              paddingTop: "12px",
            }}
          >
            {[
              "100% Premium Cotton & Linen",
              "Precision Hand Tailoring",
              "Pre-Shrunk & Long-Wear Weave",
              "Sustainably Sourced Fabrics",
            ].map((pillar, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={16} color="#A95A3A" />
                <span
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#3D3929",
                  }}
                >
                  {pillar}
                </span>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: "12px" }}>
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExplore}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: '"Outfit", sans-serif',
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#A95A3A",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Read The Full Story
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   SHOP BY CATEGORY GRID
   ════════════════════════════════════════════════════════════════════════════ */
const CategoryGridSection = ({ onSelectCategory }) => {
  return (
    <section
      style={{
        padding: "80px clamp(20px, 5vw, 64px)",
        background: "#F5F4EF",
        borderTop: "1px solid #DAD9D4",
        borderBottom: "1px solid #DAD9D4",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "44px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#A95A3A",
                margin: "0 0 6px",
              }}
            >
              Curated Edits
            </p>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 600,
                color: "#3D3929",
                margin: 0,
              }}
            >
              Shop By Category
            </h2>
          </div>

          <motion.button
            whileHover={{ x: 4 }}
            onClick={onSelectCategory}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: '"Outfit", sans-serif',
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#3D3929",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            View All Categories
            <ChevronRight size={16} color="#A95A3A" />
          </motion.button>
        </div>

        {/* Category Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "24px",
          }}
        >
          {CATEGORY_TILES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="editorial-card"
              onClick={onSelectCategory}
              style={{
                position: "relative",
                height: "380px",
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(61,57,41,0.08)",
                background: "#E9E6DC",
              }}
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="editorial-img-hover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Dark Overlay Gradient */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(20,17,12,0.85) 0%, rgba(20,17,12,0.2) 60%, transparent 100%)",
                }}
              />

              {/* Tag Pill */}
              <div
                style={{
                  position: "absolute",
                  top: "18px",
                  left: "18px",
                  background: "rgba(250,249,245,0.9)",
                  backdropFilter: "blur(8px)",
                  padding: "4px 10px",
                  borderRadius: "99px",
                }}
              >
                <span
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#A95A3A",
                  }}
                >
                  {cat.tag}
                </span>
              </div>

              {/* Content */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <h3
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  {cat.title}
                </h3>
                <p
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "12.5px",
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                  }}
                >
                  {cat.subtitle}
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "10px",
                    color: "#FFFFFF",
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "11.5px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Shop Now
                  <ArrowRight size={14} color="#A95A3A" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   FEATURED PRODUCTS (Using real API data)
   ════════════════════════════════════════════════════════════════════════════ */
const FeaturedProductsSection = ({ products, loading, onExplore }) => {
  const navigate = useNavigate();

  const featuredList = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Only parent products with title
    const parentOnly = products.filter((p) => p && p.title);
    // Deduplicate
    const seen = new Set();
    return parentOnly
      .filter((p) => {
        if (seen.has(p._id)) return false;
        seen.add(p._id);
        return true;
      })
      .slice(0, 4);
  }, [products]);

  return (
    <section
      style={{
        padding: "100px clamp(20px, 5vw, 64px)",
        background: "#FAF9F5",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "44px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#A95A3A",
                margin: "0 0 6px",
              }}
            >
              Hand-Picked
            </p>
            <h2
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 600,
                color: "#3D3929",
                margin: 0,
              }}
            >
              Featured Highlights
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            onClick={onExplore}
            style={{
              height: "44px",
              padding: "0 24px",
              borderRadius: "99px",
              border: "1.5px solid #DAD9D4",
              background: "#FFFFFF",
              color: "#3D3929",
              fontFamily: '"Outfit", sans-serif',
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Explore All Products
            <ArrowRight size={15} color="#A95A3A" />
          </motion.button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
              gap: "24px",
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: "360px",
                  borderRadius: "18px",
                  background: "#E9E6DC",
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ) : featuredList.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
              gap: "24px",
            }}
          >
            {featuredList.map((product, idx) => {
              const imgUrl =
                product.images?.[0]?.url ||
                (typeof product.images?.[0] === "string" ? product.images[0] : null);

              return (
                <motion.article
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: "#FFFFFF",
                    border: "1px solid rgba(218,217,212,0.7)",
                    boxShadow: "0 4px 20px rgba(61,57,41,0.06)",
                    cursor: "pointer",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(61,57,41,0.14)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,57,41,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "125%",
                      background: "#E9E6DC",
                      overflow: "hidden",
                    }}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={product.title}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ShoppingBag size={28} color="#B4B2A7" />
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "16px 18px 18px" }}>
                    <h3
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#3D3929",
                        margin: "0 0 6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#A95A3A",
                      }}
                    >
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              background: "#F5F4EF",
              borderRadius: "20px",
              border: "1px dashed #DAD9D4",
            }}
          >
            <p
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "14px",
                color: "#6E6D68",
                margin: "0 0 16px",
              }}
            >
              Explore our full collection to discover available pieces.
            </p>
            <button
              onClick={onExplore}
              style={{
                padding: "10px 24px",
                background: "#A95A3A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "99px",
                fontFamily: '"Outfit", sans-serif',
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Browse Catalog
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   PROMOTIONAL CAMPAIGN BANNER
   ════════════════════════════════════════════════════════════════════════════ */
const CampaignBanner = ({ onExplore }) => {
  return (
    <section
      style={{
        padding: "0 clamp(20px, 5vw, 64px)",
        margin: "40px 0 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          borderRadius: "28px",
          overflow: "hidden",
          background: "#3D3929",
          color: "#FAF9F5",
          padding: "clamp(48px, 7vw, 96px) clamp(24px, 6vw, 80px)",
        }}
      >
        {/* Background Subtle Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(169,90,58,0.3) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ relative: 10, maxWidth: "680px" }}>
          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#A95A3A",
              marginBottom: "12px",
            }}
          >
            Limited Edition Release
          </p>

          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              margin: "0 0 20px",
            }}
          >
            UPGRADE YOUR <br />
            EVERYDAY CABINET.
          </h2>

          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "15px",
              color: "rgba(250,249,245,0.8)",
              lineHeight: 1.65,
              marginBottom: "32px",
            }}
          >
            Discover understated luxury pieces engineered for versatility, effortless elegance, and uncompromised comfort.
          </p>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExplore}
            style={{
              height: "50px",
              padding: "0 34px",
              background: "#A95A3A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "99px",
              fontFamily: '"Outfit", sans-serif',
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 8px 24px rgba(169,90,58,0.35)",
            }}
          >
            Shop The Edit Now
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   BRAND STATEMENT (Breathing Room)
   ════════════════════════════════════════════════════════════════════════════ */
const BrandStatement = () => {
  return (
    <section
      style={{
        padding: "110px clamp(20px, 5vw, 64px)",
        background: "#F5F4EF",
        borderTop: "1px solid #DAD9D4",
        borderBottom: "1px solid #DAD9D4",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#A95A3A",
            marginBottom: "20px",
          }}
        >
          Our Philosophy
        </p>

        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
            fontWeight: 500,
            color: "#3D3929",
            lineHeight: 1.25,
            margin: "0 0 24px",
            letterSpacing: "-0.01em",
          }}
        >
          “STYLE ISN’T WHAT YOU WEAR. <br />
          <span style={{ fontStyle: "italic", color: "#A95A3A" }}>
            IT’S HOW YOU CARRY IT.
          </span>”
        </h2>

        <p
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: "14px",
            color: "#6E6D68",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          SNITCH MARKETPLACE — EST. 2026
        </p>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   VALUE PROPOSITION HIGHLIGHTS
   ════════════════════════════════════════════════════════════════════════════ */
const ValuePropsSection = () => {
  const props = [
    {
      icon: <Truck size={22} color="#A95A3A" />,
      title: "Complimentary Express Delivery",
      desc: "Fast pan-India dispatch on all curated orders",
    },
    {
      icon: <ShieldCheck size={22} color="#A95A3A" />,
      title: "Authentic Quality Guarantee",
      desc: "100% genuine textiles & rigorous quality inspection",
    },
    {
      icon: <RotateCcw size={22} color="#A95A3A" />,
      title: "Hassle-Free Returns",
      desc: "14-day effortless exchange policy",
    },
    {
      icon: <Lock size={22} color="#A95A3A" />,
      title: "100% Encrypted Checkout",
      desc: "Bank-grade security powered by Razorpay & COD",
    },
  ];

  return (
    <section
      style={{
        padding: "70px clamp(20px, 5vw, 64px)",
        background: "#FAF9F5",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "32px",
        }}
      >
        {props.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "24px",
              borderRadius: "16px",
              background: "#FFFFFF",
              border: "1px solid rgba(218,217,212,0.6)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(169,90,58,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.icon}
            </div>
            <h4
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "14.5px",
                fontWeight: 600,
                color: "#3D3929",
                margin: 0,
              }}
            >
              {p.title}
            </h4>
            <p
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "12.5px",
                color: "#6E6D68",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   FINAL CTA SECTION
   ════════════════════════════════════════════════════════════════════════════ */
const FinalCTASection = ({ onExplore }) => {
  return (
    <section
      style={{
        padding: "100px clamp(20px, 5vw, 64px)",
        background: "#FAF9F5",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "70px 36px",
          borderRadius: "28px",
          background: "linear-gradient(135deg, #F5F4EF 0%, #E9E6DC 100%)",
          border: "1px solid #DAD9D4",
          boxShadow: "0 16px 40px rgba(61,57,41,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Sparkles size={28} color="#A95A3A" />
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 600,
            color: "#3D3929",
            margin: 0,
          }}
        >
          FIND YOUR NEXT FIT.
        </h2>
        <p
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: "15px",
            color: "#6E6D68",
            maxWidth: "480px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Browse our complete catalog of luxury menswear, tailored shirts, and timeless essentials.
        </p>

        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onExplore}
          style={{
            height: "52px",
            padding: "0 40px",
            background: "#A95A3A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "99px",
            fontFamily: '"Outfit", sans-serif',
            fontSize: "12.5px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(169,90,58,0.3)",
            marginTop: "8px",
          }}
        >
          Explore All Pieces
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </section>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   EDITORIAL FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
const LandingFooter = () => {
  return (
    <footer
      style={{
        background: "#3D3929",
        color: "#FAF9F5",
        padding: "70px clamp(20px, 5vw, 64px) 36px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "44px",
          marginBottom: "60px",
        }}
      >
        {/* Col 1: Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "1.8rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#FAF9F5",
              margin: 0,
            }}
          >
            Snitch<span style={{ color: "#A95A3A" }}>.</span>
          </h3>
          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "13px",
              color: "rgba(250,249,245,0.65)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            India&apos;s premium fashion marketplace. Uncompromising quality, tailored silhouettes, and minimalist modern luxury.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#A95A3A",
              margin: "0 0 18px",
            }}
          >
            Navigation
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Shop Collection", path: "/home" },
              { label: "Shopping Bag", path: "/cart" },
              { label: "My Orders", path: "/orders" },
              { label: "Delivery Addresses", path: "/address" },
            ].map((link) => (
              <li key={link.path}>
                <a
                  href={link.path}
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "13px",
                    color: "rgba(250,249,245,0.75)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#A95A3A")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(250,249,245,0.75)")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div>
          <h4
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#A95A3A",
              margin: "0 0 18px",
            }}
          >
            Categories
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Tailored Shirts", "Heavyweight Tees", "Selvedge Denim", "Signature Outerwear"].map((cat) => (
              <li key={cat}>
                <a
                  href="/home"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "13px",
                    color: "rgba(250,249,245,0.75)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#A95A3A")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(250,249,245,0.75)")}
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div>
          <h4
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#A95A3A",
              margin: "0 0 18px",
            }}
          >
            Stay Connected
          </h4>
          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "12.5px",
              color: "rgba(250,249,245,0.65)",
              margin: "0 0 14px",
            }}
          >
            Subscribe to receive private preview access to limited edition drops.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              placeholder="Enter your email..."
              style={{
                flex: 1,
                height: "40px",
                borderRadius: "99px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.06)",
                padding: "0 16px",
                fontSize: "12px",
                color: "#FAF9F5",
                outline: "none",
                fontFamily: '"Outfit", sans-serif',
              }}
            />
            <button
              onClick={() => alert("Thank you for subscribing to Snitch Private Edits.")}
              style={{
                height: "40px",
                padding: "0 18px",
                borderRadius: "99px",
                border: "none",
                background: "#A95A3A",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: "11px",
            color: "rgba(250,249,245,0.45)",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} Snitch Marketplace. All rights reserved. Built with precision.
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms of Service", "Shipping Information"].map((term) => (
            <span
              key={term}
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "11px",
                color: "rgba(250,249,245,0.45)",
              }}
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const { handleAllProducts } = useProduct();
  const [loading, setLoading] = useState(true);

  /* Fetch real product catalog via existing useProduct hook */
  useEffect(() => {
    let active = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        await handleAllProducts();
      } catch (_) {
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      active = false;
    };
  }, [handleAllProducts]);

  const handleExplore = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
        background: "#FAF9F5",
        minHeight: "100vh",
        color: "#3D3929",
      }}
    >
      <style>{LANDING_CSS}</style>

      {/* 1. Hero Section */}
      <HeroSection onExplore={handleExplore} />

      {/* 2. Brand Ticker */}
      <BrandTicker />

      {/* 3. Editorial Story */}
      <EditorialStorySection onExplore={handleExplore} />

      {/* 4. Category Grid */}
      <CategoryGridSection onSelectCategory={handleExplore} />

      {/* 5. Featured Products (Real API Data) */}
      <FeaturedProductsSection products={products} loading={loading} onExplore={handleExplore} />

      {/* 6. Promotional Campaign Banner */}
      <CampaignBanner onExplore={handleExplore} />

      {/* 7. Brand Statement */}
      <BrandStatement />

      {/* 8. Value Proposition Highlights */}
      <ValuePropsSection />

      {/* 9. Final Call to Action */}
      <FinalCTASection onExplore={handleExplore} />

      {/* 10. Luxury Footer */}
      <LandingFooter />
    </motion.div>
  );
};

export default LandingPage;