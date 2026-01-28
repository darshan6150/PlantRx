import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RevealText from '@/utils/RevealText';
import BlobImage from './BlobImage';

const LiquidMorphSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], 
  });

  const pathInitial = "M -44,-50 C -52.71,28.52 15.86,8.186 184,14.69 383.3,22.39 462.5,12.58 638,14 835.5,15.6 987,6.4 1194,13.86 1661,30.68 1652,-36.74 1582,-140.1 1512,-243.5 15.88,-589.5 -44,-50 Z";
  const pathTarget = "M -44,-50 C -137.1,117.4 67.86,445.5 236,452 435.3,459.7 500.5,242.6 676,244 873.5,245.6 957,522.4 1154,594 1593,753.7 1793,226.3 1582,-126 1371,-478.3 219.8,-524.2 -44,-50 Z";

  const pathMorph = useTransform(scrollYProgress, [0, 0.6], [pathInitial, pathTarget]);
  
  const fillOpacity = useTransform(scrollYProgress, [0, 0], [0, 1]);
  const dropY = useTransform(scrollYProgress, [0, 0.6], ["-20%", "0%"]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[150vh] bg-green overflow-hidden"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden ">
        <motion.svg 
          style={{ y: dropY }}
          className="w-full h-full " 
          preserveAspectRatio="none" 
          viewBox="0 0 1440 800"
        >
          <motion.path 
            d={pathMorph}
            fill="#fff" 
            style={{ fillOpacity }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </motion.svg>

        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0.4, 0.7], [50, 0])
          }}
          className="absolute max-w-xl mx-auto text-center inset-0 flex flex-col items-center justify-center *:text-white p-10"
        >
          <RevealText tag='h2' className="mb-7 *:text-white">
            Benefits of Nourishing Jojoba Face Oil          
          </RevealText>
          <RevealText tag='p' className="text-xl max-w-lg text-center">
          Nourishing Jojoba Face Oil: Intense, Natural Hydration
          </RevealText>
        </motion.div>
      </div>
        <BlobImage />
    </section>
  );
};

export default LiquidMorphSection;