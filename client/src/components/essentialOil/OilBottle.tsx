import React from 'react';
import { motion } from 'framer-motion';

function OilBottle() {
  return (
    <div className="fixed inset-0 pt-24 pl-5 flex items-center justify-center z-20 pointer-events-none">
      <motion.img 
        animate={{ y: [-15, 15] }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "mirror", 
          duration: 3, 
          ease: "easeInOut" 
        }}
        src="/essential-oil-new.png" 
        alt="Essential Oil Bottle" 
        className="h-[60%] md:h-[60%] object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.3)]"
      />
    </div>
  )
}

export default OilBottle;