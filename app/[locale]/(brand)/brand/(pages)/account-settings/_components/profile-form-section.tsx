"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import ProfileField from "./profile-field";
import { ProfileFormState } from "./profile-update-card";

type Props = {
  form: ProfileFormState;
  isEditing: boolean;
  isSaving: boolean;
  email: string;
  phone: string;
  nidNumber: string;
  binNumber: string;
  errors: Partial<Record<keyof ProfileFormState, string>>;
  onChange: (field: keyof ProfileFormState, value: string) => void;
};

const ProfileFormSection = ({
  form,
  isEditing,
  isSaving,
  email,
  phone,
  nidNumber,
  binNumber,
  errors,
  onChange,
}: Props) => {
  const t = useTranslations("brand.profile");
  const isDisabled = !isEditing || isSaving;

  return (
    <div className="space-y-6">
      <div className="grid gap-8 md:grid-cols-3">
        <ProfileField
          label={t("fields.brandName")}
          required
          error={errors.brandName}
        >
          <Input
            value={form.brandName}
            onChange={(e) => onChange("brandName", e.target.value)}
            disabled={isDisabled}
            placeholder={t("placeholders.brandName")}
            className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
          />
        </ProfileField>

        <ProfileField
          label={t("fields.firstName")}
          required
          error={errors.firstName}
        >
          <Input
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            disabled={isDisabled}
            placeholder={t("placeholders.firstName")}
            className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
          />
        </ProfileField>

        <ProfileField
          label={t("fields.lastName")}
          required
          error={errors.lastName}
        >
          <Input
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            disabled={isDisabled}
            placeholder={t("placeholders.lastName")}
            className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
          />
        </ProfileField>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <ProfileField label={t("fields.emailAddress")}>
          <Input
            value={email}
            readOnly
            className="h-10 border-light-green/25 bg-muted/30"
          />
        </ProfileField>

        <ProfileField label={t("fields.phoneNumber")}>
          <Input
            value={phone}
            readOnly
            className="h-10 border-light-green/25 bg-muted/30"
          />
        </ProfileField>

        <ProfileField label={t("fields.thana")} required error={errors.thana}>
          <Input
            value={form.thana}
            onChange={(e) => onChange("thana", e.target.value)}
            disabled={isDisabled}
            placeholder={t("placeholders.thana")}
            className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
          />
        </ProfileField>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <ProfileField label={t("fields.zilla")} required error={errors.zilla}>
          <Input
            value={form.zilla}
            onChange={(e) => onChange("zilla", e.target.value)}
            disabled={isDisabled}
            placeholder={t("placeholders.zilla")}
            className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
          />
        </ProfileField>

        <ProfileField label={t("fields.nidNumber")}>
          <Input
            value={nidNumber}
            readOnly
            className="h-10 border-light-green/25 bg-muted/30"
          />
        </ProfileField>

        <ProfileField label={t("fields.binNumber")}>
          <Input
            value={binNumber}
            readOnly
            className="h-10 border-light-green/25 bg-muted/30"
          />
        </ProfileField>
      </div>

      <ProfileField
        label={t("fields.fullAddress")}
        required
        error={errors.fullAddress}
      >
        <textarea
          value={form.fullAddress}
          onChange={(e) => onChange("fullAddress", e.target.value)}
          disabled={isDisabled}
          placeholder={t("placeholders.fullAddress")}
          className="min-h-[110px] w-full rounded-md border border-light-green/25 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-light-green/30 disabled:bg-muted/30"
        />
      </ProfileField>

      <ProfileField label={t("fields.website")} error={errors.website}>
        <Input
          value={form.website}
          onChange={(e) => onChange("website", e.target.value)}
          disabled={isDisabled}
          placeholder={t("fields.website")}
          className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
        />
      </ProfileField>
    </div>
  );
};

export default ProfileFormSection;
