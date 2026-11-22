"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/images/image-placeholder.svg";

type SafeImageProps = Omit<ImageProps, "src" | "onError" | "onLoad"> & {
  src?: string | null;
  onError?: ImageProps["onError"];
  onLoad?: ImageProps["onLoad"];
};

export function SafeImage({ src, onError, onLoad, ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src?.trim() || FALLBACK_IMAGE;
  const failed = failedSrc === imageSrc;

  return (
    <Image
      {...props}
      src={failed ? FALLBACK_IMAGE : imageSrc}
      unoptimized
      onError={(event) => {
        if (!failed) {
          setFailedSrc(imageSrc);
          onError?.(event);
        }
      }}
      onLoad={(event) => {
        if (!failed) onLoad?.(event);
      }}
    />
  );
}
