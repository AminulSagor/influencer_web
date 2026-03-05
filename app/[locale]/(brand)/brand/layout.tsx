import { cookies } from "next/headers";
import BrandShell from "./_components/brand-shell";
import { decodeJwtPayload } from "@/storage/jwt_decoder";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? "";
  const payload = token ? decodeJwtPayload(token) : null;

  const isVerified = Boolean(payload?.isVerified);

  return <BrandShell isVerified={isVerified}>{children}</BrandShell>;
}
