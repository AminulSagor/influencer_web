"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

type Props = {
  nextstep: () => void;
};

type SignUpFormValues = {
  brandName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const SignUpStepTwo = ({ nextstep }: Props) => {
  const methods = useForm<SignUpFormValues>({
    defaultValues: {
      brandName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data); // API call here
    nextstep();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      {/* Left content */}
      <div className="md:w-1/2 lg:px-8">
        <h1 className="text-Primary text-[32px] lg:text-[38px] font-semibold">
          Ready to launch?
        </h1>
        <p className="text-[18px] text-Primary mt-2 font-normal">
          Lets grow your brand!
        </p>

        <h2 className="text-Primary text-[15px] font-semibold mt-3">
          Profile Details
        </h2>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {[
              {
                name: "brandName",
                label: "Brand Name*",
                placeholder: "enter your brand/Business Name",
              },
              {
                name: "firstName",
                label: "First Name*",
                placeholder: "enter your first name ",
              },
              {
                name: "lastName",
                label: "Last Name*",
                placeholder: "Enter your last name",
              },
              {
                name: "email",
                label: "Email Address*",
                placeholder: "Ex: johndoe@email.com",
                type: "email",
              },
              {
                name: "phone",
                label: "Phone Number*",
                placeholder: "Ex: +8801234567890",
              },
              {
                name: "password",
                label: "Password*",
                placeholder: "Min 8 characters long",
                type: "password",
              },
            ].map((field) => (
              <FormField
                key={field.name}
                control={methods.control}
                // Fixed the type issue by using field.name as keyof SignUpFormValues
                name={field.name as keyof SignUpFormValues}
                rules={{ required: `${field.label} is required` }}
                render={({ field: hookField }) => (
                  <FormItem>
                    <FormLabel className="text-light-green">
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        // Updated classes: increased padding-y, removed focus outlines
                        className="bg-white border py-4 focus:outline-none focus:border-white focus:ring-0 focus:ring-offset-0 focus:shadow-none"
                        {...hookField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="text-white bg-light-green h-12 w-full text-[18px]"
            >
              Continue
            </Button>
          </form>
        </Form>

        <p className="text-light-gray text-sm mt-5 text-center">
          Already have an account?{" "}
          <span className="text-black">
            <Link href="/login">Login</Link>
          </span>
        </p>
      </div>

      {/* Right image */}
      <div className="hidden md:block md:w-1/2 border border-light-green rounded-xl p-2">
        <Image
          src="/auth-images/step-2-brand-image.png"
          height={428}
          width={428}
          alt="brand-image"
        />
        <div className="text-Primary text-[30px] font-semibold text-center mt-4">
          <h1>Secure Payments & Milestones</h1>
        </div>
        <p className="text-Primary mt-4 text-[15px] text-center px-4">
          Manage campaigns with ease. Funds are held securely and released only
          when milestones are met.
        </p>
      </div>
    </div>
  );
};

export default SignUpStepTwo;
