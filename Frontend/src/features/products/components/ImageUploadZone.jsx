import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";

const MAX_IMAGES = 7;
const MAX_SIZE_MB = 10;
const ACCEPTED = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

/* ─── Upload progress simulation ─────────────────────────── */
const simulateUpload = (cb) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    cb(progress);
  }, 80);
};

/* ─── Single image preview card ──────────────────────────── */
const ImageCard = ({ item, index, onRemove }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative group aspect-square rounded-xl overflow-hidden border border-[#DAD9D4] bg-[#F5F4EF] shadow-[0_2px_12px_rgba(61,57,41,0.08)] cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.02 }}
    >
      {/* Image or progress */}
      {item.progress < 100 ? (
        <div className="w-full h-full flex items-center justify-center bg-[#F5F4EF]">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="13" fill="none" stroke="#DAD9D4" strokeWidth="3" />
                <circle
                  cx="16" cy="16" r="13" fill="none"
                  stroke="#A95A3A" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 13}`}
                  strokeDashoffset={`${2 * Math.PI * 13 * (1 - item.progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-100"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#A95A3A]">
                {item.progress}%
              </span>
            </div>
            <span className="text-[10px] text-[#6E6D68] font-medium">Uploading…</span>
          </div>
        </div>
      ) : (
        <img
          src={item.preview}
          alt={`Product image ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Cover badge */}
      {index === 0 && item.progress === 100 && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#A95A3A] rounded-full text-[9px] font-bold text-white uppercase tracking-widest shadow-sm">
          Cover
        </div>
      )}

      {/* Image number */}
      <div className="absolute bottom-2 left-2 w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-semibold text-white">
        {index + 1}
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rose-500 hover:scale-110"
        aria-label="Remove image"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
};

/* ─── Main component ──────────────────────────────────────── */
const ImageUploadZone = ({ images, onChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const processFiles = useCallback((files) => {
    setLocalError("");
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setLocalError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const validFiles = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!ACCEPTED.includes(file.type)) {
        setLocalError("Unsupported format. Use PNG, JPG, JPEG, or WEBP.");
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newItems = validFiles.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));

    const updated = [...images, ...newItems];
    onChange(updated);

    newItems.forEach((item) => {
      simulateUpload((progress) => {
        onChange((prev) =>
          prev.map((img) => (img.id === item.id ? { ...img, progress } : img))
        );
      });
    });
  }, [images, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = (id) => {
    const updated = images.filter((img) => img.id !== id);
    onChange(updated);
  };

  const displayError = localError || error;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        whileHover={images.length < MAX_IMAGES ? { borderColor: "#A95A3A" } : {}}
        animate={{
          borderColor: isDragging ? "#A95A3A" : displayError ? "#f87171" : "#DAD9D4",
          backgroundColor: isDragging ? "rgba(169,90,58,0.04)" : "rgba(250,249,245,0)",
        }}
        transition={{ duration: 0.2 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => images.length < MAX_IMAGES && inputRef.current?.click()}
        className={[
          "relative w-full rounded-2xl border-2 border-dashed",
          "transition-all duration-200 overflow-hidden py-10 px-6",
          images.length >= MAX_IMAGES ? "opacity-50 pointer-events-none cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(e) => processFiles(e.target.files)}
          aria-label="Upload product images"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            transition={{ duration: 0.2 }}
            className={[
              "w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-200",
              isDragging ? "bg-[#A95A3A]/10" : "bg-[#F5F4EF]",
            ].join(" ")}
          >
            <Upload
              size={24}
              className={isDragging ? "text-[#A95A3A]" : "text-[#B4B2A7]"}
            />
          </motion.div>

          <div>
            <p className="text-sm font-semibold text-[#3D3929]">
              {isDragging ? "Drop images here" : "Drag & Drop Images Here"}
            </p>
            <p className="text-xs text-[#6E6D68] mt-1">
              or{" "}
              <span className="text-[#A95A3A] font-semibold underline underline-offset-2">
                Browse Files
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-[#B4B2A7] font-medium uppercase tracking-wider">
            <span>PNG · JPG · JPEG · WEBP</span>
            <span className="w-px h-3 bg-[#DAD9D4] hidden sm:block" />
            <span>Max {MAX_IMAGES} Images</span>
            <span className="w-px h-3 bg-[#DAD9D4] hidden sm:block" />
            <span>{MAX_SIZE_MB} MB each</span>
          </div>
        </div>
      </motion.div>

      {/* Errors */}
      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 text-rose-600 text-xs font-medium"
          >
            <AlertCircle size={13} />
            {displayError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6D68] uppercase tracking-wider">
              {images.length} / {MAX_IMAGES} Images
            </span>
            {images.length >= MAX_IMAGES && (
              <span className="text-[10px] text-[#A95A3A] font-semibold">
                Maximum reached
              </span>
            )}
          </div>

          <Reorder.Group
            axis="x"
            values={images}
            onReorder={onChange}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2.5"
            as="div"
          >
            <AnimatePresence>
              {images.map((item, index) => (
                <Reorder.Item key={item.id} value={item} as="div">
                  <ImageCard
                    item={item}
                    index={index}
                    onRemove={handleRemove}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <p className="text-[11px] text-[#B4B2A7] flex items-center gap-1.5">
            <ImageIcon size={12} />
            First image becomes the cover · Drag to reorder
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;
