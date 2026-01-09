import { useEffect, useRef, useState } from "react";

export default function useSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    })

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [])

  return [ref, size.width, size.height] as const;
}