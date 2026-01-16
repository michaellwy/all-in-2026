import { motion } from 'framer-motion';

interface QuoteTooltipProps {
  quote: string;
  hostColor: string;
}

export function QuoteTooltip({ quote, hostColor }: QuoteTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-10 left-4 right-4 bottom-full mb-2 pointer-events-none"
    >
      <div
        className="bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl"
        style={{ borderLeft: `3px solid ${hostColor}` }}
      >
        <p className="italic leading-relaxed">"{quote}"</p>
      </div>
      {/* Arrow */}
      <div className="absolute left-8 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900" />
    </motion.div>
  );
}
