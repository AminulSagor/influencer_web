import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const Home = async ({ params }: Props) => {
  const { locale } = await params;
  redirect(`/${locale}/signup`);
};

export default Home;
