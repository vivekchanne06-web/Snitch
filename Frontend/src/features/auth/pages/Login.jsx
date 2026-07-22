import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

import FloatingLabelInput from "../../../components/ui/FloatingLabelInput";
import GoogleIcon from "../../../components/ui/GoogleIcon";
import LoginBrandingPanel from "../components/LoginBrandingPanel";
import { useAuth } from "../hook/useAuth";

/* ─── Validation helpers ────────────────────────────────────────────────── */
const validators = {
  email: (v) =>
    !v.trim()
      ? "Email address is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? "Enter a valid email address"
        : "",

  password: (v) =>
    !v ? "Password is required" : "",
};

/* ─── Animation variants ────────────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
};

const formVariants = {
  initial: { opacity: 0, x: 40, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

const fieldVariants = {
  initial: { opacity: 0, y: 16 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.25 + i * 0.07, ease: "easeOut" },
  }),
};

const successVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

/* ─── Login Page ─────────────────────────────────────────────────────── */
const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  /* Handle input change */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));

    // Clear server error whenever the user edits any field
    if (serverError) setServerError("");

    // Live validation after touched
    if (touched[name] && validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](newValue) }));
    }
  };

  /* Mark field as touched on blur */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  /* Validate all before submit */
  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach((key) => {
      const err = validators[key](form[key] ?? "");
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Clear previous server error on re-submit
    if (!validateAll()) return;

    try {
      await handleLogin({ email: form.email, password: form.password });
      setIsSuccess(true);
      setServerError("");
      setTimeout(() => navigate("/"), 2200);
    } catch (error) {
      setServerError(
        error?.message || "Something went wrong. Please try again."
      );
    }
  };

  /* ─── Success overlay ─────────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-[#FAF9F5]"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={successVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center gap-5 px-10 py-12 rounded-2xl bg-[#F5F4EF] border border-[#DAD9D4] shadow-[0_2px_24px_rgba(61,57,41,0.10)]"
        >
          <div className="w-20 h-20 rounded-full bg-[#A95A3A] flex items-center justify-center shadow-lg shadow-[#A95A3A]/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#3D3929]" style={{ fontFamily: "Playfair Display,Georgia,serif" }}>
            Welcome Back!
          </h2>
          <p className="text-[#6E6D68] text-center text-sm max-w-xs">
            Signed in to Snitch Marketplace. Redirecting you to your dashboard…
          </p>
          <div className="w-48 h-1 rounded-full bg-[#DAD9D4] overflow-hidden">
            <motion.div
              className="h-full bg-[#A95A3A] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /* ─── Main render ─────────────────────────────────────────────────── */
  return (
    <motion.div
      className="min-h-screen flex lg:grid lg:grid-cols-[1.85fr_1fr] bg-[#FAF9F5]"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* ── Left: Branding Panel (hidden on mobile) ───────────────── */}
      <div className="hidden lg:block min-h-screen">
        <LoginBrandingPanel />
      </div>

      {/* ── Right: Login Form ───────────────────────────────── */}
      <div className="flex items-center justify-center min-h-screen px-5 py-10 sm:px-8 lg:px-10 bg-[#FAF9F5] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E9E6DC]/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#A95A3A]/8 blur-3xl" />
        </div>

        <motion.div
          variants={formVariants}
          initial="initial"
          animate="animate"
          className="relative z-10 w-full max-w-[460px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 flex items-center justify-center bg-[#A95A3A] rounded-none">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M6 2l1.5 5H16.5L18 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 7h18l-2 11H5L3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#3D3929] tracking-[0.08em] uppercase" style={{ fontFamily: "Outfit,sans-serif" }}>
              Snitch<span className="text-[#A95A3A]">.</span>
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(61,57,41,0.08)] border border-[#DAD9D4]/60 p-8 sm:p-10">
            {/* Heading */}
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-2xl sm:text-[28px] font-normal text-[#3D3929] leading-tight"
                style={{ fontFamily: "Playfair Display,Georgia,serif" }}
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22 }}
                className="mt-2 text-sm text-[#6E6D68] leading-relaxed"
              >
                Sign in to your account to continue shopping.
              </motion.p>
            </div>

            {/* Social: Google */}
            <motion.div
              custom={0}
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              className="mb-6"
            >
              <button
                type="button"
                aria-label="Continue with Google"
                className="group w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-[#DAD9D4] bg-white hover:bg-[#FAF9F5] hover:border-[#B4B2A7] hover:shadow-sm transition-all duration-200 text-sm font-semibold text-[#3D3929] focus-visible:ring-2 focus-visible:ring-[#A95A3A]/30 focus-visible:outline-none"
              >
                <GoogleIcon size={18} />
                <a href="/api/auth/google" className="text-sm font-semibold text-[#3D3929] focus-visible:ring-2 focus-visible:ring-[#A95A3A]/30 focus-visible:outline-none">Continue with Google</a>
              </button>
            </motion.div>

            {/* OR Divider */}
            <motion.div
              custom={1}
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              className="relative flex items-center gap-3 mb-6"
            >
              <div className="flex-1 h-px bg-[#DAD9D4]" />
              <span className="text-xs font-medium text-[#B4B2A7] uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-[#DAD9D4]" />
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <motion.div custom={2} variants={fieldVariants} initial="initial" animate="animate">
                <FloatingLabelInput
                  id="email"
                  label="Email Address"
                  type="email"
                  icon={<Mail size={16} />}
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  autoComplete="email"
                />
              </motion.div>

              {/* Password */}
              <motion.div custom={3} variants={fieldVariants} initial="initial" animate="animate">
                <FloatingLabelInput
                  id="password"
                  label="Password"
                  type="password"
                  icon={<Lock size={16} />}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  autoComplete="current-password"
                />
              </motion.div>

              {/* Remember Me + Forgot Password row */}
              <motion.div
                custom={4}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                className="flex items-center justify-between"
              >
                {/* Remember Me */}
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div
                      className={[
                        "w-4 h-4 rounded border transition-all duration-200",
                        form.rememberMe
                          ? "bg-[#A95A3A] border-[#A95A3A]"
                          : "bg-white border-[#DAD9D4] group-hover:border-[#A95A3A]/50",
                      ].join(" ")}
                    />
                    {form.rememberMe && (
                      <svg
                        className="absolute inset-0 w-4 h-4 text-white pointer-events-none"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.5 8.5l3 3 6-6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-[#6E6D68] font-medium group-hover:text-[#3D3929] transition-colors duration-150">
                    Remember me
                  </span>
                </label>

                {/* Forgot Password */}
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[#A95A3A] hover:text-[#8B4A2F] underline underline-offset-2 decoration-[#A95A3A]/40 hover:decoration-[#A95A3A] transition-all duration-150"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Server Error Banner */}
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    key="server-error"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    role="alert"
                    className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                    <span className="text-sm leading-snug font-medium">{serverError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.div
                custom={5}
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                className="pt-1"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015, y: loading ? 0 : -1 }}
                  whileTap={{ scale: loading ? 1 : 0.985 }}
                  className={[
                    "relative w-full h-13 px-6 rounded-none text-sm font-semibold text-white",
                    "bg-[#A95A3A]",
                    "shadow-[0_4px_20px_rgba(169,90,58,0.25)]",
                    "hover:bg-[#8B4A2F] hover:shadow-[0_6px_24px_rgba(169,90,58,0.35)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A95A3A] focus-visible:ring-offset-2",
                    "transition-all duration-200 overflow-hidden",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  {/* Shimmer effect */}
                  {!loading && (
                    <span
                      className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                      }}
                    />
                  )}

                  <span className="relative flex items-center justify-center gap-2 py-3.5">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing In…</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.4 }}
              className="mt-6 text-center text-sm text-[#6E6D68]"
            >
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#A95A3A] hover:text-[#8B4A2F] underline underline-offset-2 decoration-[#A95A3A]/40 hover:decoration-[#A95A3A] transition-all duration-150"
              >
                Create Account
              </Link>
            </motion.p>
          </div>

          {/* Bottom caption */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="mt-5 text-center text-xs text-[#B4B2A7]"
          >
            By signing in, you agree to our{" "}
            <a href="#" className="text-[#6E6D68] hover:text-[#A95A3A] underline underline-offset-1 transition-colors">
              Terms of Service
            </a>{" "}
            &{" "}
            <a href="#" className="text-[#6E6D68] hover:text-[#A95A3A] underline underline-offset-1 transition-colors">
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;