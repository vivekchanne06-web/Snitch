const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise = null;

/**
 * Singleton Razorpay script loader.
 * Guarantees that the Razorpay SDK script is loaded only once across the application lifecycle.
 */
export const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  // 1. If window.Razorpay already exists -> resolve immediately
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  // 2. If the Razorpay script is already in flight -> reuse existing Promise
  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  // 3. If the script tag already exists in DOM -> attach load listener to it
  const existingScript = document.querySelector(
    `script[src="${RAZORPAY_SCRIPT_SRC}"]`
  );

  if (existingScript) {
    razorpayScriptPromise = new Promise((resolve) => {
      const handleLoad = () => resolve(true);
      const handleError = () => {
        razorpayScriptPromise = null;
        resolve(false);
      };
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
    });
    return razorpayScriptPromise;
  }

  // 4. Append script tag exactly once
  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayScriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};
