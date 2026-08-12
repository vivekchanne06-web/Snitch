import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * DeliveryAddressStrip — compact selected-address display for the Cart page.
 *
 * Reads selectedAddress from Redux (state.address.selectedAddress).
 * Clicking anywhere navigates to /address — no modal, no duplicate form.
 * Hover: terracotta border, arrow shift.
 */
const DeliveryAddressStrip = () => {
  const selectedAddress = useSelector(
    (state) => state.address.selectedAddress
  );
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hovered"
      onClick={() => navigate("/address")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate("/address")}
      aria-label={
        selectedAddress
          ? `Delivering to ${selectedAddress.fullName}. Click to change.`
          : "No address selected. Click to add delivery address."
      }
      style={{
        background: "#FAF9F5",
        border: "1px solid #DAD9D4",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
        cursor: "pointer",
        marginBottom: "28px",
        transition: "border-color 0.22s ease, background 0.22s ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#A95A3A";
        e.currentTarget.style.background = "rgba(169,90,58,0.025)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#DAD9D4";
        e.currentTarget.style.background = "#FAF9F5";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {/* Left: label + address info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 5px",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#B4B2A7",
            }}
          >
            {selectedAddress ? "Delivering to" : "Delivery Address"}
          </p>

          {selectedAddress ? (
            <>
              <p
                style={{
                  margin: "0 0 2px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#3D3929",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedAddress.fullName}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: "12.5px",
                  color: "#6E6D68",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedAddress.addressLine1},{" "}
                {selectedAddress.city}, {selectedAddress.state} —{" "}
                {selectedAddress.postalCode}
              </p>
            </>
          ) : (
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#B4B2A7",
                fontWeight: 400,
              }}
            >
              No address selected
            </p>
          )}
        </div>

        {/* Right: change link + animated arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            flexShrink: 0,
            paddingTop: "3px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#A95A3A",
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
            }}
          >
            {selectedAddress ? "Change address" : "Add delivery address"}
          </span>
          <motion.span
            variants={{ hovered: { x: 4 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              color: "#A95A3A",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryAddressStrip;
