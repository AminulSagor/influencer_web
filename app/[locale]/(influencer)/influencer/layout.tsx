import { cookies } from "next/headers";
import { decodeJwtPayload } from "@/helpers/helper";
import InfluencerShell from "@/app/[locale]/(influencer)/influencer/_component/influencer-shell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? "";
  const payload = token ? decodeJwtPayload(token) : null;

  const isVerified = Boolean(payload?.isVerified);

  return <InfluencerShell isVerified={isVerified}>{children}</InfluencerShell>;
}
