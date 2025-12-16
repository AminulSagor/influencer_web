"use client";
import SignUpStepOne from "@/components/signup-step-one";
import { useState } from "react";

const SignUpPage = () => {
  const [step, setStep] = useState<number>(1);
  return <div>{step === 1 ? <SignUpStepOne /> : <div>he</div>}</div>;
};

export default SignUpPage;
