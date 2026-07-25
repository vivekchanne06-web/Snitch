import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, AlertCircle } from "lucide-react";

const MAX_IMAGES = 7;
const MAX_SIZE_MB = 10;
const ACCEPTED = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

/* ─── Progress simulation ─────────────────────────────────── */
const simulateUpload = (cb) => {
  let p = 0;
  const iv = setInterval(() => {
    p += Math.floor(Math.random() * 22) + 10;
    if (p >= 100) { p = 100; clearInterval(iv); }
    cb(p);
  }, 60);
};

/* ─── Compact Image Upload ─────────────────────────────────── */
const CompactImageUpload = ({ images, onChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const processFiles = useCallback((files) => {
    setLocalError("");
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { setLocalError(`Maximum ${MAX_IMAGES} images allowed.`); return; }

    const validFiles = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!ACCEPTED.includes(file.type)) {
        setLocalError("Unsupported format. Use PNG, JPG, JPEG or WEBP."); continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB.`); continue;
      }
      validFiles.push(file);
    }
    if (!validFiles.length) return;

    const newItems = validFiles.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));

    const next = [...images, ...newItems];
    onChange(next);

    newItems.forEach((item) => {
      simulateUpload((p) => {
        onChange((prev) =>
          prev.map((img) => (img.id === item.id ? { ...img, progress: p } : img))
        );
      });
    });
  }, [images, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleRemove = (id) => onChange(images.filter((i) => i.id !== id));

  const displayError = localError || error;
  const canAdd = images.length < MAX_IMAGES;

  return (
    <div className="space-y-2">
      {/* Grid: Upload tile + thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {/* ── Upload tile ─────────────────────────────────── */}
        <motion.button
          type="button"
          disabled={!canAdd}
          onClick={() => canAdd && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          whileHover={canAdd ? { scale: 1.03 } : {}}
          whileTap={canAdd ? { scale: 0.97 } : {}}
          animate={{
            borderColor: isDragging
              ? "#A95A3A"
              : displayError
              ? "#f87171"
              : "#DAD9D4",
            backgroundColor: isDragging
              ? "rgba(169,90,58,0.06)"
              : "rgba(250,249,245,0)",
          }}
          transition={{ duration: 0.15 }}
          className={[
            "col-span-1 aspect-square rounded-xl border-2 border-dashed",
            "flex flex-col items-center justify-center gap-1",
            "transition-all duration-200 outline-none",
            canAdd ? "cursor-pointer" : "opacity-40 cursor-not-allowed",
          ].join(" ")}
          aria-label="Upload images"
        >
          <motion.div
            animate={{ y: isDragging ? -3 : 0 }}
            className="w-8 h-8 rounded-lg bg-[#A95A3A]/10 flex items-center justify-center"
          >
            <Plus size={16} className="text-[#A95A3A]" strokeWidth={2.5} />
          </motion.div>
          <span className="text-[9px] font-semibold text-[#B4B2A7] uppercase tracking-wider">
            {images.length}/{MAX_IMAGES}
          </span>
        </motion.button>

        {/* ── Thumbnails ─────────────────────────────────── */}
        <AnimatePresence>
          {images.slice(0, 7).map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative group aspect-square rounded-xl overflow-hidden border border-[#DAD9D4] bg-[#F5F4EF]"
              whileHover={{ scale: 1.04 }}
            >
              {/* Loading spinner */}
              {item.progress < 100 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F5F4EF]">
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="#DAD9D4" strokeWidth="2.5" />
                    <circle
                      cx="12" cy="12" r="9" fill="none" stroke="#A95A3A" strokeWidth="2.5"
                      strokeDasharray={`${2 * Math.PI * 9}`}
                      strokeDashoffset={`${2 * Math.PI * 9 * (1 - item.progress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-75"
                    />
                  </svg>
                </div>
              ) : (
                <img
                  src={item.preview}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}

              {/* Cover badge */}
              {index === 0 && item.progress === 100 && (
                <div className="absolute bottom-1 left-1 right-1 text-center">
                  <span className="inline-block px-1.5 py-px bg-[#A95A3A] text-white text-[8px] font-bold uppercase tracking-wider rounded-full">
                    Cover
                  </span>
                </div>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-rose-500"
                aria-label="Remove"
                style={{ width: "18px", height: "18px" }}
              >
                <X size={9} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-xl border border-dashed border-[#DAD9D4]/60 bg-[#FAF9F5]/50"
          />
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {displayError && (
          <motion.p
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="flex items-center gap-1.5 text-[11px] text-rose-500 font-medium"
          >
            <AlertCircle size={11} />
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-[10px] text-[#B4B2A7]">
        PNG, JPG, WEBP · 10 MB max · First image = cover · Drag to reorder
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
        className="sr-only"
        onChange={(e) => processFiles(e.target.files)}
      />
    </div>
  );
};

export default CompactImageUpload;
