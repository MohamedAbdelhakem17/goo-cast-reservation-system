import { useState } from "react";

export default function ImageLoader({
  src,
  alt,
  width,
  height,
  className = "",
  fit = "cover",
  placeholder = "https://placehold.co/400",
  sizes = "(max-width: 768px) 100vw, 50vw",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder Blur */}
      <img
        src={placeholder}
        alt="blur placeholder"
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-${fit} scale-105 blur-md ${
          loaded ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      />

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        srcSet={`${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-full w-full object-${fit} transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}
