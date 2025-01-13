"use client";

import { useTheme } from 'next-themes';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface ImageProps extends NextImageProps {
  fallbackSrc?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const placeholderImage = theme === "dark" ? "/images/fallback-dark.png" : "/images/fallback.png";

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
  }, [theme, src]);

  const handleError = () => {
    setImgSrc(fallbackSrc || theme === "dark" ? "/images/fallback-dark.png" : "/images/fallback.png");
    setIsLoading(false);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      onError={handleError}
      onLoadingComplete={handleLoadingComplete}
      placeholder="blur"
      blurDataURL={placeholderImage}
      {...props}
      className={`transition-opacity duration-300 ${
        isLoading ? 'opacity-50' : 'opacity-100'
      } ${props.className || ''}`}
    />
  );
};

export default Image;