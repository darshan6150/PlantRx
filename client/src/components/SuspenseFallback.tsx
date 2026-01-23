import { motion } from "framer-motion";

export function SuspenseFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative mb-4">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none" className="animate-pulse">
            <path
              d="M20 5C12 5 8 12 10 20C12 28 18 35 20 35C22 35 28 28 30 20C32 12 28 5 20 5Z"
              className="fill-emerald-600 dark:fill-emerald-500/70"
            />
            <path
              d="M20 8L20 32M14 15C16 18 18 22 20 28M26 15C24 18 22 22 20 28"
              className="stroke-emerald-800/60 dark:stroke-emerald-300/30"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500/60"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
