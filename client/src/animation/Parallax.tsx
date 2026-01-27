'use client';

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useParallax } from "../hooks/useParallax";

type ParallaxProps = {
  children: ReactNode;
  distance?: number;
  className?: string;
};

export default function Parallax({
  children,
  distance = 200,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { y } = useParallax(ref, { distance });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
