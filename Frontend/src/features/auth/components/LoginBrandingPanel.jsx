import { motion } from "framer-motion";

/**
 * LoginBrandingPanel — Left-side editorial fashion hero panel (Login variant).
 *
 * Identical visual system as BrandingPanel (Register).
 * Copy updated for returning users: "WELCOME BACK / Your Style Journey Continues."
 */

/* ─── Animation variants ─────────────────────────────────── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.5 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Component ──────────────────────────────────────────── */
const LoginBrandingPanel = () => {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">

      {/* ── Full-bleed fashion image ──────────────────────── */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1761486927430-ebd8459a3888?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Premium fashion collection — Snitch Marketplace"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Subtle dark gradient overlay — bottom-weighted for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,18,14,0.72) 0%, rgba(20,18,14,0.28) 45%, rgba(20,18,14,0.12) 100%)",
          }}
        />

        {/* Thin warm left-edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(20,18,14,0.18) 0%, transparent 40%)",
          }}
        />
      </motion.div>

      {/* ── Logo — top-left ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute top-10 left-10 z-20 flex items-center gap-2.5"
      >
        <span
          className="text-2xl font-bold tracking-[0.14em] uppercase text-white"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Snitch
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#A95A3A] mt-0.5" />
      </motion.div>

      {/* ── Bottom-left editorial content ─────────────────── */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 z-20 p-10 xl:p-14"
      >

        {/* Season label */}
        <motion.div variants={lineVariants} className="mb-5">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70">
            Welcome Back
          </span>
          <div className="mt-2 w-10 h-px bg-[#A95A3A]" />
        </motion.div>

        {/* Editorial headline — Playfair Display */}
        <motion.h1
          variants={lineVariants}
          className="text-[2.6rem] xl:text-[3.2rem] leading-[1.1] font-normal text-white mb-5 max-w-sm"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Your Style Journey<br />
          <em>Continues.</em>
        </motion.h1>

        {/* Descriptor paragraph */}
        <motion.p
          variants={lineVariants}
          className="text-sm xl:text-[15px] text-white/65 leading-relaxed max-w-xs mb-8 font-light"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Sign in to discover new collections, track your orders, manage your
          wishlist, and continue shopping with ease.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={lineVariants}
          className="flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white tracking-wide transition-all duration-300"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: "#A95A3A",
              letterSpacing: "0.06em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#8B4A2F"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#A95A3A"; }}
          >
            Explore Collection
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginBrandingPanel;
