import ForgotPasswordForm from "@/app/[locale]/(auth)/login/_components/forgot-password-form";
import { Fragment } from "react/jsx-runtime";
import { useTranslations } from "next-intl";

type Props = {
  nextStep: () => void;
};

const ForgotPasswordStepOne = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword.stepOne");

  return (
    <Fragment>
      <h1 className="text-[28px] md:text-4xl text-Primary font-semibold text-center">
        {t("title")}
      </h1>
      <p className="text-base text-light-green text-center mt-2 pb-10 px-4 md:px-0">
        {t("subtitle")}
      </p>

      <ForgotPasswordForm nextStep={nextStep} />
    </Fragment>
  );
};

export default ForgotPasswordStepOne;
