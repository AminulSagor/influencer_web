type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const SecondaryButton = ({
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
        bg-[#F8F8F8]
        border
        border-light-gray
        text-black
        text-sm w-full
        rounded-md 
        px-4 py-2 
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

export default SecondaryButton;
