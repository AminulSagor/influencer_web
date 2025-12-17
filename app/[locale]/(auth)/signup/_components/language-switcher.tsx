"use client";

import { usePathname, useRouter } from "next/navigation";

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();

  // detect current locale from URL
  const segments = pathname.split("/");
  const currentLocale = segments[1]; // [0] is empty string

  const changeLanguage = (locale: string) => {
    if (locale === currentLocale) return;

    // create a new array instead of modifying the existing segments
    const newSegments = [...segments];
    newSegments[1] = locale;
    const newPath = newSegments.join("/");
    router.push(newPath);
  };

  return (
    <div className="flex border border-light-gray p-1.5 rounded-full overflow-hidden">
      <button
        className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-full transition-colors duration-200
          ${
            currentLocale === "en"
              ? "bg-light-green text-white"
              : "text-Primary bg-white"
          }`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-full transition-colors duration-200
          ${
            currentLocale === "bn"
              ? "bg-light-green text-white"
              : "text-Primary bg-white"
          }`}
        onClick={() => changeLanguage("bn")}
      >
        বাং
      </button>
    </div>
  );
};

export default LanguageSwitcher;
