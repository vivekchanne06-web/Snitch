import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── High-quality editorial fashion model images ──────────── */
const SLIDES = [
  {
    id: 0,
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=90&auto=format&fit=crop",
    alt: "Editorial fashion model — warm neutral tones",
  },
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=90&auto=format&fit=crop",
    alt: "Premium fashion editorial — elegant silhouette",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=90&auto=format&fit=crop",
    alt: "Luxury fashion model — editorial photography",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=90&auto=format&fit=crop",
    alt: "High fashion runway — premium collection",
  },
];

const INTERVAL_MS = 5000;

/* ══════════════════════════════════════════════════════════ */
const LeftHeroPanel = () => {
  const [current, setCurrent] = useState(0);

  /* Auto-advance every 5 s */
  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      INTERVAL_MS
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Image slides (crossfade + Ken Burns) ─────────────── */}
      <AnimatePresence initial={false}>
        {SLIDES.map((slide, i) =>
          i === current ? (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              {/* Ken Burns: slow zoom-in over the slide lifetime */}
              <motion.img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover object-top"
                loading={i === 0 ? "eager" : "lazy"}
                initial={{ scale: 1.0 }}
                animate={{ scale: 1.07 }}
                transition={{ duration: INTERVAL_MS / 1000 + 1.4, ease: "linear" }}
              />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* ── Multi-layer overlay for depth + text legibility ─── */}
      {/* Dark gradient — bottom-heavy for text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(18,14,10,0.82) 0%, rgba(18,14,10,0.40) 40%, rgba(18,14,10,0.14) 100%)",
        }}
      />
      {/* Warm terracotta tint — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(169,90,58,0.18) 0%, transparent 55%)",
        }}
      />

      {/* ── Logo ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute top-8 left-8 z-20 flex items-center gap-2"
      >
        <div className="w-8 h-8 bg-[#A95A3A] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
            <path d="M6 2l1.5 5H16.5L18 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 7h18l-2 11H5L3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span
          className="text-lg font-bold tracking-[0.1em] uppercase text-white"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Snitch<span className="text-[#A95A3A]">.</span>
        </span>
      </motion.div>

      {/* ── Slide dots ───────────────────────────────────────── */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full focus:outline-none"
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              background: i === current ? "#A95A3A" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* ── Bottom editorial content ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-8 xl:px-10 pb-10 xl:pb-12">

        {/* Verified badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mb-5"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20"
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/80">
              Verified Seller Experience
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-[2.2rem] xl:text-[2.6rem] leading-[1.08] font-normal text-white mb-4 max-w-xs"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Create Your Next{" "}
          <em
            style={{
              background: "linear-gradient(90deg, #C47A5A, #E9A07A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Bestseller.
          </em>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.58 }}
          className="text-[13px] text-white/55 leading-relaxed max-w-[260px] font-light"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Showcase your products with a premium shopping experience.
        </motion.p>

        {/* Thin accent line */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 w-12 h-px bg-[#A95A3A]"
        />
      </div>
    </div>
  );
};

export default LeftHeroPanel;
