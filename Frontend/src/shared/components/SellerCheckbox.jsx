/**
 * SellerCheckbox — Premium animated checkbox for "Register as Seller".
 * Inspired by solaceui/auth-section-3 checkbox pattern.
 * Design System Token: reusable across settings & onboarding pages.
 */
const SellerCheckbox = ({ checked, onChange }) => (
  <label
    htmlFor="isSeller"
    className="flex items-center gap-3.5 cursor-pointer group select-none"
  >
    {/* Custom checkbox box */}
    <span className="relative flex-shrink-0">
      <input
        id="isSeller"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        aria-label="Register as a seller"
      />
      {/* Checkbox visual */}
      <span
        className={[
          "flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200",
          "group-hover:border-[#A95A3A]/60",
          checked
            ? "bg-[#A95A3A] border-[#A95A3A] shadow-[0_2px_8px_rgba(169,90,58,0.35)]"
            : "bg-white border-[#DAD9D4]",
        ].join(" ")}
        aria-hidden="true"
      >
        {/* Checkmark SVG */}
        <svg
          viewBox="0 0 12 12"
          className={`w-3 h-3 text-white transition-all duration-200 ${checked ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          fill="none"
        >
          <path
            d="M2.5 6 5 8.5 9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>

    {/* Label text */}
    <span className="text-sm text-[#6E6D68] group-hover:text-[#3D3929] transition-colors duration-150 leading-snug">
      I want to register as a{" "}
      <span className={`font-semibold transition-colors duration-200 ${checked ? "text-[#A95A3A]" : "text-[#3D3929]"}`}>
        Seller
      </span>
    </span>

    {/* Seller badge */}
    {checked && (
      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#E9E6DC] text-[#A95A3A] border border-[#A95A3A]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A95A3A]" />
        Active
      </span>
    )}
  </label>
);

export default SellerCheckbox;
