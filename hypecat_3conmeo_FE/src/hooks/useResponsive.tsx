import { useState, useEffect } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const getBreakpoint = (width: number): Breakpoint => {
  if (width < 600) return "xs"; // small phones
  if (width < 900) return "sm"; // tablets
  if (width < 1200) return "md"; // small desktops
  if (width < 1536) return "lg"; // large desktops
  return "xl"; // extra large screens
};

export const useResponsive = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(
    getBreakpoint(width)
  );

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setBreakpoint(getBreakpoint(newWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initialize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width, breakpoint, isMobile: width < 900 };
};
