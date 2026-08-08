import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import { useCart } from "../hook/useCart";

/* ══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS — exact Snitch palette
   ══════════════════════════════════════════════════════════════════════ */
const C = {
  bg: "var(--color-background)",
  card: "var(--color-card)",
  white: "var(--color-surface)",
  primary: "var(--color-primary)",
  primaryDk: "var(--color-primary-dark)",
  text: "var(--color-foreground)",
  muted: "var(--color-muted)",
  border: "var(--color-border)",
  input: "var(--color-input)",
  secondary: "var(--color-secondary)",
};

/* ── Injected keyframes / scoped CSS ───────────────────────────────── */
const CART_CSS = `
  .cart-shell {
    min-height: 100vh;
    background: var(--color-background);
  }

  .cart-layout {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 64px);
    padding-top: 104px;
    padding-bottom: 80px;
  }

  .cart-grid {
    display: grid;
    grid-template-columns: minmax(0, 65fr) minmax(0, 35fr);
    gap: clamp(24px, 4vw, 56px);
    align-items: start;
  }

  .cart-summary-sticky {
    position: sticky;
    top: 88px;
  }

  @media (max-width: 1024px) {
    .cart-grid {
      grid-template-columns: 1fr;
    }
    .cart-summary-sticky {
      position: static;
    }
  }

  .cart-item-row {
    display: grid;
    grid-template-columns: 108px 1fr;
    gap: 20px;
    align-items: start;
    padding: 24px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    transition: box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .cart-item-row:hover {
    box-shadow: var(--shadow-card);
    border-color: var(--color-input);
  }

  @media (max-width: 540px) {
    .cart-item-row {
      grid-template-columns: 88px 1fr;
      gap: 14px;
      padding: 16px;
    }
  }

  .qty-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;
    flex-shrink: 0;
  }

  .qty-btn:hover:not(:disabled) {
    border-color: var(--color-primary);
    background: rgba(169,90,58,0.06);
    color: var(--color-primary);
  }

  .qty-btn:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  .remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-input);
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0;
    transition: color 0.18s ease;
  }

  .remove-btn:hover {
    color: #C0392B;
  }

  .checkout-btn {
    width: 100%;
    height: 52px;
    background: var(--color-primary);
    color: #FFFFFF;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.22s ease, box-shadow 0.22s ease, transform 0.15s ease;
    box-shadow: var(--shadow-button);
  }

  .checkout-btn:hover {
    background: var(--color-primary-dark);
    box-shadow: 0 6px 28px rgba(169,90,58,0.35);
  }

  .checkout-btn:active {
    transform: scale(0.985);
  }

  .continue-btn {
    background: none;
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0 24px;
    height: 44px;
    transition: border-color 0.18s ease, color 0.18s ease;
  }

  .continue-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .divider-line {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 0;
  }
`;

/* ── Currency helper ─────────────────────────────────────────────── */
const formatPrice = (amount, currency = "INR") => {
  const sym =
    currency === "INR" ? "₹" : currency === "USD" ? "$" : currency + " ";
  return sym + Number(amount).toLocaleString("en-IN");
};



/* ══════════════════════════════════════════════════════════════════════
   QUANTITY CONTROL
   ══════════════════════════════════════════════════════════════════════ */
const QuantityControl = ({ value, onDecrease, onIncrease, maxStock }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
        background: "var(--color-surface)",
      }}
    >
      <button
        className="qty-btn"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        disabled={value <= 1}
        style={{ border: "none", borderRadius: 0 }}
      >
        <Minus size={13} />
      </button>

      <motion.span
        key={value}
        initial={{ opacity: 0.4, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          minWidth: "36px",
          textAlign: "center",
          fontSize: "13.5px",
          fontWeight: 600,
          color: "var(--color-foreground)",
          fontFamily: "var(--font-sans)",
          userSelect: "none",
        }}
      >
        {value}
      </motion.span>

      <button
        className="qty-btn"
        aria-label="Increase quantity"
        onClick={onIncrease}
        disabled={maxStock !== undefined && value >= maxStock}
        style={{ border: "none", borderRadius: 0 }}
      >
        <Plus size={13} />
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   CART ITEM ROW
   ══════════════════════════════════════════════════════════════════════ */
const CartItemRow = ({
  item,
  index,
  onRemove,
  onIncrement,
  onDecrement }) => {
  const { product, quantity, price } = item;

  /* Resolve the selected variant */
  const selectedVariant = product?.variants?.find(
    (v) => v._id.toString() === item.variant.toString()
  );

  /* Variant images take priority over product images */
  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product?.images || [];
  const primaryImage = images[0]?.url || null;

  /* Price: variant price > item price > product price */
  const priceObj =
    selectedVariant?.price || price || product?.price || { amount: 0, currency: "INR" };
  const itemTotal = priceObj.amount * quantity;

  /* Attributes */
  const attrs = selectedVariant?.attributes || {};
  const attrEntries = Object.entries(attrs);

  /* Stock */
  const maxStock = selectedVariant?.stock;

  const handleDecrease = useCallback(() => {
    if (quantity > 1) {
      onDecrement(item.product._id, item.variant);
    }
  }, [quantity, item.product._id, item.variant, onDecrement]);

  const handleIncrease = useCallback(() => {
    onIncrement(item.product._id, item.variant);
}, [item.product._id, item.variant, onIncrement]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, scale: 0.96 }}
      transition={{
        layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3, delay: index * 0.07 },
        y: { duration: 0.35, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <div className="cart-item-row">
        {/* Product Image */}
        <div
          style={{
            width: "100%",
            aspectRatio: "3/4",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            background: "linear-gradient(135deg, #F5F4EF 0%, #E9E6DC 100%)",
            flexShrink: 0,
          }}
        >
          {primaryImage ? (
            <motion.img
              src={primaryImage}
              alt={product?.title || "Product"}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
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
              <ShoppingBag size={24} color="var(--color-input)" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
          {/* Title */}
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "14.5px",
              fontWeight: 600,
              color: "var(--color-foreground)",
              lineHeight: 1.35,
              letterSpacing: "0.01em",
            }}
          >
            {product?.title || "Unnamed Product"}
          </p>

          {/* Variant attributes */}
          {attrEntries.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {attrEntries.map(([key, val]) => (
                <span
                  key={key}
                  style={{
                    fontSize: "12px",
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                  }}
                >
                  {key}:{" "}
                  <span
                    style={{
                      color: "var(--color-foreground)",
                      fontWeight: 600,
                    }}
                  >
                    {val}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <p
            style={{
              margin: "4px 0 0",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--color-primary)",
              letterSpacing: "0.02em",
            }}
          >
            {formatPrice(priceObj.amount, priceObj.currency)}
          </p>

          {/* Bottom row: qty + remove */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "6px",
            }}
          >
            <QuantityControl
              value={quantity}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              maxStock={maxStock}
            />

            <button
              className="remove-btn"
              onClick={() => onRemove(item._id)}
              aria-label={`Remove ${product?.title} from cart`}
            >
              <Trash2 size={12} />
              Remove
            </button>
          </div>

          {/* Item subtotal on mobile */}
          {quantity > 1 && (
            <p
              style={{
                margin: 0,
                fontSize: "11.5px",
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              Subtotal: {formatPrice(itemTotal, priceObj.currency)}
            </p>
          )}

          {/* Low stock warning */}
          {maxStock !== undefined && maxStock > 0 && maxStock <= 5 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#B45309",
                background: "rgba(180,83,9,0.08)",
                padding: "3px 8px",
                borderRadius: "99px",
                letterSpacing: "0.04em",
                display: "inline-block",
                alignSelf: "flex-start",
              }}
            >
              Only {maxStock} left
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   ORDER SUMMARY
   ══════════════════════════════════════════════════════════════════════ */
const OrderSummary = ({ items, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => {
    const variant = item.product?.variants?.find((v) => v._id === item.variant);
    const price = variant?.price || item.price || item.product?.price || { amount: 0 };
    return acc + price.amount * item.quantity;
  }, 0);

  const currency = items[0]?.price?.currency || "INR";
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="cart-summary-sticky"
    >
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-input)",
            }}
          >
            Order Summary
          </p>
        </div>

        {/* Line items */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              Subtotal{" "}
              <span style={{ color: "var(--color-input)", fontWeight: 400 }}>
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--color-foreground)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {formatPrice(subtotal, currency)}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-muted)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Truck size={13} />
              Delivery
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#2E7D32",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.03em",
              }}
            >
              Free
            </span>
          </div>

          <hr className="divider-line" style={{ margin: "4px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                color: "var(--color-foreground)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Total
            </span>
            <motion.span
              key={subtotal}
              initial={{ opacity: 0.5, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "var(--color-foreground)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "-0.01em",
              }}
            >
              {formatPrice(subtotal, currency)}
            </motion.span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <motion.button
            className="checkout-btn"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.985 }}
            onClick={onCheckout}
          >
            Proceed to Checkout
            <ArrowRight size={16} />
          </motion.button>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginTop: "6px",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10.5px",
                color: "var(--color-input)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              <ShieldCheck size={12} />
              Secure
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10.5px",
                color: "var(--color-input)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              <LockKeyhole size={12} />
              Encrypted
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10.5px",
                color: "var(--color-input)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              <Truck size={12} />
              Free shipping
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   EMPTY CART STATE
   ══════════════════════════════════════════════════════════════════════ */
const EmptyCart = ({ onExplore }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
      textAlign: "center",
      gap: "20px",
    }}
  >
    {/* Icon circle */}
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
      <ShoppingBag size={36} color="var(--color-input)" />
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
        Your Bag is Empty
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
        There are no pieces in your bag yet. Explore our collection and find something you love.
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
        transition: "background 0.22s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-dark)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-primary)")}
    >
      Explore Collection
      <ArrowRight size={15} />
    </motion.button>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════════
   LOADING SKELETON
   ══════════════════════════════════════════════════════════════════════ */
const CartSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="cart-item-row"
        style={{ opacity: 0.6 - i * 0.12, pointerEvents: "none" }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "3/4",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(90deg, #F5F4EF 0%, #E9E6DC 50%, #F5F4EF 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s infinite",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ height: "16px", width: "65%", borderRadius: "6px", background: "#E9E6DC" }} />
          <div style={{ height: "12px", width: "40%", borderRadius: "6px", background: "#E9E6DC" }} />
          <div style={{ height: "18px", width: "30%", borderRadius: "6px", background: "#E9E6DC" }} />
          <div style={{ height: "32px", width: "50%", borderRadius: "6px", background: "#E9E6DC" }} />
        </div>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   CART PAGE — Main Component
   ══════════════════════════════════════════════════════════════════════ */
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { handleGetCart, handleIncrement, handleDecrement, handleRemoveFromCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await handleGetCart();
      setLoading(false);
    };
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = useCallback(() => {
    // Checkout route to be implemented — navigate or trigger checkout flow
    console.log("Proceed to checkout");
  }, []);

  const handleExplore = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <>
      {/* Inject scoped CSS */}
      <style>{CART_CSS}</style>
      {/* Shimmer keyframes reused from existing pages */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div className="cart-shell">
        <main className="cart-layout">
          {/* ── Page Header ───────────────────────────────────────── */}
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
              Shopping Bag
            </h1>
            {!loading && cartItems.length > 0 && (
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
                Review your selected pieces before checkout.
              </p>
            )}
          </motion.div>

          {/* ── Main Content ──────────────────────────────────────── */}
          {loading ? (
            <CartSkeleton />
          ) : cartItems.length === 0 ? (
            <EmptyCart onExplore={handleExplore} />
          ) : (
            <div className="cart-grid">
              {/* LEFT: Cart Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Item count header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--color-input)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  </span>

                  <button
                    className="continue-btn"
                    onClick={handleExplore}
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Cart Items */}
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <CartItemRow
                      key={item._id}
                      item={item}
                      index={index}
                      onRemove={handleRemoveFromCart}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                    />
                  ))}
                </AnimatePresence>

                {/* Shipping info banner */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 18px",
                    background: "rgba(46,125,50,0.06)",
                    border: "1px solid rgba(46,125,50,0.15)",
                    borderRadius: "var(--radius-md)",
                    marginTop: "4px",
                  }}
                >
                  <Truck size={16} color="#2E7D32" />
                  <span
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#2E7D32",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    You qualify for free delivery on this order.
                  </span>
                </motion.div>
              </div>

              {/* RIGHT: Order Summary */}
              <OrderSummary
                items={cartItems}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Cart;