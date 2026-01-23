import { motion, useInView, useReducedMotion } from "framer-motion";
import { ReactNode, useRef } from "react";

type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "fadeIn";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  offset?: number;
}

const getAnimationValues = (variant: AnimationVariant, offset: number = 24) => {
  switch (variant) {
    case "fadeUp":
      return { hidden: { opacity: 0.92, y: offset }, visible: { opacity: 1, y: 0 } };
    case "fadeDown":
      return { hidden: { opacity: 0.92, y: -offset }, visible: { opacity: 1, y: 0 } };
    case "fadeLeft":
      return { hidden: { opacity: 0.92, x: -offset }, visible: { opacity: 1, x: 0 } };
    case "fadeRight":
      return { hidden: { opacity: 0.92, x: offset }, visible: { opacity: 1, x: 0 } };
    case "scale":
      return { hidden: { opacity: 0.92, scale: 0.96 }, visible: { opacity: 1, scale: 1 } };
    case "fadeIn":
    default:
      return { hidden: { opacity: 0.92 }, visible: { opacity: 1 } };
  }
};

export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.35,
  className = "",
  offset = 24,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const prefersReducedMotion = useReducedMotion();

  const animationValues = getAnimationValues(variant, offset);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={animationValues.hidden}
      animate={inView ? animationValues.visible : animationValues.hidden}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
}

export function StaggerItem({
  children,
  className = "",
  variant = "fadeUp",
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const animationValues = getAnimationValues(variant, 20);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: animationValues.hidden,
        visible: animationValues.visible,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInSection({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.92, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.92, y: 24 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
