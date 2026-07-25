import { motion } from "framer-motion";
import { BadgeCheck, Package, CalendarDays, User } from "lucide-react";

/**
 * SellerInfoCard — Displays read-only logged-in seller information.
 * Styled to match the Snitch luxury fashion design system.
 */
const SellerInfoCard = ({ user }) => {
  /* ── Fallback data if user fields are partial ────────────── */
  const name = user?.fullName || user?.name || "Seller Name";
  const email = user?.email || "seller@snitch.com";
  const avatar = user?.avatar || user?.profilePicture || null;
  const isVerified = user?.isSeller ?? true;
  const productsListed = user?.productsCount ?? user?.sellerProductsCount ?? 0;

  /* ── Format member since date ───────────────────────────── */
  const rawDate = user?.createdAt;
  const memberSince = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Jan 2026";

  /* ── Initials fallback ──────────────────────────────────── */
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-[#DAD9D4]/60 shadow-[0_2px_24px_rgba(61,57,41,0.08)] overflow-hidden"
    >
      {/* ── Top accent strip ───────────────────────────────── */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #A95A3A 0%, #C47A5A 60%, #E9E6DC 100%)" }} />

      <div className="p-6">
        {/* ── Section label ──────────────────────────────── */}
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#B4B2A7] mb-5">
          Seller Profile
        </p>

        {/* ── Avatar + name row ──────────────────────────── */}
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#DAD9D4]"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#A95A3A]/10 border-2 border-[#A95A3A]/20 flex items-center justify-center">
                <span
                  className="text-lg font-bold text-[#A95A3A]"
                  style={{ fontFamily: "Playfair Display, Georgia, serif" }}
                >
                  {initials}
                </span>
              </div>
            )}
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          {/* Name + email */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3
                className="text-base font-semibold text-[#3D3929] leading-tight truncate"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                {name}
              </h3>
              {isVerified && (
                <BadgeCheck size={16} className="text-[#A95A3A] shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#6E6D68] mt-0.5 truncate">{email}</p>
          </div>
        </div>

        {/* ── Verified badge ─────────────────────────────── */}
        {isVerified && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A95A3A]/8 border border-[#A95A3A]/20 mb-5">
            <BadgeCheck size={12} className="text-[#A95A3A]" />
            <span className="text-[11px] font-semibold text-[#A95A3A] tracking-wide">
              Verified Seller
            </span>
          </div>
        )}

        {/* ── Divider ────────────────────────────────────── */}
        <div className="h-px bg-[#DAD9D4] mb-5" />

        {/* ── Stats ──────────────────────────────────────── */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5F4EF] flex items-center justify-center shrink-0">
              <CalendarDays size={14} className="text-[#6E6D68]" />
            </div>
            <div>
              <p className="text-[10px] text-[#B4B2A7] uppercase tracking-wider font-semibold">
                Member Since
              </p>
              <p className="text-sm font-semibold text-[#3D3929]">{memberSince}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5F4EF] flex items-center justify-center shrink-0">
              <Package size={14} className="text-[#6E6D68]" />
            </div>
            <div>
              <p className="text-[10px] text-[#B4B2A7] uppercase tracking-wider font-semibold">
                Products Listed
              </p>
              <p className="text-sm font-semibold text-[#3D3929]">{productsListed}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerInfoCard;
