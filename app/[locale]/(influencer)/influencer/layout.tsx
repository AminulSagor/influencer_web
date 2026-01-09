import { cookies } from "next/headers";
import { decodeJwtPayload } from "@/helpers/helper";
import InfluencerShell from "@/app/[locale]/(influencer)/influencer/_component/influencer-shell";

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
    <InfluencerShell locale={locale} isVerified={isVerified}>
      {children}
    </InfluencerShell>
  );
}
