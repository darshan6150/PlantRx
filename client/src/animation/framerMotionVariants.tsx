'use client'
import { Variants } from 'framer-motion'

/**
 * CONTAINER VARIANTS
 * Staggering is fine, no visual properties here.
 */
export const wordContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

export const textContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.45,
    },
  },
}

export const containerBlurVars: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

/**
 * PERSPECTIVE VARIANTS
 * Added z: 0.01 and backface visibility logic for iOS.
 */
export const wordRisePerspective: Variants = {
  hidden: {
    y: '120%',
    rotateX: 25,
    opacity: 0,
    z: 0.01, // Force GPU
  },
  visible: {
    y: '0%',
    rotateX: 0.01, // Keep GPU active
    opacity: 1,
    z: 0.01,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/**
 * SLIDE VARIANTS
 * Replaced CSS variables with direct 'y' values and added z-axis stability.
 */
export const slideDownVariants: Variants = {
  hidden: {
    y: -40,
    opacity: 0,
    z: 0.01,
  },
  visible: {
    y: 0,
    opacity: 1,
    z: 0.01,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
    z: 0.01,
  },
  visible: {
    y: 0,
    opacity: 1,
    z: 0.01,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

/**
 * BLUR VARIANTS (Left, Right, and Center)
 * Fixed: blur(0.01px) prevents the end-of-animation snap.
 * Initial blur reduced slightly for mobile performance.
 */
export const itemBlurLeftVars: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
    filter: "blur(8px)",
    z: 0.01,
  },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0.01px)", 
    z: 0.01,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
}

export const itemBlurRightVars: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
    filter: "blur(8px)",
    z: 0.01,
  },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0.01px)",
    z: 0.01,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
}

export const itemBlurVars: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    z: 0.01,
  },
  show: {
    opacity: 1,
    filter: "blur(0.01px)",
    z: 0.01,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
}