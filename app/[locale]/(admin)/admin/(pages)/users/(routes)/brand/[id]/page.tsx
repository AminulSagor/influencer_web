
interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  return <BrandVerificationClient userId={id} />;
};

export default page;