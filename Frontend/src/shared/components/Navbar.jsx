import { useState, useEffect } from "react";
import { useNavigate, Link, useMatches } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Menu, X, ShoppingBag } from "lucide-react";

/* ── Design tokens — matches Snitch visual identity ─────── */
const C = {
  bg:        "#FAF9F5",
  text:      "#3D3929",
  muted:     "#6E6D68",
  border:    "#DAD9D4",
  primary:   "#A95A3A",
  primaryDk: "#8B4A2F",
  white:     "#FFFFFF",
};

const NAVBAR_HEIGHT = 72;

const Navbar = () => {
  const navigate = useNavigate();
  const matches = useMatches();
  const user = useSelector((s) => s.auth.user);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* Extract route metadata from the current active match */
  const currentMatch = [...matches].reverse().find((m) => m.handle?.navbar);
  const navbarConfig = currentMatch?.handle?.navbar || {};
  const navLinks = navbarConfig.navLinks || [];
  const showCart = navbarConfig.showCart !== false;

  /* Automatic scroll listener for backdrop elevation */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Responsive screen width check */
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Close mobile menu when route changes */
  useEffect(() => {
    setMenuOpen(false);
  }, [matches]);

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <>
      {/* ── Main Fixed Navbar ────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: `${NAVBAR_HEIGHT}px`,
          padding: "0 clamp(20px, 5vw, 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          background: scrolled
            ? "rgba(250,249,245,0.97)"
            : "rgba(250,249,245,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${
            scrolled ? "rgba(61,57,41,0.10)" : "rgba(218,217,212,0.65)"
          }`,
          transition: "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* ── Brand logo ───────────────────────────────────────── */}
        <button
          onClick={() => navigate("/home")}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.text,
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          Snitch<span style={{ color: C.primary }}>.</span>
        </button>

        {/* ── Desktop nav links (center) ───────────────────────── */}
        {!isMobile && navLinks.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(20px, 3vw, 36px)",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.text,
                  textDecoration: "none",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                  padding: "4px 0",
                  borderBottom: "1.5px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.primary;
                  e.currentTarget.style.borderBottomColor = C.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.borderBottomColor = "transparent";
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* ── Right action items ───────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          {/* Cart Icon — shown only when route allows and user is not a seller */}
          {showCart && (!user || user.role !== "seller") && (
            <motion.button
              whileHover={{ scale: 1.12, y: -1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/cart")}
              aria-label="Shopping bag"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.text,
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}
            >
              <ShoppingBag size={20} />
            </motion.button>
          )}

          {/* User Avatar / Login */}
          {user ? (
            <motion.button
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() =>
                user.role === "seller" ? navigate("/seller/products") : null
              }
              title={user.name || user.email}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: C.primary,
                color: C.white,
                border: `2px solid ${C.white}`,
                cursor: user.role === "seller" ? "pointer" : "default",
                fontSize: "13px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.02em",
                boxShadow: "0 2px 8px rgba(169,90,58,0.22)",
              }}
            >
              {initial}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              style={{
                height: "36px",
                padding: "0 20px",
                background: "transparent",
                color: C.text,
                border: `1.5px solid ${C.border}`,
                borderRadius: "99px",
                cursor: "pointer",
                fontFamily: '"Outfit", sans-serif',
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.color = C.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.text;
              }}
            >
              Sign In
            </motion.button>
          )}

          {/* Mobile menu toggle */}
          {isMobile && navLinks.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: C.text,
                display: "flex",
                alignItems: "center",
                padding: "4px",
              }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* ── Mobile Navigation Drawer ─────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: `${NAVBAR_HEIGHT}px`,
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(250,249,245,0.98)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: `1px solid ${C.border}`,
              padding: "8px 0 16px",
            }}
          >
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px clamp(20px, 5vw, 32px)",
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.text,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.border}`,
                  transition: "color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.primary;
                  e.currentTarget.style.background = "rgba(169,90,58,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { NAVBAR_HEIGHT };
export default Navbar;
