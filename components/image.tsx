import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';

interface ImageProps extends NextImageProps {
  fallbackSrc?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc || "/images/common-fallback.png");
  };

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};

export default Image;
