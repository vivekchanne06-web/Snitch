import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * FloatingLabelInput — Premium floating label input component.
 * Design System Token: used across all auth pages & forms.
 *
 * Props:
 *  - label       : string — the floating label text
 *  - id          : string — unique id (also used for htmlFor)
 *  - type        : string — input type (text, email, password, tel)
 *  - error       : string — validation error message
 *  - icon        : ReactNode — optional left icon
 *  - ...rest     : all native input attributes
 */
const FloatingLabelInput = ({
  label,
  id,
  type = "text",
  error,
  icon,
  className = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`relative w-full group ${className}`}>
      {/* Left icon */}
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B4B2A7] group-focus-within:text-[#A95A3A] transition-colors duration-200 z-10 pointer-events-none">
          {icon}
        </span>
      )}

      {/* Input */}
      <input
        id={id}
        name={id}
        type={inputType}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          "peer w-full h-14 rounded-xl border bg-white",
          "text-sm font-medium",
          "transition-all duration-200 outline-none",
          icon ? "pl-11 pr-4" : "px-4",
          isPassword ? "!pr-12" : "",
          "focus:ring-2 focus:ring-[#A95A3A]/25 focus:border-[#A95A3A]",
          error
            ? "border-rose-400 ring-2 ring-rose-400/30 focus:border-rose-400 focus:ring-rose-400/40"
            : "border-[#DAD9D4] hover:border-[#A95A3A]/50",
          "autofill:shadow-[inset_0_0_0px_1000px_white]",
        ].join(" ")}
        {...rest}
      />

      {/* Floating Label */}
      <label
        htmlFor={id}
        className={[
          "absolute pointer-events-none select-none font-medium",
          "transition-all duration-200 ease-out",
          "peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#B4B2A7]",
          "text-xs text-[#A95A3A]",
          icon
            ? "peer-placeholder-shown:left-11 left-4"
            : "peer-placeholder-shown:left-4 left-4",
          // Floating position
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
          "top-2 -translate-y-0",
          // When focused
          "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-[#A95A3A]",
          icon
            ? "peer-focus:left-4"
            : "",
          "bg-white px-1 rounded",
        ].join(" ")}
      >
        {label}
      </label>

      {/* Password Toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B4B2A7] hover:text-[#A95A3A] transition-colors duration-200 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A95A3A]/40 rounded"
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}

      {/* Error message */}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1"
        >
          <span className="inline-block w-1 h-1 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
