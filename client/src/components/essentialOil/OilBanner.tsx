import React from 'react';
import { motion } from 'framer-motion';

const OilBanner: React.FC = () => {
  const text = "JOJOBA FACE OIL";
  const characters = text.split("");

  const liquidVariants = {
    initial: { 
      y: 0, 
      skewX: 0, 
      scaleY: 1,
      filter: "url(#no-distort)" 
    },
    hover: (i: number) => ({
      y: [0, -10, 5, 0],
      skewX: [0, 15, -15, 0],
      scaleY: [1, 1.1, 0.9, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.1, 
      },
    }),
  };

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center select-none">
        
        <div className="absolute inset-0 flex items-center justify-center opacity-90 z-0 pointer-events-none">
          <motion.img 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/oil-splash.png" 
            className="w-full max-w-4xl object-contain"
          />
        </div>

        <motion.h1 
          className="uppercase text-primary font-black text-[8vw] md:text-[150px] leading-none flex whitespace-pre"
          initial="initial"
          whileHover="hover"
        >
          {characters.map((char, i) => {
            const isFront = [4, 10, 13].includes(i);
            
            return (
              <motion.span 
                key={i} 
                custom={i}
                variants={liquidVariants}
                className="inline-block relative"
                style={{ 
                  zIndex: isFront ? 30 : 10,
                }}
              >
                <span className="hover:filter-[url(#liquid-wave)] transition-all duration-300">
                  {char === " " ? "\u00A0" : char}
                </span>
              </motion.span>
            );
          })}
        </motion.h1>
      </div>
    </section>
  );
};

export default OilBanner;