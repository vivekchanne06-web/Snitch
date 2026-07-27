import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   Snitch — Premium Loading Screen
   Luxury fashion editorial aesthetic: Zara · COS · Apple · Nike · Vercel
   ───────────────────────────────────────────────────────────────────────────── */

/* ── Curated luxury fashion editorial images (Unsplash — free, no auth) ─── */
const EDITORIAL_IMAGES = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=85&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1558171813-1e6b9a69a4be?w=1600&q=85&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=85&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=85&fm=webp&fit=crop",
];

/* ── Animation variants ──────────────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const logoVariants = {
  initial: { opacity: 0, y: -12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const headingVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const subtitleVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const loaderVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.8 },
  },
};

/* ── Particle data — generated once, stable ─────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  size: 1.5 + (i % 3) * 0.8,
  duration: 6 + (i % 5) * 2.2,
  delay: (i * 0.4) % 4,
}));

/* ── Shimmer loader bar ──────────────────────────────────────────────────── */
const ShimmerLoader = () => (
  <div
    style={{
      width: "160px",
      height: "2px",
      borderRadius: "99px",
      background: "rgba(169, 90, 58, 0.18)",
      overflow: "hidden",
      position: "relative",
    }}
    aria-label="Loading"
    role="progressbar"
  >
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(90deg, transparent 0%, #A95A3A 40%, #C97A5A 60%, transparent 100%)",
        borderRadius: "99px",
      }}
      animate={{ x: ["-160px", "160px"] }}
      transition={{
        duration: 1.6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.2,
      }}
    />
  </div>
);

/* ── Floating particle ───────────────────────────────────────────────────── */
const Particle = ({ x, y, size, duration, delay }) => (
  <motion.div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: "rgba(169, 90, 58, 0.22)",
      pointerEvents: "none",
    }}
    animate={{ y: [0, -18, 0], opacity: [0.15, 0.35, 0.15] }}
    transition={{ duration, delay, ease: "easeInOut", repeat: Infinity }}
  />
);

/* ── Hero crossfade slide ─────────────────────────────────────────────────── */
const HeroSlide = ({ src, isActive }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        {/* Ken Burns zoom wrapper */}
        <motion.div
          style={{ width: "100%", height: "100%" }}
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 8, ease: "linear" }}
        >
          <img
            src={src}
            alt="Fashion editorial"
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </motion.div>

        {/* Soft dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(20,17,12,0.55) 0%, rgba(20,17,12,0.32) 50%, rgba(20,17,12,0.65) 100%)",
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Main LoadingScreen ────────────────────────────────────────────────── */
const LoadingScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  /* Rotate images every 4 s — cleanup on unmount to prevent leaks */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % EDITORIAL_IMAGES.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF9F5",
        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Background: radial blobs + particles ───────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
      >
        {/* Centre warm glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw",
            height: "70vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(169, 90, 58, 0.07) 0%, transparent 70%)",
          }}
        />

        {/* Blob — top-left */}
        <motion.div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(233, 230, 220, 0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ x: [0, 20, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Blob — bottom-right */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(169, 90, 58, 0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, -16, 0], y: [0, -14, 0] }}
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        />

        {/* Micro-particles */}
        {PARTICLES.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* ── Centred content ────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "480px",
          padding: "0 24px",
        }}
      >
        {/* ── Brand wordmark ──────────────────────────────────────────── */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          style={{ marginBottom: "28px", textAlign: "center" }}
        >
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: "#3D3929",
              textTransform: "uppercase",
              lineHeight: 1,
              display: "block",
            }}
          >
            Snitch
          </span>
          <span
            style={{
              display: "block",
              marginTop: "6px",
              fontSize: "10px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#A95A3A",
              fontWeight: 500,
            }}
          >
            Premium Fashion Marketplace
          </span>
        </motion.div>

        {/* ── Editorial hero ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 5",
            maxHeight: "44vh",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow:
              "0 24px 64px rgba(61, 57, 41, 0.18), 0 4px 16px rgba(61, 57, 41, 0.10)",
            background: "#E9E6DC",
            marginBottom: "32px",
          }}
        >
          {EDITORIAL_IMAGES.map((src, i) => (
            <HeroSlide key={src} src={src} isActive={i === activeIndex} />
          ))}

          {/* Slide indicator dots */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              zIndex: 10,
            }}
          >
            {EDITORIAL_IMAGES.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === activeIndex ? "20px" : "5px",
                  opacity: i === activeIndex ? 1 : 0.45,
                  background:
                    i === activeIndex ? "#FAF9F5" : "rgba(250,249,245,0.7)",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ height: "4px", borderRadius: "99px" }}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Heading ─────────────────────────────────────────────────── */}
        <motion.h1
          variants={headingVariants}
          initial="initial"
          animate="animate"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(1.35rem, 4vw, 1.65rem)",
            fontWeight: 600,
            color: "#3D3929",
            letterSpacing: "0.01em",
            textAlign: "center",
            margin: "0 0 10px",
            lineHeight: 1.3,
          }}
        >
          Preparing your experience
        </motion.h1>

        {/* ── Subtitle ────────────────────────────────────────────────── */}
        <motion.p
          variants={subtitleVariants}
          initial="initial"
          animate="animate"
          style={{
            fontSize: "13px",
            color: "#6E6D68",
            letterSpacing: "0.02em",
            textAlign: "center",
            margin: "0 0 28px",
            fontWeight: 400,
            lineHeight: 1.55,
          }}
        >
          Loading your personalized marketplace...
        </motion.p>

        {/* ── Premium shimmer loader + pulsing dots ───────────────────── */}
        <motion.div
          variants={loaderVariants}
          initial="initial"
          animate="animate"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ShimmerLoader />

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#A95A3A",
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1.4,
                  delay: i * 0.22,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
