import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowRight,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useOrder } from "../hook/useOrder";
import { useToast } from "../../../shared/components/Toast";

/* ── Currency helper (same as Cart.jsx) ───────────────────── */
const formatPrice = (amount, currency = "INR") => {
  const sym =
    currency === "INR" ? "₹" : currency === "USD" ? "$" : currency + " ";
  return sym + Number(amount).toLocaleString("en-IN");
};

/* ── Date helper ──────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ── Scoped CSS ───────────────────────────────────────────── */
const ORDER_CSS = `
  .orders-shell {
    min-height: 100vh;
    background: var(--color-background);
  }

  .orders-layout {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 clamp(14px, 4vw, 48px);
    padding-top: 104px;
    padding-bottom: 80px;
  }

  .order-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .order-card:hover {
    box-shadow: var(--shadow-card);
    border-color: var(--color-input);
  }

  .order-item-row {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 14px;
    align-items: start;
    padding: 14px 0;
    border-bottom: 1px solid var(--color-border);
  }

  .order-item-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 99px;
    font-family: var(--font-sans);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .badge-cod {
    background: rgba(61,57,41,0.06);
    color: var(--color-muted);
  }

  .badge-razorpay {
    background: rgba(169,90,58,0.09);
    color: var(--color-primary);
  }

  @keyframes shimmer-op {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

/* ══════════════════════════════════════════════════════════════
   SKELETON
   ══════════════════════════════════════════════════════════════ */
const OrderSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="order-card"
        style={{ opacity: 0.65 - i * 0.12, pointerEvents: "none", padding: "24px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              height: "14px",
              width: "45%",
              borderRadius: "6px",
              background:
                "linear-gradient(90deg, #F5F4EF 0%, #E9E6DC 50%, #F5F4EF 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer-op 1.6s infinite",
            }}
          />
          <div
            style={{
              height: "12px",
              width: "30%",
              borderRadius: "6px",
              background: "#E9E6DC",
            }}
          />
          <div style={{ height: "72px", borderRadius: "8px", background: "#E9E6DC" }} />
        </div>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   EMPTY STATE
   ══════════════════════════════════════════════════════════════ */
const EmptyOrders = ({ onExplore }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 24px",
      textAlign: "center",
      gap: "20px",
    }}
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "88px",
        height: "88px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #F5F4EF 0%, #E9E6DC 100%)",
        border: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Package size={36} color="var(--color-input)" />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          fontWeight: 600,
          color: "var(--color-foreground)",
          letterSpacing: "0.02em",
        }}
      >
        No Orders Yet
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "var(--color-muted)",
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          maxWidth: "320px",
          lineHeight: 1.65,
        }}
      >
        You haven&apos;t placed any orders yet. Explore our collection and find
        something you love.
      </p>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onExplore}
      style={{
        height: "48px",
        padding: "0 36px",
        background: "var(--color-primary)",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "var(--shadow-button)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-primary-dark)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "var(--color-primary)")
      }
    >
      Explore Collection
      <ArrowRight size={15} />
    </motion.button>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   ORDER ITEM ROW
   ══════════════════════════════════════════════════════════════ */
const OrderItem = ({ item }) => {
  const image = item.images?.[0]?.url || null;
  return (
    <div className="order-item-row">
      {/* Thumbnail */}
      <div
        style={{
          width: "64px",
          aspectRatio: "3/4",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          background: "linear-gradient(135deg, #F5F4EF 0%, #E9E6DC 100%)",
          flexShrink: 0,
        }}
      >
        {image ? (
          <img
            src={image}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBag size={18} color="var(--color-input)" />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "13.5px",
            fontWeight: 600,
            color: "var(--color-foreground)",
            lineHeight: 1.35,
          }}
        >
          {item.title}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            color: "var(--color-muted)",
            fontWeight: 400,
          }}
        >
          Qty: {item.quantity}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--color-primary)",
          }}
        >
          {formatPrice(item.price?.amount, item.price?.currency)}
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ORDER CARD
   ══════════════════════════════════════════════════════════════ */
const OrderCard = ({ order, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.35, delay: index * 0.07 },
        y: { duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] },
      }}
      className="order-card"
    >
      {/* ── Card Header ─────────────────────────────────────── */}
      <div style={{ padding: "clamp(14px, 4vw, 20px) clamp(16px, 4vw, 24px)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Left: order meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-input)",
              }}
            >
              Order
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--color-muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              #{order._id?.slice(-8).toUpperCase()}
            </p>

            <div
              style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}
            >
              {/* Payment method badge */}
              <span
                className={`badge ${
                  order.paymentMethod === "razorpay" ? "badge-razorpay" : "badge-cod"
                }`}
              >
                {order.paymentMethod === "razorpay" ? (
                  <CreditCard size={9} />
                ) : (
                  <Truck size={9} />
                )}
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
          </div>

          {/* Right: total + date */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "18px",
                fontWeight: 800,
                color: "var(--color-foreground)",
                letterSpacing: "-0.01em",
              }}
            >
              {formatPrice(order.total?.amount, order.total?.currency)}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: "var(--color-muted)",
                fontWeight: 400,
              }}
            >
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Item preview (first 2 titles) */}
        <p
          style={{
            margin: "12px 0 0",
            fontFamily: "var(--font-sans)",
            fontSize: "12.5px",
            color: "var(--color-muted)",
            fontWeight: 400,
            lineHeight: 1.55,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {order.orderItems
            ?.slice(0, 2)
            .map((i) => i.title)
            .join(", ")}
          {order.orderItems?.length > 2 &&
            ` +${order.orderItems.length - 2} more`}
        </p>
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div
        style={{ height: "1px", background: "var(--color-border)", margin: "0 clamp(16px, 4vw, 24px)" }}
      />

      {/* ── Delivery & Address (always visible) ──────────────── */}
      <div
        style={{
          padding: "12px clamp(16px, 4vw, 24px)",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Estimated delivery */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: "160px" }}
        >
          <Calendar size={13} color="var(--color-input)" />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "var(--color-muted)",
              fontWeight: 400,
            }}
          >
            Est. delivery:{" "}
            <strong style={{ color: "var(--color-foreground)", fontWeight: 600 }}>
              {formatDate(order.estimatedDeliveryDate)}
            </strong>
          </span>
        </div>

        {/* Shipping address */}
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: "6px", flex: 2, minWidth: "200px" }}
        >
          <MapPin size={13} color="var(--color-input)" style={{ marginTop: "2px", flexShrink: 0 }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "var(--color-muted)",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            {order.shippingAddress?.fullName},{" "}
            {order.shippingAddress?.addressLine1},{" "}
            {order.shippingAddress?.city}, {order.shippingAddress?.state} —{" "}
            {order.shippingAddress?.postalCode}
          </span>
        </div>
      </div>

      {/* ── Toggle items ─────────────────────────────────────── */}
      <div style={{ padding: "0 clamp(16px, 4vw, 24px) clamp(14px, 4vw, 20px)" }}>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--color-primary)",
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "opacity 0.18s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {expanded ? "Hide Items" : `View Items (${order.orderItems?.length})`}
          <ArrowRight
            size={12}
            style={{
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.22s ease",
            }}
          />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              key="items"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden", marginTop: "12px" }}
            >
              {order.orderItems?.map((item, i) => (
                <OrderItem key={i} item={item} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ORDER PAGE — Main Component
   ══════════════════════════════════════════════════════════════ */
const OrderPage = () => {
  const { handleGetMyOrders } = useOrder();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await handleGetMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders. Please try again.");
      showToast({
        title: "Error",
        message: err.response?.data?.message || "Failed to load your orders.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [handleGetMyOrders, showToast]);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExplore = useCallback(() => navigate("/home"), [navigate]);

  return (
    <>
      <style>{ORDER_CSS}</style>

      <div className="orders-shell">
        <main className="orders-layout">
          {/* ── Page Header ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
                fontWeight: 600,
                color: "var(--color-foreground)",
                margin: 0,
                letterSpacing: "0.02em",
                lineHeight: 1.2,
              }}
            >
              My Orders
            </h1>
            {!loading && orders.length > 0 && (
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "13.5px",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              </p>
            )}
          </motion.div>

          {/* ── Content ──────────────────────────────────────── */}
          {loading ? (
            <OrderSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "60px 24px",
                textAlign: "center",
              }}
            >
              <AlertTriangle size={40} color="var(--color-input)" />
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--color-muted)",
                  maxWidth: "320px",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </p>
              <button
                onClick={loadOrders}
                style={{
                  padding: "10px 24px",
                  background: "var(--color-primary)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Retry
              </button>
            </motion.div>
          ) : orders.length === 0 ? (
            <EmptyOrders onExplore={handleExplore} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {orders.map((order, index) => (
                <OrderCard key={order._id} order={order} index={index} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default OrderPage;