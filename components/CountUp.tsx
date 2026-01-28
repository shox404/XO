import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useCallback } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
  separator?: string;
}

export default function CountUp({
  value,
  duration = 0.6,
  className = "",
  separator = ""
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // track previous value
  const previousValue = useRef<number>(0);

  // motion value always starts at 0
  const motionValue = useMotionValue(0);

  const spring = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration)
  });

  // detect decimals dynamically
  const getDecimals = (num: number) => {
    const s = num.toString();
    return s.includes(".") ? s.split(".")[1].length : 0;
  };

  const formatValue = useCallback(
    (num: number) => {
      const decimals = getDecimals(value);

      const formatted = Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: !!separator
      }).format(num);

      return separator ? formatted.replace(/,/g, separator) : formatted;
    },
    [value, separator]
  );

  // animate on mount & on value change
  useEffect(() => {
    // set starting point
    motionValue.set(previousValue.current);

    // animate to new value
    motionValue.set(value);

    // store for next update
    previousValue.current = value;
  }, [value, motionValue]);

  // update DOM text
  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [spring, formatValue]);

  // initial render
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(0);
    }
  }, []);

  return <span ref={ref} className={className} />;
}
