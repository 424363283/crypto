import { useState, useRef, useEffect } from 'react';

export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const leaveDelay = useRef<null | ReturnType<typeof setTimeout>>(null);
  const handleMouseEnter = () => {
    if (leaveDelay.current) {
      clearTimeout(leaveDelay.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (event: Event) => {
    leaveDelay.current = setTimeout(() => {
      if (ref.current && ref.current.contains((event as any).relatedTarget)) {
        return;
      }
      setIsHovered(false);
    }, 300);
  };

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      node.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      return () => {
        if (leaveDelay.current) {
          clearTimeout(leaveDelay.current);
        }
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return [ref, isHovered];
}
