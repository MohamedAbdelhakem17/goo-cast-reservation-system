import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const OptimizedImage = ({
  src = null,
  alt,
  className = "",
  onClick = () => {},
  width,
  height,
  style = {},
  effect = "opacity",
  isFullWidth = true,
  whileHover,
  threshold = 100,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative ${isFullWidth ? "w-full" : ""} flex h-full items-center justify-center overflow-hidden`}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="border-t-main h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 dark:border-t-red-500"></div>
        </div>
      )}
      <LazyLoadImage
        src={src}
        alt={alt}
        effect={effect}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        wrapperClassName={`flex items-center justify-center h-full ${isFullWidth && "w-full "}`}
        width={width}
        height={height}
        style={style}
        onClick={onClick}
        threshold={threshold}
        beforeLoad={() => setIsLoaded(false)}
        afterLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Failed to load image
          </span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
