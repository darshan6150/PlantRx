import React from 'react';
import { motion } from 'framer-motion';

const PATHS = {
  initial: "M 189,80.37 C 243,66.12 307.3,87.28 350.9,124.1 389.3,156.6 417,211.2 418.1,263.4 419.1,305.7 401.8,355.6 368.5,379.1 298.8,428 179.2,446.4 117.6,386.3 65.4,335.3 78.55,230.3 105.5,160.5 119.7,123.6 152.6,89.85 189,80.37 Z",
  
  foregroundMorph: "M 189,80.37 C 232.6,46.67 352.5,67.06 350.9,124.1 349.5,173.4 311.7,168 312.4,248.1 312.9,301.1 382.5,319.2 368.5,379.1 349.4,460.6 137.7,467.5 117.6,386.3 98.68,309.7 171.5,292.2 183.6,240.1 195.7,188.2 123.8,130.7 189,80.37 Z",
  
  backgroundMorph: "M 209,70.37 C 263,56.12 347.3,67.28 390.9,104.1 429.3,136.6 447,201.2 448.1,253.4 449.1,295.7 431.8,345.6 398.5,369.1 328.8,418 209.2,436.4 147.6,376.3 95.4,325.3 108.55,220.3 135.5,150.5 149.7,113.6 182.6,79.85 209,70.37 Z"
};

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1], 
};

const OrganicBlob: React.FC = () => {
  return (
    <div className="flex items-start justify-start">
      <motion.div 
        className="relative w-[500px] h-[500px] cursor-pointer"
        initial="initial"
        whileHover="hover"
      >
        <svg width="500" height="500" viewBox="0 0 500 500" className="overflow-visible">
          <defs>
            <clipPath id="clipShape1">
              <motion.path
                variants={{
                  initial: { 
                    d: PATHS.initial, 
                    scaleX: 1, scaleY: 1, rotate: 0, y: 0 
                  },
                  hover: { 
                    d: PATHS.foregroundMorph, 
                    scaleX: 0.8, 
                    scaleY: 1.1, 
                    rotate: 5, 
                    y: 20 
                  }
                }}
                transition={transition} 
                style={{ originX: "250px", originY: "250px" }}
              />
            </clipPath>
          </defs>

          <motion.path
            fill="#fff"
            variants={{
              initial: { 
                d: PATHS.initial,
                rotate: 0,
                x: 0,
                y: 0,
                scale: 1 
              },
              hover: { 
                d: PATHS.backgroundMorph, 
                rotate: -4,  
                x: 10,       
                y: 5,        
                scale: 1     
              }
            }}
            transition={transition}
            style={{ originX: "250px", originY: "250px" }}
          />

          <g clipPath="url(#clipShape1)">
            <motion.image
              href="/oil-background.webp"
              x="0" y="0" width="500" height="500"
              preserveAspectRatio="xMidYMid slice"
              variants={{
                initial: { scale: 1.2 },
                hover: { scale: 1.1, x: -10 } 
              }}
              transition={transition}
              style={{ originX: "250px", originY: "250px" }}
            />
          </g>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.h2 
            className="text-green text-3xl font-bold text-center drop-shadow-md"
            variants={{
              initial: { y: 0 },
              hover: { y: -10 }
            }}
            transition={transition}
          >
            Codium fasciculatus
          </motion.h2>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganicBlob;