"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/images/image-placeholder.svg";

function isSafeImageSource(source: string) {
  if (source.startsWith("/") && !source.startsWith("//")) return true;
  try {
    const url = new URL(source);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

type SafeImageProps = Omit<ImageProps, "src" | "onError" | "onLoad"> & {
  src?: string | null;
  fallbackSrc?: string;
  onError?: ImageProps["onError"];
  onLoad?: ImageProps["onLoad"];
};

export function SafeImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  onError,
  onLoad,
  ...props
}: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const candidate = src?.trim() || fallbackSrc;
  const imageSrc = isSafeImageSource(candidate) ? candidate : fallbackSrc;
  const failed = failedSrc === imageSrc;

  return (
    <Image
      {...props}
      src={failed ? fallbackSrc : imageSrc}
      alt={alt}
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
