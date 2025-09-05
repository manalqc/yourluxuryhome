"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

type LogoProps = {
  href?: string;
  size?: number; // pixel size for square logo
  className?: string;
  title?: string;
};

/**
 * Brand Logo rendered via Next/Image with a lightening blend mode so the black
 * background of the provided logo becomes visually transparent over dark areas.
 * For best results, replace /public/images/logo.png with a transparent PNG/SVG.
 */
export default function Logo({ href = "/", size = 36, className = "", title = "Your Luxury Home" }: LogoProps) {
  const img = (
    <Image
      src="/images/logo.svg"
      alt={title}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ display: "inline-block" }}
      priority
    />
  );

  return href ? (
    <Link href={href} aria-label={title} className="inline-flex items-center">
      {img}
    </Link>
  ) : (
    img
  );
}
