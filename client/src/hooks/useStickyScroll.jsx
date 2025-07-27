import { useEffect, useState } from 'react';

export function useStickyScroll(containerRef, elementRef, offset = 100, speed = 0.8) {
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || !elementRef.current) return;

            const scrollY = window.scrollY;
            const containerHeight = containerRef.current.offsetHeight;
            const elementHeight = elementRef.current.offsetHeight;

            const maxY = containerHeight - elementHeight - offset;
            const y = Math.min(scrollY * speed, maxY > 0 ? maxY : 0);

            setTranslateY(y);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // initial call
        return () => window.removeEventListener("scroll", handleScroll);
    }, [containerRef, elementRef, offset, speed]);

    return translateY;
}
