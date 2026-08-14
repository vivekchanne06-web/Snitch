import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  X,
  MapPin,
  Check,
  Plus,
  Truck,
  CreditCard,
  LockKeyhole,
  Loader2,
  ChevronLeft,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useAddress } from "../../address/hook/useAddress";
import { useOrder } from "../hook/useOrder";
import { useToast } from "../../../shared/components/Toast";
import { loadRazorpayScript } from "../../../shared/utils/razorpay";

/* ── Helper for price formatting ────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return "";
  const amount = typeof price === "number" ? price : price.amount;
  const currency = typeof price === "object" ? price.currency : "INR";
  const sym = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency + " ";
  return sym + Number(amount).toLocaleString("en-IN");
};

/**
 * DirectCheckoutModal — Buy Now Flow (Zero Cart Interference)
 */
const DirectCheckoutModal = ({
  isOpen,
  onClose,
  product,
  selectedVariant,
  quantity = 1,
}) => {
  const navigate = useNavigate();
  const dispatch = useAddress();
  const { handleGetUserAddress, handleSelectAddress } = useAddress();
  const {
    handleCreateBuyNowCODOrder,
    handleCreateBuyNowRazorpayOrder,
    handleVerifyBuyNowRazorpayPayment,
  } = useOrder();
  const { showToast } = useToast();

  const user = useSelector((state) => state.auth.user);
  const addresses = useSelector((state) => state.address.addresses || []);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const [step, setStep] = useState(1); // 1 = Address, 2 = Payment
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  /* Lock body scroll when modal is open & reset step on open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep(1);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Fetch user addresses when modal opens */
  useEffect(() => {
    if (!isOpen) return;
    const fetchAddr = async () => {
      setLoadingAddresses(true);
      await handleGetUserAddress();
      setLoadingAddresses(false);
    };
    fetchAddr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* Automatically select first address if none selected */
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      handleSelectAddress(addresses[0]);
    }
  }, [addresses, selectedAddress, handleSelectAddress]);

  if (!isOpen || !product || !selectedVariant) return null;

  /* Derive unit price & variant image */
  const unitPrice = selectedVariant?.price?.amount || product?.price?.amount || 0;
  const currency = selectedVariant?.price?.currency || product?.price?.currency || "INR";
  const totalPrice = unitPrice * quantity;
  const images = selectedVariant.images?.length > 0 ? selectedVariant.images : product.images || [];
  const thumbnail = images[0]?.url || images[0] || null;

  /* ── Step 1: Address Handlers ─────────────────────────────────────────── */
  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      showToast({
        title: "No Address Selected",
        message: "Please select a delivery address to proceed.",
        type: "error",
        duration: 3500,
      });
      return;
    }
    setStep(2);
  };

  /* ── Step 2: Payment Handlers ─────────────────────────────────────────── */
  /* COD */
  const handleCOD = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      await handleCreateBuyNowCODOrder({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
        addressId: selectedAddress._id,
      });

      onClose();
      showToast({
        title: "Order Placed!",
        message: "Your Buy Now Cash on Delivery order was placed successfully.",
        type: "success",
        duration: 3500,
      });
      navigate("/orders");
    } catch (error) {
      showToast({
        title: "Order Failed",
        message: error.response?.data?.message || "Failed to place order. Please try again.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  /* Razorpay */
  const handleRazorpay = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);

    /* 1. Load Razorpay script (singleton utility) */
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      showToast({
        title: "Payment Unavailable",
        message: "Could not load Razorpay service. Please check your connection.",
        type: "error",
        duration: 4000,
      });
      setCheckoutLoading(false);
      return;
    }

    /* 2. Create Razorpay order on backend */
    let data;
    try {
      data = await handleCreateBuyNowRazorpayOrder({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
        addressId: selectedAddress._id,
      });
    } catch (error) {
      showToast({
        title: "Payment Failed",
        message: error.response?.data?.message || "Failed to create payment order.",
        type: "error",
        duration: 4000,
      });
      setCheckoutLoading(false);
      return;
    }

    /* 3. Close direct checkout modal so Razorpay overlay opens cleanly */
    onClose();

    /* 4. Open Razorpay Popup */
    const options = {
      key: data.keyId,
      amount: data.razorpayOrder.amount,
      currency: data.razorpayOrder.currency,
      name: "Snitch",
      description: `Buy Now — ${product.title}`,
      order_id: data.razorpayOrder.id,
      handler: async (response) => {
        try {
          await handleVerifyBuyNowRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          showToast({
            title: "Payment Successful!",
            message: "Your Buy Now order has been placed successfully.",
            type: "success",
            duration: 3500,
          });
          navigate("/orders");
        } catch (error) {
          showToast({
            title: "Verification Failed",
            message: error.response?.data?.message || "Payment verification failed.",
            type: "error",
            duration: 5000,
          });
        } finally {
          setCheckoutLoading(false);
        }
      },
      prefill: {
        name: user?.fullName || user?.name || "",
        email: user?.email || "",
        contact: user?.mobileNumber || user?.phoneNumber || "",
      },
      theme: {
        color: "#A95A3A",
      },
      modal: {
        ondismiss: () => {
          setCheckoutLoading(false);
          showToast({
            title: "Payment Cancelled",
            message: "You cancelled the payment process.",
            type: "info",
            duration: 3000,
          });
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="direct-checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !checkoutLoading && onClose()}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(61, 57, 41, 0.48)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 1000,
            }}
          />

          {/* Modal Container */}
          <motion.div
            key="direct-checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Direct Checkout"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              width: "min(480px, calc(100vw - 24px))",
              maxHeight: "calc(100dvh - 32px)",
              background: "#FAF9F5",
              border: "1px solid #DAD9D4",
              borderRadius: "20px",
              boxShadow: "0 24px 60px -8px rgba(61,57,41,0.22)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "clamp(12px, 3.5vw, 18px) clamp(14px, 4vw, 24px)",
                borderBottom: "1px solid #DAD9D4",
                background: "#FFFFFF",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    disabled={checkoutLoading}
                    aria-label="Back to address selection"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: checkoutLoading ? "not-allowed" : "pointer",
                      color: "#6E6D68",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#A95A3A",
                    }}
                  >
                    Direct Checkout — Step {step} of 2
                  </p>
                  <h2
                    style={{
                      margin: "2px 0 0",
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: "19px",
                      fontWeight: 600,
                      color: "#3D3929",
                    }}
                  >
                    {step === 1 ? "Delivery Address" : "Payment Method"}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => !checkoutLoading && onClose()}
                disabled={checkoutLoading}
                aria-label="Close modal"
                style={{
                  background: "none",
                  border: "none",
                  cursor: checkoutLoading ? "not-allowed" : "pointer",
                  color: "#B4B2A7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  borderRadius: "50%",
                  opacity: checkoutLoading ? 0.4 : 1,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Summary Mini Strip */}
            <div
              style={{
                padding: "10px clamp(14px, 4vw, 24px)",
                background: "#F5F4EF",
                borderBottom: "1px solid #DAD9D4",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  aspectRatio: "3/4",
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "#E9E6DC",
                  flexShrink: 0,
                }}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={product.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                    <ShoppingBag size={14} color="#B4B2A7" />
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#3D3929",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.title}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "11px",
                    color: "#6E6D68",
                  }}
                >
                  Qty: {quantity}
                  {selectedVariant?.attributes &&
                    Object.entries(selectedVariant.attributes).map(
                      ([k, v]) => ` • ${k}: ${v}`
                    )}
                </p>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#A95A3A",
                  }}
                >
                  {formatPrice({ amount: totalPrice, currency })}
                </p>
              </div>
            </div>

            {/* Scrollable Step Content */}
            <div
              style={{
                padding: "clamp(14px, 4vw, 20px) clamp(14px, 4vw, 24px)",
                overflowY: "auto",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {step === 1 ? (
                /* ── STEP 1: Address Selection ──────────────────────────────── */
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#6E6D68",
                      }}
                    >
                      Select Saved Address
                    </span>

                    <button
                      onClick={() => navigate("/address")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#A95A3A",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Plus size={13} /> Add / Manage Address
                    </button>
                  </div>

                  {loadingAddresses ? (
                    <div style={{ padding: "24px 0", textAlign: "center" }}>
                      <Loader2
                        size={22}
                        color="#A95A3A"
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        background: "#FFFFFF",
                        border: "1px dashed #DAD9D4",
                        borderRadius: "12px",
                      }}
                    >
                      <MapPin size={28} color="#B4B2A7" style={{ marginBottom: "8px" }} />
                      <p
                        style={{
                          margin: "0 0 12px",
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: "13px",
                          color: "#6E6D68",
                        }}
                      >
                        No saved address found. Please add a shipping address.
                      </p>
                      <button
                        onClick={() => navigate("/address")}
                        style={{
                          padding: "8px 20px",
                          background: "#A95A3A",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "99px",
                          fontFamily: '"Outfit", sans-serif',
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {addresses.map((addr) => {
                        const isSelected = selectedAddress?._id === addr._id;
                        return (
                          <div
                            key={addr._id}
                            onClick={() => handleSelectAddress(addr)}
                            style={{
                              padding: "14px 16px",
                              borderRadius: "12px",
                              border: isSelected
                                ? "1.5px solid #A95A3A"
                                : "1.5px solid #DAD9D4",
                              background: isSelected
                                ? "rgba(169,90,58,0.04)"
                                : "#FFFFFF",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                border: isSelected
                                  ? "5px solid #A95A3A"
                                  : "1.5px solid #B4B2A7",
                                marginTop: "2px",
                                flexShrink: 0,
                                transition: "all 0.2s ease",
                              }}
                            />

                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  margin: 0,
                                  fontFamily: '"Outfit", sans-serif',
                                  fontSize: "13.5px",
                                  fontWeight: 700,
                                  color: "#3D3929",
                                }}
                              >
                                {addr.fullName}{" "}
                                <span
                                  style={{
                                    fontWeight: 400,
                                    fontSize: "12px",
                                    color: "#6E6D68",
                                  }}
                                >
                                  ({addr.phoneNumber})
                                </span>
                              </p>
                              <p
                                style={{
                                  margin: "3px 0 0",
                                  fontFamily: '"Outfit", sans-serif',
                                  fontSize: "12px",
                                  color: "#6E6D68",
                                  lineHeight: 1.45,
                                }}
                              >
                                {addr.addressLine1},{" "}
                                {addr.addressLine2 ? `${addr.addressLine2}, ` : ""}
                                {addr.city}, {addr.state} — {addr.postalCode}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <motion.button
                    whileHover={selectedAddress ? { scale: 1.01 } : {}}
                    whileTap={selectedAddress ? { scale: 0.985 } : {}}
                    onClick={handleProceedToPayment}
                    disabled={!selectedAddress}
                    style={{
                      width: "100%",
                      height: "48px",
                      background: "#A95A3A",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "10px",
                      cursor: selectedAddress ? "pointer" : "not-allowed",
                      opacity: selectedAddress ? 1 : 0.5,
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: selectedAddress
                        ? "0 4px 16px rgba(169,90,58,0.28)"
                        : "none",
                      marginTop: "auto",
                    }}
                  >
                    Continue to Payment
                    <ArrowRight size={15} />
                  </motion.button>
                </>
              ) : (
                /* ── STEP 2: Payment Selection ──────────────────────────────── */
                <>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#6E6D68",
                    }}
                  >
                    Choose Payment Option
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {/* COD Option */}
                    <motion.button
                      whileHover={!checkoutLoading ? { scale: 1.01 } : {}}
                      whileTap={!checkoutLoading ? { scale: 0.985 } : {}}
                      onClick={handleCOD}
                      disabled={checkoutLoading}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(10px, 3vw, 16px)",
                        padding: "clamp(12px, 3.5vw, 16px) clamp(12px, 3.5vw, 18px)",
                        background: "#FFFFFF",
                        border: "1.5px solid #DAD9D4",
                        borderRadius: "12px",
                        cursor: checkoutLoading ? "not-allowed" : "pointer",
                        opacity: checkoutLoading ? 0.65 : 1,
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          background: "#FAF9F5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Truck size={22} color="#3D3929" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#3D3929",
                          }}
                        >
                          Cash on Delivery
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: "12px",
                            color: "#6E6D68",
                          }}
                        >
                          Pay when your order arrives
                        </p>
                      </div>
                    </motion.button>

                    {/* Razorpay Online Option */}
                    <motion.button
                      whileHover={!checkoutLoading ? { scale: 1.01 } : {}}
                      whileTap={!checkoutLoading ? { scale: 0.985 } : {}}
                      onClick={handleRazorpay}
                      disabled={checkoutLoading}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(10px, 3vw, 16px)",
                        padding: "clamp(12px, 3.5vw, 16px) clamp(12px, 3.5vw, 18px)",
                        background: "#A95A3A",
                        border: "1.5px solid #A95A3A",
                        borderRadius: "12px",
                        cursor: checkoutLoading ? "not-allowed" : "pointer",
                        opacity: checkoutLoading ? 0.65 : 1,
                        textAlign: "left",
                        boxShadow: "0 4px 16px rgba(169,90,58,0.25)",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.18)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {checkoutLoading ? (
                          <Loader2
                            size={20}
                            color="#FFFFFF"
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                        ) : (
                          <CreditCard size={22} color="#FFFFFF" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                          }}
                        >
                          Pay Online
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          Cards, UPI, Net Banking & more
                        </p>
                      </div>
                    </motion.button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      marginTop: "auto",
                      paddingTop: "12px",
                    }}
                  >
                    <LockKeyhole size={12} color="#B4B2A7" />
                    <span
                      style={{
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: "11px",
                        color: "#B4B2A7",
                        fontWeight: 500,
                      }}
                    >
                      100% Encrypted &amp; Secure Direct Checkout
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DirectCheckoutModal;
