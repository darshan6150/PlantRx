import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const JojobaShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Track scroll specifically for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const springConfig = { stiffness: 45, damping: 20, restDelta: 0.001 };

  // 2. BOTTLE TRANSFORMS (Targeting the Red Mark area)
  // X: Moves from center (0) to right (38vw)
  const x = useSpring(useTransform(scrollYProgress, [0.1, 0.5], ["0vw", "38vw"]), springConfig);
  // Y: Moves slightly down to hit that red mark area
  const y = useSpring(useTransform(scrollYProgress, [0.1, 0.5], ["0vh", "20vh"]), springConfig);
  // Scale: Grows slightly
  const scale = useSpring(useTransform(scrollYProgress, [0.1, 0.5], [1, 1.25]), springConfig);
  // Rotate: Tilts right
  const rotate = useSpring(useTransform(scrollYProgress, [0.1, 0.5], [0, 15]), springConfig);

  // 3. TEXT & BACKGROUND TRANSFORMS
  const bannerOpacity = useSpring(useTransform(scrollYProgress, [0.2, 0.4], [1, 0]), springConfig);
  
  const pathInitial = "M -44,-50 C -52.71,28.52 15.86,8.186 184,14.69 383.3,22.39 462.5,12.58 638,14 835.5,15.6 987,6.4 1194,13.86 1661,30.68 1652,-36.74 1582,-140.1 1512,-243.5 15.88,-589.5 -44,-50 Z";
  const pathTarget = "M -44,-50 C -137.1,117.4 67.86,445.5 236,452 435.3,459.7 500.5,242.6 676,244 873.5,245.6 957,522.4 1154,594 1593,753.7 1793,226.3 1582,-126 1371,-478.3 219.8,-524.2 -44,-50 Z";
  const pathMorph = useTransform(scrollYProgress, [0.3, 0.7], [pathInitial, pathTarget]);
  const svgY = useSpring(useTransform(scrollYProgress, [0.2, 0.7], ["-25%", "0%"]), springConfig);

  const characters = "JOJOBA FACE OIL".split("");

  return (
    /* The Parent Track: 300vh defines how much scrolling space we have */
    <div ref={containerRef} className="relative w-full h-[300vh] bg-white">
      
      {/* THE STICKY VIEWPORT: Replaces 'fixed' */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center select-none">
        
        {/* Banner 1 Elements */}
        <motion.div style={{ opacity: bannerOpacity }} className="absolute inset-0 flex items-center justify-center z-0">
          <img src="/oil-splash.png" className="w-full max-w-4xl opacity-80" />
        </motion.div>

        <motion.div style={{ opacity: bannerOpacity }} className="relative z-10">
          <h1 className="uppercase text-[#065f46] font-black text-[8vw] md:text-[140px] leading-none flex whitespace-pre">
            {characters.map((char, i) => (
              <span key={i} style={{ zIndex: [4, 10, 13].includes(i) ? 40 : 10, position: 'relative', display: 'inline-block' }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* MORPHING SVG (Section 2 Background) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.svg style={{ y: svgY }} className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
            <motion.path d={pathMorph} fill="#065f46" />
          </motion.svg>
        </div>

        {/* THE BOTTLE: Sticky within this section */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <motion.div 
            style={{ x, y, scale, rotate }}
            className="relative flex items-center justify-center"
          >
            <motion.img 
              animate={{ y: [-15, 15] }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
              src="/essential-oil-new.png" 
              className="h-[52vh] object-contain drop-shadow-[0_45px_60px_rgba(0,0,0,0.3)]"
            />
          </motion.div>
        </div>

        {/* SECTION 2 CONTENT (Benefits) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.6, 0.85], [0, 1]),
            y: useTransform(scrollYProgress, [0.6, 0.85], [100, 0])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-50 p-10 text-white"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight drop-shadow-md">
            Benefits of Nourishing <br /> Jojoba Face Oil
          </h2>
          <p className="text-lg md:text-xl max-w-xl opacity-90 drop-shadow-sm">
            Natural Hydration for a radiant, balanced complexion.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default JojobaShowcase;