import { useScroll, useTransform } from "framer-motion";
import { RefObject } from "react";

type UseScrollOptions = Parameters<typeof useScroll>[0];
type ScrollOffset = NonNullable<UseScrollOptions>["offset"];

type ParallaxOptions = {
  distance?: number;
  offset?: ScrollOffset;
};

export function useParallax(
  ref: RefObject<HTMLElement>,
  {
    distance = 200,
    offset = ["start end", "end start"] as ScrollOffset,
  }: ParallaxOptions = {}
) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return { y, scrollYProgress };
}