import React, { useEffect } from 'react';
import { ANIMATION_CONFIG } from '@/utils/animationConfig';

/**
 * Animation Provider - Automatically detects environment and applies appropriate CSS classes
 */
export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Add environment class to document body
    const className = ANIMATION_CONFIG.IS_PREVIEW ? 'preview-environment' : 'external-environment';
    document.body.classList.add(className);
    
    // Add a CSS custom property for dynamic duration calculation
    const rootStyle = document.documentElement.style;
    const scale = ANIMATION_CONFIG.IS_PREVIEW ? ANIMATION_CONFIG.PREVIEW_SCALE : ANIMATION_CONFIG.EXTERNAL_SCALE;
    rootStyle.setProperty('--animation-scale', scale.toString());
    
    console.log(`🎬 Animation environment detected: ${ANIMATION_CONFIG.IS_PREVIEW ? 'Preview' : 'External'} (scale: ${scale}) - Diagnostic: card hover = ${ANIMATION_CONFIG.getDuration(0.7).toFixed(2)}s, button press = ${ANIMATION_CONFIG.getDuration(0.3).toFixed(2)}s`);
    
    return () => {
      document.body.classList.remove(className);
      rootStyle.removeProperty('--animation-scale');
    };
  }, []);

  return <>{children}</>;
};

/**
 * Hook for getting normalized animation classes
 */
export const useAnimationClasses = () => {
  const getTransitionClass = (baseDuration: number = 0.5) => {
    return `transition-all ${ANIMATION_CONFIG.getTailwindDuration(baseDuration)} ease-in-out`;
  };

  const getHoverClass = (baseDuration: number = 0.3) => {
    return `${getTransitionClass(baseDuration)} hover:scale-105`;
  };

  const getCardClass = (baseDuration: number = 0.5) => {
    return `${getTransitionClass(baseDuration)} hover:shadow-xl`;
  };

  return {
    getTransitionClass,
    getHoverClass,
    getCardClass,
    // Standard classes with normalized timing
    transition: getTransitionClass(0.5),
    transitionFast: getTransitionClass(0.3),
    transitionSlow: getTransitionClass(0.8),
    hover: getHoverClass(0.3),
    card: getCardClass(0.5)
  };
};