import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const PrimaryButton = ({
  children,
  onClick,
  className,
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
        bg-light-green
        text-white 
        rounded-md
        text-sm w-full 
        px-4 py-2 
        hover:bg-[#6a8a4a] 
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
      {children}
    </button>
  );
};

export default PrimaryButton;
