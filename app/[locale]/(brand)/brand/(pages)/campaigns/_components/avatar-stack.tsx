import Image from "next/image";
import React from "react";

type User = {
  name?: string;
  image?: string;
  type?: string;
};

type AvatarStackProps = {
  users?: User[];
  maxVisible?: number;
};

const fallbackColors = ["#7F7F7F", "#A3A3A3", "#D9D9D9"];

const AvatarStack: React.FC<AvatarStackProps> = ({ users, maxVisible = 3 }) => {
  if (users && users.length > 0) {
    const visibleUsers = users.slice(0, maxVisible);

    {
      /* Avatar stack */
    }
    return (
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center space-x-2">
          <div className="inline-flex -space-x-3 items-center">
            {visibleUsers.map((user, index) => (
              <Image
                key={index}
                src={user.image || "/avatar/avatar.png"}
                height={28}
                width={28}
                alt={user.name || "avatar"}
                className="h-8 w-8 rounded-full border-2 border-white"
              />
            ))}
            {/* First user name */}
          </div>
        </div>
        <span className="text-sm text-orange">
          {users[0].name || "User"} , {users.length > 1 && `+ ${users.length - 1}`}
        </span>{" "}
      </div>
    );
  }

  // Fallback stack if no users
  return (
    <div className="inline-flex items-center space-x-2">
      <div className="inline-flex -space-x-3 items-center">
        {Array.from({ length: maxVisible }).map((_, i) => (
          <span
            key={i}
            style={{ backgroundColor: fallbackColors[i] }}
            className={`h-7 w-7 rounded-full`}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarStack;
