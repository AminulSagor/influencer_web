"use client";

import Image from "next/image";

type RatingAvatarProps = {
  name: string;
  image: string | null;
  size?: number;
};

export default function RatingAvatar({
  name,
  image,
  size = 48,
}: RatingAvatarProps) {
  if (image) {
    return (
      <div
        className="relative overflow-hidden rounded-full bg-[#E7E6C8]"
        style={{ width: size, height: size }}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-[#D9DEB3] to-[#F3F3DD] text-sm font-semibold text-[#456A2C]"
      style={{ width: size, height: size }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}