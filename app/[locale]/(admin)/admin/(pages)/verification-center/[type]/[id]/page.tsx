import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

import ApprovalProgress from "./_components/approval-progress";
import DeliveryLocationCard from "./_components/delivery-location-card";
import InfoCard from "./_components/info-card";
import NicheCard from "./_components/niche-card";
import NidInfoCard from "./_components/nid-info-card";
import PayoutSettings from "./_components/payout-setting";
import ProfileCompletionCard from "./_components/profile-completion-card";
import ProfileDetailsCard from "./_components/profile-details-card";
import SkillsCard from "./_components/skills-card";
import SocialLinksCard from "./_components/social-links-card";
import VerificationActionDocumentCard from "./_components/verification-action-document-card";
import VerificationDetailsBreadcrumb from "./_components/verification-details-breadcrumb";

import { getInfluencerProfile } from "@/service/admin/verification-center/influencer/get-influencer-profile";
import { getAgencyVerificationProfile } from "@/service/admin/verification-center/agency/get-agency-profile";
import { getBrandProfile } from "@/service/admin/verification-center/brand/get-brand-profile";

interface Props {
  params: Promise<{ type: string; id: string }>;
}

type CardStatus = "Pending" | "Rejected" | "Accepted";

type ApprovalStep = {
  label: string;
  status: "completed" | "pending";
  subtitle: string;
};

const mapStatus = (value?: string | null, isVerified?: boolean): CardStatus => {
  const normalized = (value ?? "").trim().toLowerCase();

  if (
    normalized === "accepted" ||
    normalized === "approved" ||
    normalized === "verified"
  ) {
    return "Accepted";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  if (normalized === "pending" || normalized === "unverified") {
    return "Pending";
  }

  return isVerified ? "Accepted" : "Pending";
};

const getTypeKey = (type: string) =>
  type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

const isApprovedStatus = (value?: string | null) => {
  const normalized = (value ?? "").trim().toLowerCase();

  return (
    normalized === "approved" ||
    normalized === "accepted" ||
    normalized === "verified"
  );
};

const getSimpleStep = (
  label: string,
  completed: boolean,
  completedText = "Approved"
): ApprovalStep => ({
  label,
  status: completed ? "completed" : "pending",
  subtitle: completed ? completedText : "Pending",
});

const getCountStep = (label: string, count: number): ApprovalStep => ({
  label,
  status: count > 0 ? "completed" : "pending",
  subtitle: count > 0 ? `${count} Approved` : "Pending",
});

const getPaymentStep = (items: { status?: string | null }[]): ApprovalStep => {
  const approved = items.filter((item) => isApprovedStatus(item.status)).length;
  const pending = items.length - approved;

  if (items.length === 0) {
    return {
      label: "Payment Setup",
      status: "pending",
      subtitle: "Pending",
    };
  }

  if (pending === 0) {
    return {
      label: "Payment Setup",
      status: "completed",
      subtitle: `${approved} Approved`,
    };
  }

  return {
    label: "Payment Setup",
    status: approved > 0 ? "completed" : "pending",
    subtitle:
      approved > 0
        ? `${approved} Approved, ${pending} Pending`
        : `${pending} Pending`,
  };
};

const Page = async ({ params }: Props) => {
  const { type, id } = await params;
  const typeKey = getTypeKey(type);

  if (!["Influencer", "Agency", "Brand", "Client"].includes(typeKey)) {
    notFound();
  }

  const normalizedTypeKey = typeKey === "Client" ? "Brand" : typeKey;

  let verificationUserId = "";

  let profile:
    | {
        name: string;
        location: string;
        bio: string;
        image?: string | null;
        profileCompletionPercent: number;
        socialHandles?: {
          instagram?: string;
          tiktok?: string;
          twitter?: string;
          youtube?: string;
        };
        verifiedStatus: "Unverified" | "Pending" | "Approved" | "Rejected";
      }
    | undefined;

  let niches:
    | {
        name: string;
        status: CardStatus;
        rejectReason?: string | null;
      }[]
    | undefined;

  let socialLinks:
    | {
        platform: string;
        handle: string;
        status: CardStatus;
        rejectReason?: string | null;
      }[]
    | undefined;

  let skills:
    | {
        name: string;
        status: CardStatus;
        rejectReason?: string | null;
      }[]
    | undefined;

  let payoutSettings: any[] = [];

  let nidInfo:
    | {
        nidNumber: string;
        backSideImageUrl: string;
        frontSideImageUrl: string;
        status?: CardStatus;
        rejectReason?: string | null;
      }
    | undefined;

  let personalInfo:
    | {
        email: string;
        firstName: string;
        lastName: string;
        location: string;
        phoneNumber: string;
        image?: string;
      }
    | undefined;

  let deliveryLocations:
    | {
        title: string;
        address: string;
      }[]
    | undefined;

  let approvalSteps: ApprovalStep[] = [];

  let agencyDocumentData:
    | {
        tradeLicenseNumber: string;
        tradeLicenseImage: string;
        tradeLicenseStatus?: CardStatus;
        tradeLicenseRejectReason?: string | null;
        tinNumber: string;
        tinImage: string;
        tinStatus?: CardStatus;
        tinRejectReason?: string | null;
        binNumber: string;
        binStatus?: CardStatus;
        binRejectReason?: string | null;
      }
    | undefined;

  let brandDocumentData:
    | {
        tradeLicenseNumber: string;
        tradeLicenseImg: string;
        tradeLicenseStatus?: CardStatus;
        tradeLicenseRejectReason?: string | null;
        tinNumber: string;
        tinImage: string;
        tinStatus?: CardStatus;
        tinRejectReason?: string | null;
        binNumber: string;
        binStatus?: CardStatus;
        binRejectReason?: string | null;
      }
    | undefined;

  if (normalizedTypeKey === "Influencer") {
    const data = await getInfluencerProfile(id);

    if (!data?.userId) notFound();

    verificationUserId = data.userId;

    const primaryAddress = data.addresses?.[0];
    const location = [
      primaryAddress?.thana,
      primaryAddress?.zilla,
      primaryAddress?.country,
    ]
      .filter(Boolean)
      .join(", ");

    const instagram = data.socialLinks?.find(
      (item) => item.platform?.toLowerCase() === "instagram"
    )?.url;

    const tiktok = data.socialLinks?.find(
      (item) => item.platform?.toLowerCase() === "tiktok"
    )?.url;

    const twitter = data.socialLinks?.find((item) =>
      ["twitter", "x"].includes(item.platform?.toLowerCase() ?? "")
    )?.url;

    const youtube = data.socialLinks?.find(
      (item) => item.platform?.toLowerCase() === "youtube"
    )?.url;

    profile = {
      name: data.fullName || "N/A",
      location: location || "N/A",
      bio: data.bio || "N/A",
      image: data.profileImg || null,
      profileCompletionPercent: data.isOnboardingComplete ? 100 : 0,
      verifiedStatus: data.isVerified ? "Approved" : "Unverified",
      socialHandles: {
        instagram: instagram || undefined,
        tiktok: tiktok || undefined,
        twitter: twitter || undefined,
        youtube: youtube || undefined,
      },
    };

    niches = (data.niches ?? []).map((item) => ({
      name: item.niche || "N/A",
      status: mapStatus(item.status),
      rejectReason: item.rejectReason ?? null,
    }));

    skills = (data.skills ?? []).map((item) => ({
      name: item.skill || "N/A",
      status: mapStatus(item.status),
      rejectReason: item.rejectReason ?? null,
    }));

    socialLinks = (data.socialLinks ?? []).map((item) => ({
      platform: item.platform || "N/A",
      handle: item.url || "N/A",
      status: mapStatus(item.status),
      rejectReason: item.rejectReason ?? null,
    }));

    payoutSettings = [
      ...(data.payouts?.bank ?? []).map((item, index) => ({
        id: `bank-${index}-${item.bankAccNo}`,
        type: "Bank Account" as const,
        bankName: item.bankName || "",
        accountHolder: item.bankAccHolderName || "",
        accountNumber: item.bankAccNo || "",
        routingNumber: item.bankRoutingNo || "",
        branchName: item.bankBranchName || "",
        status: mapStatus(item.accStatus),
      })),
      ...(data.payouts?.mobileBanking ?? []).map((item, index) => ({
        id: `mobile-${index}-${item.accountNo}`,
        type: "Bkash" as const,
        phoneNumber: item.accountNo || "",
        accountHolder: item.accountHolderName || "",
        status: mapStatus(item.accStatus),
      })),
    ];

    nidInfo = {
      nidNumber: data.nidNumber || "N/A",
      backSideImageUrl: data.nidBackImg || "",
      frontSideImageUrl: data.nidFrontImg || "",
      status: mapStatus(data.nidVerification?.nidStatus),
      rejectReason: data.nidVerification?.nidRejectReason ?? null,
    };

    personalInfo = {
      email: data.email || "N/A",
      firstName: data.firstName || "N/A",
      lastName: data.lastName || "N/A",
      location: location || "N/A",
      phoneNumber: data.phone || "N/A",
      image: data.profileImg || "",
    };

    deliveryLocations = (data.addresses ?? []).map((address) => ({
      title: address.addressName || "Address",
      address: [
        address.fullAddress,
        address.thana,
        address.zilla,
        address.country,
      ]
        .filter(Boolean)
        .join(", "),
    }));

    const allPayments = [
      ...(data.payouts?.bank ?? []),
      ...(data.payouts?.mobileBanking ?? []),
    ].map((item: any) => ({
      status: item.status ?? item.accStatus,
    }));

    approvalSteps = [
      getCountStep(
        "Niches",
        (data.niches ?? []).filter((item) => isApprovedStatus(item.status))
          .length
      ),
      getCountStep(
        "Social Links",
        (data.socialLinks ?? []).filter((item) =>
          isApprovedStatus(item.status)
        ).length
      ),
      getCountStep(
        "Skills",
        (data.skills ?? []).filter((item) => isApprovedStatus(item.status))
          .length
      ),
      getSimpleStep("NID", isApprovedStatus(data.nidVerification?.nidStatus)),
      getPaymentStep(allPayments),
      getSimpleStep("Email", !!data.isEmailVerified),
    ];
  }

  if (normalizedTypeKey === "Agency") {
    const data = await getAgencyVerificationProfile(id);

    if (!data?.userId) notFound();

    verificationUserId = data.userId;

    const location = [data.address?.thana, data.address?.zilla]
      .filter(Boolean)
      .join(", ");

    const instagram = data.socialLinks?.find(
      (item) => item.platform?.toLowerCase() === "instagram"
    )?.url;

    const tiktok = data.socialLinks?.find(
      (item) => item.platform?.toLowerCase() === "tiktok"
    )?.url;

    const twitter = data.socialLinks?.find((item) =>
      ["twitter", "x"].includes(item.platform?.toLowerCase() ?? "")
    )?.url;

    profile = {
      name: data.agencyName || "N/A",
      location: location || "N/A",
      bio: data.agencyBio || "N/A",
      image: data.logo || null,
      profileCompletionPercent: data.isOnboardingComplete ? 100 : 0,
      verifiedStatus: data.isVerified ? "Approved" : "Unverified",
      socialHandles: {
        instagram: instagram || undefined,
        tiktok: tiktok || undefined,
        twitter: twitter || undefined,
      },
    };

    niches = (data.niches ?? []).map((item) => ({
      name: item.niche || "N/A",
      status: mapStatus(item.status),
      rejectReason: item.rejectReason ?? null,
    }));

    socialLinks = (data.socialLinks ?? []).map((item) => ({
      platform: item.platform || "N/A",
      handle: item.url || "N/A",
      status: mapStatus(item.status),
      rejectReason: item.rejectReason ?? null,
    }));

    payoutSettings = [
      ...(data.payouts?.bank ?? []).map((item, index) => ({
        id: `agency-bank-${index}-${item.bankAccNo}`,
        type: "Bank Account" as const,
        bankName: item.bankName || "",
        accountHolder: item.bankAccHolderName || "",
        accountNumber: item.bankAccNo || "",
        routingNumber: item.bankRoutingNo || "",
        branchName: item.bankBranchName || "",
        status: mapStatus(item.accStatus),
      })),
      ...(data.payouts?.mobileBanking ?? []).map((item, index) => ({
        id: `agency-mobile-${index}-${item.accountNo}`,
        type: "Bkash" as const,
        phoneNumber: item.accountNo || "",
        accountHolder: item.accountHolderName || "",
        status: mapStatus(item.accStatus),
      })),
    ];

    nidInfo = {
      nidNumber: data.nidNumber || "N/A",
      backSideImageUrl: data.nidBackImg || "",
      frontSideImageUrl: data.nidFrontImg || "",
      status: mapStatus(data.nidVerification?.nidStatus),
      rejectReason: data.nidVerification?.nidRejectReason ?? null,
    };

    personalInfo = {
      email: data.email || "N/A",
      firstName: data.firstName || "N/A",
      lastName: data.lastName || "N/A",
      location: location || "N/A",
      phoneNumber: data.phone || "N/A",
      image: data.logo || "",
    };

    const allPayments = [
      ...(data.payouts?.bank ?? []),
      ...(data.payouts?.mobileBanking ?? []),
    ].map((item: any) => ({
      status: item.accStatus,
    }));

    approvalSteps = [
      getCountStep(
        "Niches",
        (data.niches ?? []).filter((item) => isApprovedStatus(item.status))
          .length
      ),
      getCountStep(
        "Social Links",
        (data.socialLinks ?? []).filter((item) =>
          isApprovedStatus(item.status)
        ).length
      ),
      getSimpleStep("NID", isApprovedStatus(data.nidVerification?.nidStatus)),
      getSimpleStep(
        "Trade License",
        isApprovedStatus(data.tradeLicenseVerification?.tradeLicenseStatus)
      ),
      getSimpleStep("TIN", isApprovedStatus(data.tinVerification?.tinStatus)),
      getSimpleStep("BIN", isApprovedStatus(data.binVerification?.binStatus)),
      getPaymentStep(allPayments),
      getSimpleStep("Email", !!data.isEmailVerified),
    ];

    agencyDocumentData = {
      tradeLicenseNumber: data.tradeLicenseNumber || "N/A",
      tradeLicenseImage: data.tradeLicenseImage || "",
      tradeLicenseStatus: mapStatus(
        data.tradeLicenseVerification?.tradeLicenseStatus
      ),
      tradeLicenseRejectReason:
        data.tradeLicenseVerification?.tradeLicenseRejectReason ?? null,
      tinNumber: data.tinNumber || "N/A",
      tinImage: data.tinImage || "",
      tinStatus: mapStatus(data.tinVerification?.tinStatus),
      tinRejectReason: data.tinVerification?.tinRejectReason ?? null,
      binNumber: data.binNumber || "N/A",
      binStatus: mapStatus(data.binVerification?.binStatus),
      binRejectReason: data.binVerification?.binRejectReason ?? null,
    };
  }

  if (normalizedTypeKey === "Brand") {
    const data = await getBrandProfile(id);

    if (!data?.userId) notFound();

    verificationUserId = data.userId;

    const location = [data.thana, data.zilla, data.country]
      .filter(Boolean)
      .join(", ");

    const instagram = data.socialLinks?.find(
      (item: any) => item.platform?.toLowerCase() === "instagram"
    )?.url;

    const tiktok = data.socialLinks?.find(
      (item: any) => item.platform?.toLowerCase() === "tiktok"
    )?.url;

    const twitter = data.socialLinks?.find((item: any) =>
      ["twitter", "x"].includes(item.platform?.toLowerCase() ?? "")
    )?.url;

    profile = {
      name: data.brandName || "N/A",
      location: location || "N/A",
      bio: data.website || data.fullAddress || "N/A",
      image: data.profileImg || null,
      profileCompletionPercent: data.isOnboardingComplete ? 100 : 0,
      verifiedStatus: data.isVerified ? "Approved" : "Unverified",
      socialHandles: {
        instagram: instagram || undefined,
        tiktok: tiktok || undefined,
        twitter: twitter || undefined,
      },
    };

    niches = [];
    skills = undefined;
    payoutSettings = [];

    socialLinks = (data.socialLinks ?? []).map((item: any) => ({
      platform: item?.platform || "N/A",
      handle: item?.url || "N/A",
      status: mapStatus(item?.status),
      rejectReason: item?.rejectReason ?? null,
    }));

    nidInfo = {
      nidNumber: data.nidNumber || "N/A",
      backSideImageUrl: data.nidBackImg || "",
      frontSideImageUrl: data.nidFrontImg || "",
      status: mapStatus(data.nidVerification?.nidStatus),
      rejectReason: data.nidVerification?.nidRejectReason ?? null,
    };

    personalInfo = {
      email: data.email || "N/A",
      firstName: data.firstName || "N/A",
      lastName: data.lastName || "N/A",
      location: location || "N/A",
      phoneNumber: data.phone || "N/A",
      image: data.profileImg || "",
    };

    approvalSteps = [
      getCountStep(
        "Social Links",
        (data.socialLinks ?? []).filter((item: any) =>
          isApprovedStatus(item?.status)
        ).length
      ),
      getSimpleStep("NID", isApprovedStatus(data.nidVerification?.nidStatus)),
      getSimpleStep(
        "Trade License",
        isApprovedStatus(data.tradeLicenseVerification?.tradeLicenseStatus)
      ),
      getSimpleStep("TIN", isApprovedStatus(data.tinVerification?.tinStatus)),
      getSimpleStep("BIN", isApprovedStatus(data.binVerification?.binStatus)),
      getSimpleStep("Email", !!data.isEmailVerified),
    ];

    brandDocumentData = {
      tradeLicenseNumber: data.tradeLicenseNumber || "N/A",
      tradeLicenseImg: data.tradeLicenseImg || "",
      tradeLicenseStatus: mapStatus(
        data.tradeLicenseVerification?.tradeLicenseStatus
      ),
      tradeLicenseRejectReason:
        data.tradeLicenseVerification?.tradeLicenseRejectReason ?? null,
      tinNumber: data.tinNumber || "N/A",
      tinImage: data.tinImage || "",
      tinStatus: mapStatus(data.tinVerification?.tinStatus),
      tinRejectReason: data.tinVerification?.tinRejectReason ?? null,
      binNumber: data.binNumber || "N/A",
      binStatus: mapStatus(data.binVerification?.binStatus),
      binRejectReason: data.binVerification?.binRejectReason ?? null,
    };
  }

  if (!profile) {
    return <p>Verification data not found</p>;
  }

  const isInfluencer = normalizedTypeKey === "Influencer";
  const isAgency = normalizedTypeKey === "Agency";
  const isBrand = normalizedTypeKey === "Brand";

  return (
    <div className="p-4 space-y-4">
      <VerificationDetailsBreadcrumb
        type={normalizedTypeKey}
        name={profile.name}
      />

      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 md:col-span-6 h-full">
          <InfoCard
            name={profile.name}
            location={profile.location}
            image={profile.image}
            verifiedStatus={profile.verifiedStatus}
            socialHandles={profile.socialHandles}
          />
        </div>

        <div className="col-span-12 md:col-span-6 h-full">
          <ProfileCompletionCard
            bioText={profile.bio}
            progress={profile.profileCompletionPercent}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ApprovalProgress steps={approvalSteps} />
        </div>
      </div>

      {isInfluencer && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <NicheCard
              userId={verificationUserId}
              niches={niches ?? []}
              verificationType="influencer"
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <SocialLinksCard
              userId={verificationUserId}
              socialLinks={socialLinks ?? []}
              verificationType="influencer"
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <SkillsCard userId={verificationUserId} skills={skills ?? []} />
          </div>
        </div>
      )}

      {isAgency && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <NicheCard
              userId={verificationUserId}
              niches={niches ?? []}
              verificationType="agency"
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <SocialLinksCard
              userId={verificationUserId}
              socialLinks={socialLinks ?? []}
              verificationType="agency"
            />
          </div>
        </div>
      )}

      {isBrand && (
        <>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <SocialLinksCard
                userId={verificationUserId}
                socialLinks={socialLinks ?? []}
                verificationType="client"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <NidInfoCard
                userId={verificationUserId}
                verificationType="client"
                nidInfo={
                  nidInfo ?? {
                    nidNumber: "N/A",
                    backSideImageUrl: "",
                    frontSideImageUrl: "",
                    status: "Pending",
                    rejectReason: null,
                  }
                }
              />

              <ProfileDetailsCard
                type="Brand"
                personalInfo={
                  personalInfo ?? {
                    email: "N/A",
                    firstName: "N/A",
                    lastName: "N/A",
                    location: "N/A",
                    phoneNumber: "N/A",
                  }
                }
              />
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-4">
              <VerificationActionDocumentCard
                userId={verificationUserId}
                verificationType="client"
                docType="trade-license"
                title="Trade License"
                numberLabel="Trade License Number"
                numberValue={brandDocumentData?.tradeLicenseNumber || "N/A"}
                imageUrl={brandDocumentData?.tradeLicenseImg || ""}
                status={brandDocumentData?.tradeLicenseStatus || "Pending"}
                rejectReason={brandDocumentData?.tradeLicenseRejectReason ?? null}
              />

              <VerificationActionDocumentCard
                userId={verificationUserId}
                verificationType="client"
                docType="tin"
                title="TIN Certificate"
                numberLabel="TIN Number"
                numberValue={brandDocumentData?.tinNumber || "N/A"}
                imageUrl={brandDocumentData?.tinImage || ""}
                status={brandDocumentData?.tinStatus || "Pending"}
                rejectReason={brandDocumentData?.tinRejectReason ?? null}
              />

              <VerificationActionDocumentCard
                userId={verificationUserId}
                verificationType="client"
                docType="bin"
                title="BIN"
                numberLabel="BIN Number"
                numberValue={brandDocumentData?.binNumber || "N/A"}
                imageUrl=""
                status={brandDocumentData?.binStatus || "Pending"}
                rejectReason={brandDocumentData?.binRejectReason ?? null}
              />
            </div>
          </div>
        </>
      )}

      {!isBrand && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <PayoutSettings
              userId={verificationUserId}
              payoutSettings={payoutSettings}
              verificationType={isAgency ? "agency" : "influencer"}
            />
          </div>

          <div className="col-span-12 md:col-span-8 space-y-4">
            <NidInfoCard
              userId={verificationUserId}
              verificationType={isAgency ? "agency" : "influencer"}
              nidInfo={
                nidInfo ?? {
                  nidNumber: "N/A",
                  backSideImageUrl: "",
                  frontSideImageUrl: "",
                  status: "Pending",
                  rejectReason: null,
                }
              }
            />

            <ProfileDetailsCard
              type={normalizedTypeKey}
              personalInfo={
                personalInfo ?? {
                  email: "N/A",
                  firstName: "N/A",
                  lastName: "N/A",
                  location: "N/A",
                  phoneNumber: "N/A",
                }
              }
            />
          </div>
        </div>
      )}

      {isInfluencer ? (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <DeliveryLocationCard locations={deliveryLocations ?? []} />
          </div>
        </div>
      ) : isAgency ? (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <VerificationActionDocumentCard
              userId={verificationUserId}
              verificationType="agency"
              docType="trade-license"
              title="Trade License"
              numberLabel="Trade License Number"
              numberValue={agencyDocumentData?.tradeLicenseNumber || "N/A"}
              imageUrl={agencyDocumentData?.tradeLicenseImage || ""}
              status={agencyDocumentData?.tradeLicenseStatus || "Pending"}
              rejectReason={agencyDocumentData?.tradeLicenseRejectReason ?? null}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <VerificationActionDocumentCard
              userId={verificationUserId}
              verificationType="agency"
              docType="tin"
              title="TIN Certificate"
              numberLabel="TIN Number"
              numberValue={agencyDocumentData?.tinNumber || "N/A"}
              imageUrl={agencyDocumentData?.tinImage || ""}
              status={agencyDocumentData?.tinStatus || "Pending"}
              rejectReason={agencyDocumentData?.tinRejectReason ?? null}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <VerificationActionDocumentCard
              userId={verificationUserId}
              verificationType="agency"
              docType="bin"
              title="BIN"
              numberLabel="BIN Number"
              numberValue={agencyDocumentData?.binNumber || "N/A"}
              imageUrl=""
              status={agencyDocumentData?.binStatus || "Pending"}
              rejectReason={agencyDocumentData?.binRejectReason ?? null}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Page;