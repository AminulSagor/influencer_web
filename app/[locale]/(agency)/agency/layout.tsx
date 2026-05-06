import { cookies } from "next/headers";
import { decodeJwtPayload } from "@/storage/jwt_decoder";
import AgencyShell from "@/app/[locale]/(agency)/agency/_component/agency.shell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? "";
  const payload = token ? decodeJwtPayload(token) : null;

  const isVerified = Boolean(payload?.isVerified);

  return <AgencyShell isVerified={isVerified}>{children}</AgencyShell>;
}
