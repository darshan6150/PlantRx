import StripBanner from "@/components/strips/StripBanner";
import StripsBenefits from "@/components/strips/StripsBenefits";
import StripsIngredients from "@/components/strips/StripsIngredients";
import StripStory from "@/components/strips/StripsStory";
import SvgLayout from "@/components/strips/SvgLayout";
import CustomCursor from "@/utils/CustomCursor";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Strips() {
    const footerRef = useRef<HTMLDivElement | null>(null);
    const [hideCTA, setHideCTA] = useState(false);
  
    useEffect(() => {
      if (!footerRef.current) return;
  
      const observer = new IntersectionObserver(
        ([entry]) => {
          setHideCTA(entry.isIntersecting);
        },
        {
          threshold: 0.15,
        }
      );
  
      observer.observe(footerRef.current);
  
      return () => observer.disconnect();
    }, []);
    return (
        <>
        <CustomCursor />
        <motion.div
        className="fixed bottom-3 z-[999] flex justify-center items-center w-full"
        animate={{
          y: hideCTA ? 120 : 0,
          opacity: hideCTA ? 0 : 1,
          scale: hideCTA ? 0.95 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <a
          href="#"
          className="luxury-button-primary flex items-center justify-center gap-3 font-playfair font-bold tracking-[2px] bg-linear-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black h-10 sm:h-11 px-6 sm:px-8 rounded-md shadow-lg hover:opacity-90 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>

          <span>Add To Cart</span>
        </a>
      </motion.div>
        <div className="relative z-10 bg-cream">
            <SvgLayout /> 
            <StripBanner />
            <StripStory />
            <StripsBenefits />
            <StripsIngredients />
        </div>
        </>
    )
} 