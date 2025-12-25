import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const DottedButton = ({
  children,
  onClick,
  className = "text-sm w-full",
  type = "button",
  disabled = false,
}: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        text-light-green 
        border-light-green
        border-dashed
        border bg-white
        rounded-md 
        px-4 py-3 
        active:scale-[0.98]
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        transition-all 
        duration-200 
        font-medium
        cursor-pointer
        ${className}
      `}
      onClick={handleClick}
    >
     + {children}
    </button>
  );
};

export default DottedButton;
