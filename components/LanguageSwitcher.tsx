"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LanguageSwitcher = () => {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    const cookieLocale = document.cookie.match(/locale=([^;]*)/)?.[1] || "en";
    setCurrentLocale(cookieLocale);
  }, []);

  const handleChangeLanguage = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/`;
    setCurrentLocale(newLocale);

    const direction = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", direction);

    router.refresh();
  };

  return (
    <div>
      <Select value={currentLocale} onValueChange={handleChangeLanguage}>
        <SelectTrigger className="select-lang border-none max-w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en" className="cursor-pointer">
              <div className="flex items-center gap-3">
                <span>English</span>
              </div>
            </SelectItem>
            <SelectItem value="ar" className="cursor-pointer">
              <div className="flex items-center gap-3">
                <span>عربى</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
