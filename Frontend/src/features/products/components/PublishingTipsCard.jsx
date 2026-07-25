import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const tips = [
  "Use high-quality, well-lit images for a better first impression.",
  "The first image becomes the cover shown in search & listings.",
  "Upload at least 3 images for better buyer engagement.",
  "Write a detailed description — include fabric, fit, and care.",
  "Set an accurate price to build trust with your customers.",
  "Premium titles with brand, style, and material rank higher.",
];

const PublishingTipsCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#F5F4EF] rounded-2xl border border-[#DAD9D4]/60 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[#A95A3A]/10 flex items-center justify-center">
          <Sparkles size={15} className="text-[#A95A3A]" />
        </div>
        <div>
          <h3
            className="text-sm font-semibold text-[#3D3929]"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Publishing Tips
          </h3>
          <p className="text-[10px] text-[#B4B2A7]">For better visibility</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#DAD9D4] mb-4" />

      {/* Tips list */}
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.55 + i * 0.06 }}
            className="flex items-start gap-2.5"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#A95A3A]/60 shrink-0" />
            <span className="text-xs text-[#6E6D68] leading-relaxed">{tip}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PublishingTipsCard;
