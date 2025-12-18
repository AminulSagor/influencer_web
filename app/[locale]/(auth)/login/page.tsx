import { useTranslations } from "next-intl";
import LoginForm from "@/app/[locale]/(auth)/login/_components/login-form";

const LoginPage = () => {
  const t = useTranslations("login");

  return (
    <div className="md:flex items-center justify-center">
      <div className="bg-white max-w-255 md:min-w-2xl rounded-md shadow-md p-4 md:p-6 lg:px-9 min-h-190 h-full mx-auto flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl text-Primary font-semibold text-center">
          {t("title")}
        </h1>
        <p className="text-lg text-light-green text-center mt-2">
          {t("subtitle")}
        </p>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
