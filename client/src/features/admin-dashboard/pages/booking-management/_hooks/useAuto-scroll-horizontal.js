import { useEffect } from "react";

export default function useAutoScrollHorizontal(ref, speed = 12, threshold = 120) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let animationFrame;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;

      if (mouseX < rect.left + threshold) {
        // scroll left
        animationFrame = requestAnimationFrame(() => {
          container.scrollLeft -= speed;
        });
      } else if (mouseX > rect.right - threshold) {
        // scroll right
        animationFrame = requestAnimationFrame(() => {
          container.scrollLeft += speed;
        });
      } else {
        cancelAnimationFrame(animationFrame);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [ref, speed, threshold]);
}
