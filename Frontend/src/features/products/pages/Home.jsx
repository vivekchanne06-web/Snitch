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



/* ═══════════════════════════════════════════════════════════════════════════
   SNITCH — Premium Fashion Homepage
   Design system: Zara · COS · H&M · Apple · Nike
   Colors: #FAF9F5 bg · #A95A3A primary · #3D3929 text · #6E6D68 muted
   Fonts: Outfit (sans) · Playfair Display (serif)
   ═══════════════════════════════════════════════════════════════════════════ */




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
    // 1. Keep only parent products (filter out variants returned individually)
    // Parent products always have a title. Variants typically only have attributes.
    const parentOnly = products.filter(
      (p) => p && p.title
    );

    // 2. Deduplicate by _id to ensure no accidental duplicates
    const seen = new Set();
    const unique = parentOnly.filter((p) => {
      if (seen.has(p._id)) return false;
      seen.add(p._id);
      return true;
    });

    let list = [...unique];

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
    <section id="collection" style={{ padding: "120px 0 100px", background: "#FAF9F5" }}>
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
            Products
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
          Showing {displayProducts.length}{" "}
            {displayProducts.length === 1 ? "piece" : "pieces"}
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
      padding: "24px clamp(20px, 5vw, 64px)",
    }}
  >
    <div
      style={{
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
        {["Privacy", "Terms", "Contact"].map((link) => (
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

      {/* Latest Collection */}
      <CollectionSection products={products} loading={loading} />

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Home;