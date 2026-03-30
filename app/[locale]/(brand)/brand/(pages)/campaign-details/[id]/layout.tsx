import CampaignDetailsProvider from "./_components/campaign-details-provider";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <CampaignDetailsProvider>{children}</CampaignDetailsProvider>;
}
