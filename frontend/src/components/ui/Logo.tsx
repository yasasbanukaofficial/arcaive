"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: number;
  textSize?: string;
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  textColor?: string;
  useNextImage?: boolean;
  href?: string;
}

export default function Logo({
  size = 20,
  textSize = "text-[14px]",
  showText = true,
  className = "",
  imageClassName = "",
  textClassName = "",
  textColor,
  useNextImage = false,
  href = "/overview",
}: LogoProps) {
  const content = (
    <div
      className={`flex items-center gap-2.5 group cursor-pointer ${className}`}
    >
      {useNextImage ? (
        <Image
          width={size}
          height={size}
          alt="arcaive-logo"
          src="/images/icon.png"
          unoptimized
          className={`transition-transform duration-500 ${imageClassName}`}
          style={{ width: size, height: size }}
        />
      ) : (
        <img
          src="/images/icon.png"
          alt="Arcaive"
          className={`object-contain transition-transform duration-500 ${imageClassName}`}
          style={{ width: size, height: size }}
        />
      )}
      {showText && (
        <span
          className={`${textSize} font-semibold tracking-tight ${textClassName}`}
          style={textColor ? { color: textColor } : undefined}
        >
          ARCAIVE
        </span>
      )}
    </div>
  );

  return (
    <Link href={href} className="inline-block">
      {content}
    </Link>
  );
}
