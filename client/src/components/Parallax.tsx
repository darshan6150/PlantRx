import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  distance?: number; 
  speed?: number; 
  direction?: "up" | "down";
}

export default function Parallax({ 
  children, 
  className = "", 
  distance = 100,
  speed,
  direction = "up"
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });


  const springConfig = { damping: 15, stiffness: 100 };
  

  
  const yRange = direction === "down" ? [-distance, distance] : [distance, -distance];
  
  
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const ySpring = useSpring(y, springConfig);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: ySpring }}
    >
      {children}
    </motion.div>
  );
}
