"use client";

import { useTheme } from 'next-themes';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface ImageProps extends NextImageProps {
  fallbackSrc?: string;
}

const safeSrc = (src: NextImageProps['src']) => typeof src === 'string' && src.startsWith('./') ? src.replace('./', '/') : src;

const Image: React.FC<ImageProps> = ({ src, alt, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState(safeSrc(src));
  const { theme } = useTheme();

  useEffect(() => {
    setImgSrc(safeSrc(src));
  }, [theme, src]);

  const handleError = () => {
    setImgSrc(fallbackSrc || theme === "dark" ? "/images/fallback-dark.png" : "/images/fallback.png");
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
