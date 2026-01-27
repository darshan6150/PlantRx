import { useEffect, useState } from 'react';

export function useIsTablet(min = 768, max = 1440) {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsTablet(w >= min && w < max);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [min, max]);

  return isTablet;
}
