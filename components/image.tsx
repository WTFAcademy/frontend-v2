"use client";

import { useTheme } from "next-themes";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState, useEffect } from "react";

interface ImageProps extends NextImageProps {
  fallbackSrc?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    setImgSrc(src);
  }, [theme, src]);

  const handleError = () => {
    setImgSrc(
      fallbackSrc ||
        (theme === "dark" ? "/images/fallback-dark.png" : "/images/fallback.png")
    );
    setIsLoading(false);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const api = process.env.NEXT_PUBLIC_API_URL;
  const materialPrefix = api && api.replace(/\/v1\/?$/, "/v1/material/");
  const academyMaterial = typeof imgSrc === "string" && !!materialPrefix && imgSrc.startsWith(materialPrefix);
  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      onError={handleError}
      onLoad={handleLoadingComplete}
      {...props}
      unoptimized={academyMaterial || props.unoptimized}
      className={`transition-opacity duration-300 ${
        isLoading ? "opacity-50" : "opacity-100"
      } ${props.className || ""}`}
    />
  );
};

export default Image;
