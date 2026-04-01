import Image from "next/image";
import React from "react";

type User = {
  name?: string;
  image?: string | null;
  type?: string;
};

type AvatarStackProps = {
  users?: User[];
  maxVisible?: number;
};

const fallbackColors = ["#7F7F7F", "#A3A3A3", "#D9D9D9"];
const FALLBACK_AVATAR = "/avatar/avatar.png";

const AvatarStack: React.FC<AvatarStackProps> = ({ users, maxVisible = 3 }) => {
  const validUsers = (users ?? []).filter((user) => user?.name || user?.image);
  const visibleUsers = validUsers.slice(0, maxVisible);

  const getSafeImageSrc = (image?: string | null) => {
    const trimmed = image?.trim();

    if (!trimmed) {
      return FALLBACK_AVATAR;
    }

    return trimmed;
  };

  if (validUsers.length > 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center space-x-2">
          <div className="inline-flex -space-x-3 items-center">
            {visibleUsers.map((user, index) => (
              <Image
                key={`${user.name ?? "user"}-${index}`}
                src={getSafeImageSrc(user.image)}
                width={28}
                height={28}
                alt={user.name || "avatar"}
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
                unoptimized={
                  !!user.image
                    ?.trim()
                    ?.startsWith(
                      "https://influencer-mediafiles.s3.ap-south-1.amazonaws.com",
                    )
                }
              />
            ))}
          </div>
        </div>

        <span className="text-sm text-orange">
          {validUsers[0]?.name || "User"}
          {validUsers.length > 1 ? `, + ${validUsers.length - 1}` : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-2">
      <div className="inline-flex -space-x-3 items-center">
        {Array.from({ length: maxVisible }).map((_, i) => (
          <span
            key={i}
            style={{ backgroundColor: fallbackColors[i] }}
            className="h-7 w-7 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarStack;
