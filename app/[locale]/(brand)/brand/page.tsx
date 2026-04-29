import { redirect } from "next/navigation";

type BrandIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BrandIndexPage({ params }: BrandIndexPageProps) {
  const { locale } = await params;

  redirect(`/${locale}/brand/dashboard`);
}
