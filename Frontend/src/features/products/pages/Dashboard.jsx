import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { useProduct } from "../hook/useProduct.js";

/* ─── Animation variants ────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.92, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

/* ─── Filter options ────────────────────────────────────── */
const FILTERS = [
  { label: "All Products", value: "all" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

/* ─── Currency symbol helper ────────────────────────────── */
const getCurrencySymbol = (currency) =>
  currency === "INR" ? "₹" : currency === "USD" ? "$" : (currency || "") + " ";

const formatPrice = (price) => {
  if (!price) return "—";
  const sym = getCurrencySymbol(price.currency);
  const amt = Number(price.amount);
  return sym + amt.toLocaleString("en-IN");
};

/* ─── Skeleton card ─────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-white border border-[#DAD9D4]/60 shadow-[0_2px_16px_rgba(61,57,41,0.06)]">
    <div className="relative w-full" style={{ paddingBottom: "125%" }}>
      <div className="absolute inset-0 overflow-hidden bg-[#E9E6DC]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            animation: "shimmer 1.6s infinite",
          }}
        />
      </div>
    </div>
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-[#E9E6DC] rounded-lg w-3/4 overflow-hidden relative">
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)", animation: "shimmer 1.6s 0.1s infinite" }} />
      </div>
      <div className="h-3 bg-[#E9E6DC] rounded-lg w-1/2 overflow-hidden relative">
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)", animation: "shimmer 1.6s 0.2s infinite" }} />
      </div>
      <div className="h-3 bg-[#E9E6DC] rounded-lg w-full overflow-hidden relative">
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)", animation: "shimmer 1.6s 0.3s infinite" }} />
      </div>
    </div>
  </div>
);

/* ─── Stat card ─────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: delay || 0, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-3.5 bg-white rounded-2xl border border-[#DAD9D4]/70 shadow-[0_2px_12px_rgba(61,57,41,0.06)] px-5 py-4 flex-1 min-w-0"
  >
    <div className="w-9 h-9 rounded-xl bg-[#A95A3A]/10 flex items-center justify-center shrink-0">
      <Icon size={17} className="text-[#A95A3A]" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B4B2A7] truncate">
        {label}
      </p>
      <p className="text-[#3D3929] font-semibold text-[15px] truncate mt-0.5" title={value}>
        {value}
      </p>
    </div>
  </motion.div>
);

/* ─── Product image slideshow ───────────────────────────── */
const ProductImageSlideshow = ({ images, title, hovered }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);
  const isMultiple = images && images.length > 1;

  /* Advance to next image */
  const advance = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % images.length);
  }, [images]);

  /* Start / stop interval depending on hover */
  useEffect(() => {
    if (!isMultiple) return;
    if (hovered) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(advance, 3500);
    return () => clearInterval(intervalRef.current);
  }, [hovered, isMultiple, advance]);

  /* Reset to first image when product changes */
  useEffect(() => {
    setActiveIdx(0);
  }, [images]);

  /* ── No images fallback ─────────────────────────────── */
  if (!images || images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F4EF] via-[#E9E6DC] to-[#DAD9D4] flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#DAD9D4]/60 flex items-center justify-center">
          <ShoppingBag size={24} className="text-[#B4B2A7]" />
        </div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#B4B2A7]">
          No Image Available
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Crossfade image layers ─────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Ken Burns slow zoom — pauses when hovered */}
          <motion.img
            src={images[activeIdx]}
            alt={`${title} — image ${activeIdx + 1}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            initial={{ scale: 1 }}
            animate={{ scale: hovered ? 1.06 : 1.04 }}
            transition={{
              duration: hovered ? 0.55 : 6,
              ease: hovered ? [0.22, 1, 0.36, 1] : "linear",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Pagination dots (multi-image only) ────────── */}
      {isMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {images.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === activeIdx ? 16 : 5,
                opacity: i === activeIdx ? 1 : 0.45,
                backgroundColor: i === activeIdx ? "#ffffff" : "rgba(255,255,255,0.7)",
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-1 rounded-full"
            />
          ))}
        </div>
      )}
    </>
  );
};

/* ─── Product card ──────────────────────────────────────── */
const ProductCard = ({ product, index, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const images = (product.images || []).map((img) => img.url);
  console.log(product.images);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      layout
      className="group rounded-2xl overflow-hidden bg-white border border-[#DAD9D4]/60 shadow-[0_2px_16px_rgba(61,57,41,0.06)] hover:shadow-[0_8px_32px_rgba(61,57,41,0.13)] transition-shadow duration-300 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — 4:5 aspect ratio */}
      <div 
        onClick={()=>{navigate(`/seller/products/${product._id}`);}}
      className="relative overflow-hidden" style={{ paddingBottom: "125%" }}>
       
        {/* Slideshow / fallback */}
        <ProductImageSlideshow
          images={images}
          title={product.title}
          hovered={hovered}
        />

        {/* Published badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#A95A3A] text-white shadow-sm">
            <span className="w-1 h-1 rounded-full bg-white/80" />
            Published
          </span>
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-5 gap-2.5"
              style={{
                background: "linear-gradient(to top, rgba(30,25,18,0.88) 0%, rgba(30,25,18,0.45) 50%, transparent 100%)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                {/* View */}
                <motion.button
                  whileHover={{ scale: 1.07, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/seller/products/${product._id}`); }}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-none bg-white text-[#3D3929] text-[11px] font-semibold tracking-wide hover:bg-[#FAF9F5] transition-colors duration-150 shadow-sm"
                >
                  <Eye size={12} />
                  View
                </motion.button>



                {/* Delete */}
                <motion.button
                  whileHover={{ scale: 1.07, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-none bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[11px] font-semibold hover:bg-rose-500/80 hover:border-transparent transition-all duration-150"
                >
                  <Trash2 size={12} />
                </motion.button>
              </motion.div>

              <p className="text-[10px] text-white/50 font-medium tracking-widest uppercase">
                Quick Preview
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-[13px] font-semibold text-[#3D3929] leading-snug line-clamp-1 flex-1"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {product.title}
          </h3>
          <span className="shrink-0 text-[13px] font-bold text-[#A95A3A]">
            {formatPrice(product.price)}
          </span>
        </div>
        {product.description && (
          <p className="text-[11.5px] text-[#6E6D68] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-[#A95A3A]/8 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#A95A3A]/12 flex items-center justify-center">
            <ShoppingBag size={36} className="text-[#A95A3A]" />
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#E9E6DC] border border-[#DAD9D4] flex items-center justify-center"
        >
          <Sparkles size={13} className="text-[#A95A3A]" />
        </motion.div>
      </div>

      <h2
        className="text-2xl font-normal text-[#3D3929] mb-3"
        style={{ fontFamily: "Playfair Display, Georgia, serif" }}
      >
        No Products Yet
      </h2>
      <p className="text-sm text-[#6E6D68] max-w-xs leading-relaxed mb-8">
        Start building your premium collection. Every great fashion brand begins with its first listing.
      </p>

      <motion.button
        onClick={() => navigate("/seller/products/add")}
        whileHover={{ scale: 1.015, y: -1 }}
        whileTap={{ scale: 0.985 }}
        className="relative h-12 px-8 bg-[#A95A3A] text-white text-sm font-semibold tracking-wide rounded-none shadow-[0_4px_20px_rgba(169,90,58,0.28)] hover:bg-[#8B4A2F] hover:shadow-[0_6px_24px_rgba(169,90,58,0.38)] transition-all duration-200 overflow-hidden flex items-center gap-2"
      >
        <Plus size={16} />
        Add Your First Product
      </motion.button>
    </motion.div>
  );
};

/* ─── Delete confirmation modal ─────────────────────────── */
const DeleteModal = ({ product, onCancel, onConfirm, isDeleting }) => (
  <AnimatePresence>
    {product && (
      <>
        <motion.div
          key="backdrop"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 bg-[#3D3929]/40 backdrop-blur-[3px]"
          onClick={onCancel}
        />
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl border border-[#DAD9D4]/70 shadow-[0_24px_64px_rgba(61,57,41,0.16)] p-7">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-5">
              <AlertTriangle size={22} className="text-rose-500" />
            </div>

            <h3
              className="text-[19px] font-normal text-[#3D3929] mb-2"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Delete Product?
            </h3>
            <p className="text-sm text-[#6E6D68] leading-relaxed mb-1">
              <span className="font-semibold text-[#3D3929]">"{product.title}"</span>{" "}
              will be permanently removed from your store.
            </p>
            <p className="text-xs text-[#B4B2A7] mb-7">This action cannot be undone.</p>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-none border border-[#DAD9D4] text-sm font-semibold text-[#6E6D68] hover:bg-[#FAF9F5] hover:text-[#3D3929] hover:border-[#B4B2A7] transition-all duration-150 disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-none bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.35)] transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ══════════════════════════════════════════════════════════ */
/*  Dashboard — My Products Page                              */
/* ══════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* Fetch on mount */
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        await handleGetSellerProducts();
      } catch (_) {}
      finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  /* Stats */
  const stats = useMemo(() => {
    const count = sellerProducts.length;
    if (count === 0) return { count: 0, avgPrice: "—", latest: "—" };

    const prices = sellerProducts
      .filter((p) => p.price && p.price.amount != null)
      .map((p) => Number(p.price.amount));

    const avgAmt =
      prices.length > 0
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : null;

    const avgCurrency = sellerProducts.find((p) => p.price && p.price.currency)?.price?.currency;
    const avgPrice = avgAmt != null ? getCurrencySymbol(avgCurrency) + avgAmt.toLocaleString("en-IN") : "—";
    const latest = sellerProducts[sellerProducts.length - 1]?.title || "—";
    return { count, avgPrice, latest };
  }, [sellerProducts]);

  /* Filtered + sorted */
  const displayProducts = useMemo(() => {
    let list = [...sellerProducts];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    switch (filter) {
      case "newest": list = list.reverse(); break;
      case "oldest": break;
      case "price_asc":
        list.sort((a, b) => (Number(a.price?.amount) || 0) - (Number(b.price?.amount) || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (Number(b.price?.amount) || 0) - (Number(a.price?.amount) || 0));
        break;
      default: break;
    }
    return list;
  }, [sellerProducts, search, filter]);

  /* Delete handlers */
  const handleDeleteRequest = (product) => setDeleteTarget(product);
  const handleDeleteCancel = () => { if (!isDeleting) setDeleteTarget(null); };
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      console.log("Delete product:", deleteTarget._id);
      await new Promise((r) => setTimeout(r, 900));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-[#FAF9F5]"
    >
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%);  }
        }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-10">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#B4B2A7] mb-1.5">
              Seller Dashboard
            </p>
            <h1
              className="text-3xl sm:text-[36px] font-normal text-[#3D3929] leading-tight"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              My Products
            </h1>
            <p className="mt-1.5 text-sm text-[#6E6D68]">
              Manage your fashion collection and product listings.
            </p>
          </div>

          <motion.button
            onClick={() => navigate("/seller/products/add")}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            className="relative shrink-0 h-11 px-6 bg-[#A95A3A] text-white text-sm font-semibold tracking-wide rounded-none shadow-[0_4px_20px_rgba(169,90,58,0.25)] hover:bg-[#8B4A2F] hover:shadow-[0_6px_24px_rgba(169,90,58,0.36)] transition-all duration-200 overflow-hidden flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A95A3A] focus-visible:ring-offset-2"
          >
            <span
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.13) 50%, transparent 70%)" }}
            />
            <Plus size={16} className="relative" />
            <span className="relative">Add Product</span>
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mb-7">
          <StatCard icon={ShoppingBag} label="Products" value={String(stats.count)} delay={0.08} />
          <StatCard icon={TrendingUp} label="Average Price" value={stats.avgPrice} delay={0.14} />
          <StatCard icon={Sparkles} label="Latest Product" value={stats.latest} delay={0.2} />
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8"
        >
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B4B2A7] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your products…"
              className="w-full h-10 pl-10 pr-9 rounded-xl border border-[#DAD9D4] bg-white text-sm text-[#3D3929] placeholder:text-[#B4B2A7] focus:outline-none focus:ring-2 focus:ring-[#A95A3A]/20 focus:border-[#A95A3A] hover:border-[#B4B2A7] transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4B2A7] hover:text-[#6E6D68] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={[
                  "h-9 px-3.5 text-xs font-semibold rounded-full border transition-all duration-200",
                  filter === f.value
                    ? "bg-[#A95A3A] text-white border-[#A95A3A] shadow-[0_2px_8px_rgba(169,90,58,0.22)]"
                    : "bg-white text-[#6E6D68] border-[#DAD9D4] hover:border-[#A95A3A]/40 hover:text-[#3D3929]",
                ].join(" ")}
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
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          )}

          {!loading && sellerProducts.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState />
            </motion.div>
          )}

          {!loading && sellerProducts.length > 0 && displayProducts.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Search size={36} className="text-[#DAD9D4] mb-4" />
              <h3
                className="text-lg font-normal text-[#3D3929] mb-2"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                No Results Found
              </h3>
              <p className="text-sm text-[#6E6D68]">Try a different search term or clear the filter.</p>
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="mt-5 h-9 px-5 text-xs font-semibold rounded-full border border-[#DAD9D4] text-[#6E6D68] hover:border-[#A95A3A]/40 hover:text-[#3D3929] transition-all duration-150"
              >
                Clear Search
              </button>
            </motion.div>
          )}

          {!loading && displayProducts.length > 0 && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {displayProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        {!loading && sellerProducts.length > 0 && displayProducts.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center text-xs text-[#B4B2A7]"
          >
            Showing {displayProducts.length} of {sellerProducts.length}{" "}
            {sellerProducts.length === 1 ? "product" : "products"}
          </motion.p>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        product={deleteTarget}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
};

export default Dashboard;
