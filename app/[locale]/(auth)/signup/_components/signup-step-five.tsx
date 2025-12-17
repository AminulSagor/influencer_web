import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type Props = {
  nextStep: () => void;
};

const SignUpStepFive = ({ nextStep }: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      <div className="md:w-1/2">
        <div className="flex flex-col md:items-center text-start">
          <div className="md:w-auto lg:w-full lg:pl-16">
            <h1 className="text-Primary text-[52px] font-semibold">
              Hello, Partner!
            </h1>
            <p className="text-[23px] text-light-green font-semibold">
              Establish Your Business Presence
            </p>
          </div>
          <p className="text-[18px] text-primary">
            Let&apos;s get your office location registered to connect with local
            and regional talents!
          </p>

          <Button
            className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full sm:w-78.5 text-[18px] mt-10"
            onClick={() => nextStep()}
          >
            Continue
          </Button>
        </div>
        <p className="text-light-gray text-sm mt-5 text-center">
          Already have an account?{" "}
          <span className="text-black">
            <Link href={"/login"}>Login</Link>
          </span>
        </p>
      </div>

      <div className="hidden md:block border border-light-green rounded-xl p-2 w-1/2">
        <Image
          src={"/auth-images/step-1-brand-image.png"}
          height={428}
          width={428}
          alt="brand-image"
        />
        <div className="text-Primary text-[30px] font-semibold flex flex-col items-center justify-center">
          <h1 className="text-center">Connect with Top </h1>
          <h1>Talent & Brands</h1>
        </div>
        <p className="text-Primary mt-6 text-[15px] text-center px-4 lg:px-8">
          The ultimate marketplace connecting visionary brands with verified
          influencers and agencies.
        </p>

        {/*  language swticher */}
        {/* language switcher */}
        <div className="flex justify-center mt-6">
          <div className="flex border border-light-gray p-1.5 rounded-full overflow-hidden">
            <button className="px-6 py-2 bg-light-green text-white text-sm rounded-full font-medium cursor-pointer">
              EN
            </button>
            <button className="px-4 py-2 text-Primary text-sm font-medium cursor-pointer">
              বাং
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpStepFive;
