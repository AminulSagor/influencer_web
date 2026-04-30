"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SavedLocation } from "./delivery-location";
import ZillaThanaFields from "@/components/location/zilla-thana-fields";
import { addAddress, updateAddress } from "@/service/influencer/address/address";
import { addressSchema, AddressFormData } from "@/schemas/influencer/address-validation";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingLocation?: SavedLocation | null;
  onSuccess: () => void;
};

const AddEditLocationDialog = ({ open, onOpenChange, editingLocation, onSuccess }: Props) => {
  const t = useTranslations("influencer.campaign-details");

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressName: "",
      zilla: "",
      thana: "",
      fullAddress: "",
    },
  });

  const [saving, setSaving] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);

  const selectedZilla = form.watch("zilla");
  const selectedThana = form.watch("thana");

  /* ---------------- Initialize form based on editingLocation ---------------- */
  useEffect(() => {
    if (!open) return;

    if (editingLocation) {
      form.reset({
        addressName: editingLocation.addressName,
        zilla: editingLocation.zilla,
        thana: editingLocation.thana,
        fullAddress: editingLocation.fullAddress,
      });
    } else {
      form.reset({
        addressName: "",
        zilla: "",
        thana: "",
        fullAddress: "",
      });
    }
  }, [open, editingLocation, form]);


  /* ---------------- Set Default ---------------- */
  const handleSetDefault = async () => {
    if (!editingLocation) return;
    try {
      setSettingDefault(true);
      await updateAddress(editingLocation.addressName, {
        addressName: editingLocation.addressName,
        fullAddress: editingLocation.fullAddress,
        thana: editingLocation.thana,
        zilla: editingLocation.zilla,
        isDefault: true,
      });
      toast.success("Address set as default!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to set default"
      );
    } finally {
      setSettingDefault(false);
    }
  };

  /* ---------------- Submit ---------------- */
  const onSubmit = async (values: AddressFormData) => {
    try {
      setSaving(true);
      if (editingLocation) {
        await updateAddress(editingLocation.addressName, {
          addressName: values.addressName,
          thana: values.thana,
          zilla: values.zilla,
          fullAddress: values.fullAddress,
        });
        toast.success("Address updated!");
      } else {
        await addAddress({
          addresses: [{
            addressName: values.addressName,
            thana: values.thana,
            zilla: values.zilla,
            fullAddress: values.fullAddress,
          }],
        });
        toast.success("Address added!");
      }
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle zilla change - reset thana
  const handleZillaChange = (value: string) => {
    form.setValue("zilla", value, { shouldValidate: true });
    form.setValue("thana", "", { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md">
        <VisuallyHidden>
          <DialogTitle>{t("Address")}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-4 py-3 border flex items-center justify-between">
          <div className="flex items-center gap-2 text-Primary font-semibold">
            <MapPin size={18} />
            {t("Address")}
          </div>
          {editingLocation && !editingLocation.isDefault && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={settingDefault}
              onClick={handleSetDefault}
              className="border-light-green text-light-green hover:bg-Secondary text-xs"
            >
              {settingDefault ? "Setting..." : t("Set Default")}
            </Button>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4 pb-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="addressName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Give a name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder={t("Give a name to the address")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <ZillaThanaFields
                zilla={selectedZilla || ""}
                thana={selectedThana || ""}
                onZillaChange={handleZillaChange}
                onThanaChange={(value) => form.setValue("thana", value, { shouldValidate: true })}
              />
              {form.formState.errors.zilla?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.zilla.message}
                </p>
              )}
              {form.formState.errors.thana?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.thana.message}
                </p>
              )}
            </div>

            {/* Full Address */}
            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Full Address *")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      className="w-full resize-none"
                      placeholder={t("Enter Full Address")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-light-green text-white hover:bg-light-green/90"
            >
              {saving
                ? "Saving..."
                : editingLocation
                ? t("Update")
                : t("Save")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLocationDialog;
