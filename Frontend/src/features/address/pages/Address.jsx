import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { useAddress } from "../hook/useAddress";
import { useToast } from "../../../shared/components/Toast";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";

/* ══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ══════════════════════════════════════════════════════════════════════ */
const MAX_ADDRESSES = 3;

/* ── Scoped CSS ─────────────────────────────────────────────────── */
const ADDRESS_CSS = `
  .address-shell {
    min-height: 100vh;
    background: var(--color-background);
  }

  .address-layout {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 clamp(14px, 4vw, 48px);
    padding-top: 104px;
    padding-bottom: 80px;
  }

  @keyframes addr-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

/* ══════════════════════════════════════════════════════════════════════
   LOADING SKELETON
   ══════════════════════════════════════════════════════════════════════ */
const AddressSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          height: "164px",
          borderRadius: "var(--radius-lg)",
          background:
            "linear-gradient(90deg, #F5F4EF 0%, #E9E6DC 50%, #F5F4EF 100%)",
          backgroundSize: "200% 100%",
          animation: "addr-shimmer 1.6s infinite",
          opacity: 0.7 - i * 0.18,
        }}
      />
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════════════════════════════════ */
const EmptyAddressState = ({ onAdd }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{
      textAlign: "center",
      padding: "72px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "14px",
    }}
  >
    {/* Icon */}
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "76px",
        height: "76px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #F5F4EF 0%, #E9E6DC 100%)",
        border: "1px solid #DAD9D4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "4px",
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#B4B2A7"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18 }}
      style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
          fontWeight: 600,
          color: "#3D3929",
          letterSpacing: "0.01em",
        }}
      >
        No delivery address
      </h2>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: "13.5px",
          color: "#6E6D68",
          fontWeight: 400,
          maxWidth: "280px",
          lineHeight: 1.65,
        }}
      >
        Add an address to continue with your order.
      </p>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.28 }}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onAdd}
      style={{
        marginTop: "4px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: "44px",
        padding: "0 24px",
        background: "#A95A3A",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        boxShadow: "var(--shadow-button)",
      }}
    >
      <Plus size={14} />
      Add address
    </motion.button>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════════
   ADDRESS PAGE — Main Component
   ══════════════════════════════════════════════════════════════════════ */
const Address = () => {
  const { handleCreateAddress, handleGetUserAddress, handleSelectAddress,handleDeleteAddress,handleUpdateAddress } =
    useAddress();
  const { addresses, selectedAddress } = useSelector(
    (state) => state.address
  );
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetched, setFetched] = useState(false);

  /* ── Fetch addresses on mount ──────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      await handleGetUserAddress();
      setFetched(true);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Auto-select default (only if nothing is already selected) ─── */
  useEffect(() => {
    if (!fetched || addresses.length === 0 || selectedAddress) return;
    const defaultAddr =
      addresses.find((a) => a.isDefault) || addresses[0];
    handleSelectAddress(defaultAddr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, addresses]);

  const atMax = addresses.length >= MAX_ADDRESSES;

  /* ── Form open / edit / cancel handlers ────────────────────────── */
  const handleOpenAddForm = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  /* ── Delete handler ────────────────────────────────────────────── */
  const handleDelete = async (addressId) => {
    try {
      const response = await handleDeleteAddress(addressId);
      if (response?.success) {
        if (selectedAddress?._id === addressId) {
          handleSelectAddress(null);
        }
        showToast({
          title: "Address deleted",
          message: "Address removed successfully.",
          type: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Could not delete address",
          message: response?.error || response?.message || "Please try again.",
          type: "error",
          duration: 3500,
        });
      }
    } catch (err) {
      showToast({
        title: "Could not delete address",
        message: err.message || "Please try again.",
        type: "error",
        duration: 3500,
      });
    }
  };

  /* ── Form submission (Create or Update) ────────────────────────── */
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        const response = await handleUpdateAddress(editingAddress._id, formData);
        if (response?.success) {
          if (selectedAddress?._id === editingAddress._id) {
            handleSelectAddress(response.address || { ...editingAddress, ...formData });
          }
          showToast({
            title: "Address updated",
            message: "Address updated successfully.",
            type: "success",
            duration: 3000,
          });
          setShowForm(false);
          setEditingAddress(null);
        } else {
          showToast({
            title: "Could not update address",
            message: response?.error || response?.message || "Please try again.",
            type: "error",
            duration: 3500,
          });
        }
      } else {
        const response = await handleCreateAddress(formData);
        if (response?.success) {
          // Select the newly created address
          handleSelectAddress(response.address);
          showToast({
            title: "Address saved",
            message: "Address added successfully.",
            type: "success",
            duration: 3000,
          });
          setShowForm(false);
        } else {
          showToast({
            title: "Could not save address",
            message: response?.error || response?.message || "Please try again.",
            type: "error",
            duration: 3500,
          });
        }
      }
    } catch {
      showToast({
        title: editingAddress ? "Could not update address" : "Could not save address",
        message: "Please try again.",
        type: "error",
        duration: 3500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <>
      <style>{ADDRESS_CSS}</style>

      <div className="address-shell">
        <main className="address-layout">

          {/* ── Back to Cart ─────────────────────────────── */}
          <motion.button
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover="hovered"
            onClick={() => navigate("/cart")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0 20px",
              fontFamily: "var(--font-sans)",
              fontSize: "11.5px",
              fontWeight: 600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#6E6D68",
              transition: "color 0.18s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#A95A3A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6E6D68")}
            aria-label="Back to cart"
          >
            <motion.span
              variants={{ hovered: { x: -3 } }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "center" }}
            >
              ←
            </motion.span>
            Back to Cart
          </motion.button>

          {/* ── Page Heading ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 600,
                color: "#3D3929",
                margin: 0,
                letterSpacing: "0.02em",
                lineHeight: 1.2,
              }}
            >
              Delivery Address
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: "var(--font-sans)",
                fontSize: "13.5px",
                color: "#6E6D68",
                fontWeight: 400,
                lineHeight: 1.65,
              }}
            >
              Choose where you want your order delivered.
            </p>
          </motion.div>

          {/* ── Content ──────────────────────────────────── */}
          {!fetched ? (
            <AddressSkeleton />
          ) : addresses.length === 0 ? (
            /* Empty state — show form inline if triggered */
            <AnimatePresence mode="wait">
              {showForm ? (
                <AddressForm
                  key={editingAddress ? `addr-form-${editingAddress._id}` : "addr-form-empty"}
                  initialData={editingAddress}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelForm}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <EmptyAddressState
                  key="addr-empty"
                  onAdd={handleOpenAddForm}
                />
              )}
            </AnimatePresence>
          ) : (
            /* Has addresses */
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Address cards — staggered entrance */}
              {addresses.map((address, index) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  index={index}
                  isSelected={selectedAddress?._id === address._id}
                  onSelect={() => handleSelectAddress(address)}
                  onUpdate={handleEditAddress}
                  onDelete={handleDelete}
                />
              ))}

              {/* ── Add / max message ──────────────────── */}
              {atMax ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "#B4B2A7",
                    textAlign: "center",
                    padding: "14px 0 4px",
                    margin: 0,
                    letterSpacing: "0.03em",
                  }}
                >
                  You can save up to 3 addresses.
                </motion.p>
              ) : (
                <AnimatePresence mode="wait">
                  {!showForm ? (
                    /* "Add new address" dashed button */
                    <motion.button
                      key="add-btn"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.28, delay: addresses.length * 0.08 }}
                      onClick={handleOpenAddForm}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                        width: "100%",
                        background: "none",
                        border: "1.5px dashed #DAD9D4",
                        borderRadius: "var(--radius-lg)",
                        padding: "16px 20px",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#6E6D68",
                        letterSpacing: "0.02em",
                        transition:
                          "border-color 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#A95A3A";
                        e.currentTarget.style.color = "#A95A3A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#DAD9D4";
                        e.currentTarget.style.color = "#6E6D68";
                      }}
                    >
                      <Plus size={15} />
                      Add new address
                    </motion.button>
                  ) : (
                    /* Inline form */
                    <AddressForm
                      key={editingAddress ? `addr-form-${editingAddress._id}` : "addr-form"}
                      initialData={editingAddress}
                      onSubmit={handleSubmit}
                      onCancel={handleCancelForm}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </AnimatePresence>
              )}
            </div>
          )}

          {/* ── Continue to Cart CTA ─────────────────────── */}
          <AnimatePresence>
            {selectedAddress && addresses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: "clamp(24px, 4vw, 36px)",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/cart")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    height: "46px",
                    padding: "0 28px",
                    background: "#A95A3A",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    boxShadow: "var(--shadow-button)",
                    transition: "background 0.2s ease",
                    width: "clamp(0px, 100%, 260px)",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#8B4A2F")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#A95A3A")
                  }
                  aria-label="Continue to cart"
                >
                  Continue to Cart
                  <ArrowRight size={15} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default Address;