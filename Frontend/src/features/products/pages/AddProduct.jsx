import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  BadgeCheck,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { useProduct } from "../hook/useProduct";
import LeftHeroPanel from "../components/LeftHeroPanel";
import CompactImageUpload from "../components/CompactImageUpload";
import SuccessToast from "../components/SuccessToast";

/* ─── Constants ──────────────────────────────────────────── */
const MAX_DESC = 600;

/* ─── Validation ─────────────────────────────────────────── */
const validators = {
  title: (v) =>
    !v.trim()
      ? "Title is required"
      : v.trim().length < 3
      ? "At least 3 characters"
      : "",
  description: (v) =>
    !v.trim()
      ? "Description is required"
      : v.trim().length < 20
      ? "At least 20 characters"
      : v.length > MAX_DESC
      ? `Under ${MAX_DESC} chars`
      : "",
  price: (v) =>
    v === "" || v === undefined
      ? "Price is required"
      : isNaN(Number(v)) || Number(v) < 0
      ? "Invalid price"
      : "",
};

/* ─── Shared field classes ────────────────────────────────── */
const inputBase =
  "w-full rounded-xl border bg-white text-sm font-medium text-[#3D3929] " +
  "placeholder:text-[#B4B2A7] transition-all duration-200 outline-none " +
  "focus:ring-2 focus:ring-[#A95A3A]/25 focus:border-[#A95A3A] " +
  "hover:border-[#A95A3A]/40";
const inputNormal = "border-[#DAD9D4]";
const inputErr =
  "border-rose-400 ring-2 ring-rose-400/25 focus:border-rose-400 focus:ring-rose-400/30";

/* ─── Tiny field error ────────────────────────────────────── */
const FErr = ({ e }) =>
  e ? (
    <p className="mt-1 text-[11px] text-rose-500 font-medium flex items-center gap-1">
      <span className="w-1 h-1 rounded-full bg-rose-500 inline-block shrink-0" />
      {e}
    </p>
  ) : null;

/* ─── Section heading ─────────────────────────────────────── */
const SectionHead = ({ label }) => (
  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#B4B2A7] mb-3">
    {label}
  </p>
);

/* ─── Card wrapper ────────────────────────────────────────── */
const Card = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`bg-white rounded-2xl border border-[#DAD9D4]/60 shadow-[0_2px_16px_rgba(61,57,41,0.07)] ${className}`}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════════ */
/*  AddProduct Page                                           */
/* ══════════════════════════════════════════════════════════ */
const AddProduct = () => {
  const navigate = useNavigate();
  const { handleAddProduct } = useProduct();
  const { user } = useSelector((state) => state.auth);

  /* ── Form state ───────────────────────────────────────── */
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    currency: "INR",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── Field handlers ───────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (serverError) setServerError("");
    if (touched[name] && validators[name])
      setErrors((p) => ({ ...p, [name]: validators[name](value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    if (validators[name])
      setErrors((p) => ({ ...p, [name]: validators[name](value) }));
  };

  /* ── Validate all ─────────────────────────────────────── */
  const validateAll = () => {
    const errs = {};
    Object.keys(validators).forEach((k) => {
      const e = validators[k](form[k] ?? "");
      if (e) errs[k] = e;
    });
    if (images.length === 0) errs.images = "At least one image required";
    if (images.length > 7) errs.images = "Maximum 7 images";
    setErrors(errs);
    setTouched({ title: true, description: true, price: true });
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ───────────────────────────────────────────── */
  const handlePublish = async () => {
    setServerError("");
    if (!validateAll()) return;
    if (images.some((i) => i.progress < 100)) {
      setServerError("Please wait for images to finish uploading.");
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("priceAmount", form.price);
      fd.append("priceCurrency", form.currency);
      images.forEach((img) => fd.append("images", img.file));
      await handleAddProduct(fd);
      setShowSuccess(true);
      setTimeout(() => navigate("/seller/products"), 2800);
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Seller display values ────────────────────────────── */
  const sellerName = user?.fullName || user?.name || "Your Store";
  const sellerEmail = user?.email || "";
  const sellerAvatar = user?.avatar || user?.profilePicture || null;
  const isVerified = user?.isSeller ?? true;
  const initials = sellerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* ─────────────────────────────────────────────────────── */
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#FAF9F5]">

      {/* ══ LEFT — 45% Hero Panel ══════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block w-[45%] h-full shrink-0"
      >
        <LeftHeroPanel />
      </motion.div>

      {/* ══ RIGHT — 55% Form Panel ═════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 h-full flex flex-col bg-[#FAF9F5] overflow-hidden"
      >
        {/* ── Top bar (back + seller strip) ─────────────── */}
        <div className="shrink-0 px-6 pt-6 pb-3 flex items-center justify-between gap-4">
          {/* Back */}
          <Link
            to="/seller/products"
            className="flex items-center gap-1.5 text-sm text-[#6E6D68] hover:text-[#3D3929] transition-colors font-medium group"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Dashboard
          </Link>

          {/* Seller strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#DAD9D4] bg-white shadow-sm"
          >
            {sellerAvatar ? (
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="w-6 h-6 rounded-full object-cover border border-[#DAD9D4]"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#A95A3A]/15 flex items-center justify-center">
                <span className="text-[9px] font-bold text-[#A95A3A]">{initials}</span>
              </div>
            )}
            <span className="text-xs font-semibold text-[#3D3929] max-w-[120px] truncate">
              {sellerName}
            </span>
            {isVerified && (
              <BadgeCheck size={13} className="text-[#A95A3A] shrink-0" />
            )}
          </motion.div>
        </div>

        {/* ── Page title ─────────────────────────────────── */}
        <div className="shrink-0 px-6 pb-4">
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-2xl font-normal text-[#3D3929] leading-tight"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Add New Product
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="text-xs text-[#6E6D68] mt-1"
          >
            Create a premium listing for your marketplace.
          </motion.p>
        </div>

        {/* ── Form body — NO outer scroll; only image grid scrolls ── */}
        <div className="flex-1 min-h-0 flex flex-col gap-3 px-6 pb-2 overflow-hidden">

          {/* ── Product Info Card — fixed height (shrink-0) ───────── */}
          <Card delay={0.22} className="shrink-0">
            <div className="p-4 space-y-3">
              <SectionHead label="Product Information" />

              {/* Title */}
              <div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Product title *"
                  maxLength={120}
                  aria-invalid={!!errors.title}
                  className={[inputBase, "h-10 px-4", errors.title ? inputErr : inputNormal].join(" ")}
                />
                <FErr e={errors.title} />
              </div>

              {/* Description */}
              <div>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe your product — material, fit, care…  *"
                    maxLength={MAX_DESC}
                    rows={2}
                    aria-invalid={!!errors.description}
                    className={[
                      inputBase,
                      "px-4 py-2.5 resize-none text-sm leading-relaxed",
                      errors.description ? inputErr : inputNormal,
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute bottom-2 right-3 text-[10px] font-medium tabular-nums pointer-events-none",
                      form.description.length > MAX_DESC * 0.9 ? "text-rose-400" : "text-[#B4B2A7]",
                    ].join(" ")}
                  >
                    {form.description.length}/{MAX_DESC}
                  </span>
                </div>
                <FErr e={errors.description} />
              </div>

              {/* Price + Currency row */}
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#B4B2A7] pointer-events-none select-none">
                    {form.currency === "INR" ? "₹" : "$"}
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    aria-invalid={!!errors.price}
                    className={[
                      inputBase,
                      "h-10 pl-8 pr-3",
                      errors.price ? inputErr : inputNormal,
                      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                    ].join(" ")}
                  />
                  <FErr e={errors.price} />
                </div>
                <select
                  id="currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className={[inputBase, "h-10 px-3 pr-8 cursor-pointer appearance-none bg-no-repeat w-28", inputNormal].join(" ")}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23B4B2A7' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 10px center",
                    backgroundSize: "14px",
                  }}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* ── Image Upload Card — flex-1 fills remaining space ── */}
          {/* Only the grid INSIDE this card scrolls, nothing else */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-h-0 bg-white rounded-2xl border border-[#DAD9D4]/60 shadow-[0_2px_16px_rgba(61,57,41,0.07)] flex flex-col overflow-hidden"
          >
            {/* Card header — fixed */}
            <div className="shrink-0 px-4 pt-4 pb-2">
              <SectionHead label="Product Images" />
            </div>

            {/* Scrollable image grid area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#DAD9D4 transparent" }}>
              <CompactImageUpload
                images={images}
                onChange={setImages}
                error={errors.images}
              />
            </div>
          </motion.div>

          {/* ── Server error (shown between cards and action bar) ── */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                key="serr"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="shrink-0 flex items-start gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700"
              >
                <AlertCircle size={13} className="shrink-0 mt-0.5 text-rose-500" />
                <span className="text-xs font-medium leading-snug">{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom action bar — Cancel + Publish only ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="shrink-0 px-6 py-4 border-t border-[#DAD9D4]/60 bg-white/80 backdrop-blur-sm flex items-center justify-between gap-3"
        >
          {/* Cancel */}
          <motion.button
            type="button"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02, color: "#3D3929" }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-4 text-sm font-medium text-[#6E6D68] hover:text-[#3D3929] transition-colors duration-200"
          >
            Cancel
          </motion.button>

          {/* Right: Publish */}
          <motion.button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -1 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={[
              "relative h-10 px-6 rounded-none overflow-hidden",
              "text-sm font-semibold text-white tracking-wide",
              "bg-[#A95A3A] shadow-[0_4px_16px_rgba(169,90,58,0.30)]",
              "hover:bg-[#8B4A2F] hover:shadow-[0_6px_20px_rgba(169,90,58,0.40)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A95A3A] focus-visible:ring-offset-2",
              "transition-all duration-200",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {/* Shimmer */}
            {!isSubmitting && (
              <span
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish Product"
              )}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── Toast ─────────────────────────────────────────── */}
      <SuccessToast
        show={showSuccess}
        message="Product published successfully!"
        onClose={() => setShowSuccess(false)}
        duration={4000}
      />
    </div>
  );
};

export default AddProduct;