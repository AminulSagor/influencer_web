import { GoArrowLeft } from "react-icons/go";

const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white max-w-255 mx-auto rounded-md shadow-md p-4 md:p-6 lg:p-8 min-h-205.5">
      <button className="text-Primary">
        <GoArrowLeft size={23} />
      </button>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default SignUpLayout;
