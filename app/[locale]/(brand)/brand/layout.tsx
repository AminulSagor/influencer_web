import { cookies } from "next/headers";

import BrandShell from "./_components/brand-shell";
import { decodeJwtPayload } from "@/helpers/helper";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? "";
  const payload = token ? decodeJwtPayload(token) : null;

  const isVerified = Boolean(payload?.isVerified);

  const { locale } = await params;

  return (
    <BrandShell locale={locale} isVerified={isVerified}>
      {children}
    </BrandShell>
  );
}
