import React from "react";
type Props = {
  className?: string;
};
const Loader = ({ className = "w-6 h-6" }: Props) => {
  return (
    <div
      className={`border-4 border-Primary border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
};

export default Loader;
