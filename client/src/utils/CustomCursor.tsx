import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EDGE_MARGIN = 80;

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const move = (e: { clientX: any; clientY: any; }) => {
      const x = e.clientX;
      const y = e.clientY;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const dx = Math.min(x, vw - x);
      const dy = Math.min(y, vh - y);

      const edgeDistance = Math.min(dx, dy);
      const o = Math.max(0, Math.min(edgeDistance / EDGE_MARGIN, 1));

      setPos({ x, y });
      setOpacity(o);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{
        x: pos.x - 10,
        y: pos.y - 10,
        opacity,
      }}
      transition={{
        x: { type: "spring", stiffness: 500, damping: 30 },
        y: { type: "spring", stiffness: 500, damping: 30 },
        opacity: { duration: 0.2, ease: "easeOut" },
      }}
    />
  );
}
