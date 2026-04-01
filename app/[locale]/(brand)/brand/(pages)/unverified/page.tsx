import { cookies } from "next/headers";
import { decodeJwtPayload } from "@/storage/jwt_decoder";
import UnverifiedContent from "@/app/[locale]/(brand)/brand/_components/unverified-content";

type Role = "client" | "agency" | "admin" | "influencer";

export default async function UnverifiedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role as Role | undefined;

  return <UnverifiedContent role={role} />;
}
