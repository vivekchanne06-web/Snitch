import { motion } from "framer-motion";

/**
 * AddressCard — displays a single saved address.
 *
 * Props:
 *  - address      : object — the address data from Redux
 *  - isSelected   : boolean — whether this card is the active selection
 *  - onSelect     : function — called when user clicks card or "Use this address"
 *  - index        : number — for staggered entrance animation
 */
const AddressCard = ({ address, isSelected, onSelect, index }) => {
  const {
    fullName,
    emailId,
    phoneNumber,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    isDefault,
  } = address;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: isSelected ? 0 : -2 }}
      onClick={onSelect}
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${isSelected ? "#A95A3A" : "#DAD9D4"}`,
        borderRadius: "var(--radius-lg)",
        padding: "20px 22px",
        cursor: "pointer",
        transition: "border-color 0.22s ease, box-shadow 0.22s ease",
        boxShadow: isSelected
          ? "0 4px 20px rgba(169, 90, 58, 0.11)"
          : "none",
      }}
    >
      {/* ── Label row ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: isSelected ? "#A95A3A" : "#B4B2A7",
            fontFamily: "var(--font-sans)",
          }}
        >
          {isDefault ? "Default" : "Address"}
        </span>

        {/* Selected checkmark badge */}
        {isSelected && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "19px",
              height: "19px",
              borderRadius: "50%",
              background: "#A95A3A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2.2 2.2L8 3"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        )}
      </div>

      {/* ── Contact info ──────────────────────────────── */}
      <p
        style={{
          margin: "0 0 3px",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          fontWeight: 600,
          color: "#3D3929",
          lineHeight: 1.35,
        }}
      >
        {fullName}
      </p>
      <p
        style={{
          margin: "0 0 1px",
          fontFamily: "var(--font-sans)",
          fontSize: "12.5px",
          color: "#6E6D68",
          fontWeight: 400,
        }}
      >
        {emailId}
      </p>
      <p
        style={{
          margin: "0 0 12px",
          fontFamily: "var(--font-sans)",
          fontSize: "12.5px",
          color: "#6E6D68",
          fontWeight: 400,
        }}
      >
        {phoneNumber}
      </p>

      {/* ── Address lines ─────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid #DAD9D4",
          paddingTop: "11px",
        }}
      >
        <p
          style={{
            margin: "0 0 3px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#3D3929",
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {addressLine1}
          {addressLine2 ? `, ${addressLine2}` : ""}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "#3D3929",
            fontWeight: 400,
          }}
        >
          {city}, {state} — {postalCode}
        </p>
      </div>

      {/* ── "Use this address" CTA (only when not selected) ── */}
      {!isSelected && (
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            marginTop: "14px",
            background: "none",
            border: "1px solid #DAD9D4",
            borderRadius: "var(--radius-sm)",
            padding: "7px 16px",
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6E6D68",
            cursor: "pointer",
            transition: "border-color 0.18s ease, color 0.18s ease",
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
          Use this address
        </motion.button>
      )}
    </motion.div>
  );
};

export default AddressCard;
