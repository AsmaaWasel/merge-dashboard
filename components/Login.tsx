import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("login")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("emailAndPass")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" dir="ltr" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href={"/dashboard"} className="w-full">
            <Button className="w-full">{t("loginSubmite")}</Button>
          </Link>
          <div className="flex justify-between gap-1 text-sm">
            <a href="#" className="text-primary hover:underline">
              {t("forgetPass")}
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
