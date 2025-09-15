import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  onClick = () => {},
  width,
  height,
  style = {},
  effect = "blur",
  isFullWidth = true,
  whileHover,
  ...props
}) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect={effect}
      className={className}
      wrapperClassName={`flex items-center justify-center h-full ${isFullWidth && "w-full "}`}
      width={width}
      height={height}
      style={style}
      onClick={onClick}
      {...props}
    />
  );
};

export default OptimizedImage;
