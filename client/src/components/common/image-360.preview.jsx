import View360, { EquirectProjection } from "@egjs/react-view360";
import "@egjs/react-view360/css/view360.min.css";
import { Expand } from "lucide-react";
import { useMemo, useRef } from "react";

export default function Image360Preview({ image }) {
  const containerRef = useRef(null);

  const projection = useMemo(
    () =>
      new EquirectProjection({
        src: image || "/test.jpg",
        yaw: 180,
      }),
    [image],
  );

  const openFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-video h-full w-full [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:max-w-none"
    >
      <View360
        className="h-full w-full"
        projection={projection}
        rotate
        zoom
        useResizeObserver
      />

      <button
        onClick={openFullscreen}
        className="absolute end-2 top-4 z-40 cursor-pointer rounded bg-black/70 px-3 py-1 text-white hover:bg-black"
      >
        <Expand className="size-3" />
      </button>
    </div>
  );
}
