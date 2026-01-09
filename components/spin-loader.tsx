import React from "react";
type Props = {
  className?: string;
};
const Loader = ({ className }: Props) => {
  return (
    <div
      className={`w-6 h-6 border-4 border-Primary border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
};

export default Loader;
