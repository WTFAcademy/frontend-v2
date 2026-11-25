"use client";

import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from "../../../components/image";
import "react-photo-view/dist/react-photo-view.css";

/**
 * Client island for markdown images: same zoomable PhotoView markup the
 * client <Markdown /> renders, usable from the server markdown renderer.
 */
const MarkdownImage = ({ src, alt }: { src: string; alt?: string }) => {
  // next/image throws on srcs that are neither absolute URLs nor
  // root-relative paths — a contributor typo must not crash the whole
  // chapter's SSR, so fall back to a plain <img> in the same wrapper.
  if (!src || !/^(https?:\/\/|\/)/.test(src)) {
    return (
      <div className="flex justify-center items-center my-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          className="object-contain w-full h-auto max-h-[500px] rounded overflow-hidden"
        />
      </div>
    );
  }

  return (
    <PhotoProvider>
      <PhotoView key={src} src={src}>
        <div className="flex justify-center items-center cursor-zoom-in my-4">
          <Image
            src={src}
            alt={alt || ""}
            width={1200}
            height={800}
            className="object-contain w-full h-auto max-h-[500px] rounded overflow-hidden"
            priority={false}
            quality={75}
            sizes="100vw"
          />
        </div>
      </PhotoView>
    </PhotoProvider>
  );
};

export default MarkdownImage;
