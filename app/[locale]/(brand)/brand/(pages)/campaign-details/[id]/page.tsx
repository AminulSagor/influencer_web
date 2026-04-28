import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale, id } = await params;

  redirect(`/${locale}/brand/campaign-details/${id}/details`);
}
