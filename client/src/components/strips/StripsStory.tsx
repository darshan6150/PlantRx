import RevealText from "@/utils/RevealText";
import { motion, useScroll, useTransform, MotionValue, useMotionTemplate } from "framer-motion";
import { useRef, useMemo } from "react";
import { useIsTablet } from "@/hooks/useIsTablet";
import { useIsMobile } from "@/hooks/useIsMobile";

const title = "Focus That Fits Your Day";
const lines = ["Clean energy and clarity in a simple daily strip."];

interface ImageData {
  src: string;
  range: [number, number, number, number];
  side: "left" | "right";
  align: string;
  targetTop: string;
}

const imageData: ImageData[] = [
  {
    src: "/image-story-1.png",
    range: [0.35, 0.45, 0.55, 0.65],
    side: "left",
    align: "3%",
    targetTop: "25%",
  },
  {
    src: "/image-story-2.png",
    range: [0.5, 0.6, 0.7, 0.8],
    side: "right",
    align: "3%",
    targetTop: "30%",
  },
  {
    src: "/image-story-3.png",
    range: [0.65, 0.75, 0.85, 0.95],
    side: "left",
    align: "3%",
    targetTop: "35%",
  },
];

export default function StripStory() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isTablet = useIsMobile(1024);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const characters = useMemo(() => {
    return title.split("").map((char, i) => {
      const start = Math.random() * 0.15;
      const end = start + 0.15;

      const isFocusChar = i <= 4;
      const isDayChar = i >= 15 && i <= 26;

      const className = isFocusChar
        ? "text-green"
        : isDayChar
        ? "text-secondary"  
        : "";

      return { char, start, end, className };
    });
  }, []);

  const clipPath = useTransform(
    scrollYProgress,
    [0.25, 0.35],
    [
      "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ]
  );

  return (
    <section className="product-story-section relative">
      <div
        ref={sectionRef}
        className="relative lg:h-[800vh] h-auto lg:pt-52 lg:pb-60 max-sm:pt-10 pb-40"
      >
        <div className="text-image sticky top-0 lg:h-screen w-full lg:overflow-hidden">
          <div className="container flex flex-col items-center justify-center h-full ">
            <h2 className="font-body font-bold text-center max-w-xl md:max-w-[740px] xl:text-8xl xl:leading-25 lg:text-6xl lg:leading-23 md:text-5xl md:leading-17 mb-2">
              {!isTablet ? (
                <span className="flex flex-wrap justify-center"> 
                  {characters.map((item, i) => (
                    <Character
                      key={i}
                      char={item.char}
                      className={item.className}
                      progress={scrollYProgress}
                      range={[item.start, item.end]}
                    /> 
                  ))}
                </span>
              ) : (
                <span>
                  <span className="text-green">Focus</span> That Fits{" "}
                  <span className="text-secondary">Your Day</span>
                </span>
              )} 
            </h2>

            <div className="mt-0 lg:mt-4 text-center z-10">
              {isTablet ? (
                lines.map((text, i) => (
                  <motion.div key={i} style={{ clipPath }}>
                    {text}
                  </motion.div>
                ))
              ) : (
                <RevealText tag="p">
                  Clean energy and clarity in a simple daily strip.
                </RevealText>
              )}
            </div>
          </div>

          {imageData.map((img, i) => (
            <StoryImage
              key={i}
              src={img.src}
              progress={scrollYProgress}
              range={img.range}
              side={img.side}
              align={img.align}
              targetTop={img.targetTop}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CharacterProps { 
  char: string;
  className?: string; 
  progress: MotionValue<number>;
  range: [number, number];
}

function Character({ char, className = "", progress, range }: CharacterProps) {
    const blur = useTransform(progress, range, [20, 0]);
    const opacity = useTransform(progress, range, [0, 1]);
    const y = useTransform(progress, range, [20, 0]);
    
    const filter = useMotionTemplate`blur(${blur}px)`;
  
    return (
      <motion.span
        className={className}
        style={{
          filter: filter, 
          opacity,
          y,
          display: "inline-block",
          whiteSpace: char === " " ? "pre" : "normal",
        }}
      >
        {char}
      </motion.span>
    );
  }

interface StoryImageProps {
  src: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  side: "left" | "right";
  align: string;
  targetTop: string;
}

function StoryImage({
  src,
  progress,
  range,
  side,
  align,
  targetTop,
}: StoryImageProps) {
  const y = useTransform(progress, range, [
    "100vh",
    "0vh",
    "0vh",
    "-100vh",
  ]);
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const scale = useTransform(progress, range, [0.6, 1, 1, 0.6]);

  const x = useTransform(progress, range, [
    side === "left" ? "-50%" : "50%",
    "0%",
    "0%",
    side === "left" ? "-50%" : "50%",
  ]);

  const rotate = useTransform(progress, range, [
    side === "left" ? -60 : 60,
    side === "left" ? -10 : 10,
    side === "left" ? -10 : 10,
    side === "left" ? 60 : -60,
  ]);

  return (
    <motion.div
      className="text-with-img absolute w-full max-w-[30%] z-20 pointer-events-none max-lg:!transform-none max-[1025px]:!top-[unset] max-[1025px]:bottom-[150px] max-sm:bottom-[100px] max-lg:!opacity-100"
      style={{
        y,
        x,
        opacity,
        scale,
        rotate,
        top: targetTop,
        [side]: align,
        transformOrigin: side === "left" ? "left bottom" : "right bottom",
      }}
    >
      <img
        src={src}
        width={1080}
        height={1080}
        alt="Product Story"
        className="w-full h-auto object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
}
