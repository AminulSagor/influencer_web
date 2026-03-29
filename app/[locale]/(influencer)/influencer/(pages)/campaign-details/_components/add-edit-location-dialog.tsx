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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SavedLocation } from "./delivery-location";
import { BD_LOCATIONS } from "@/location-data/bd-location";
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

  const [thanas, setThanas] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);

  const selectedZilla = form.watch("zilla");

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
      // Load thanas for the editing location's zilla
      const location = BD_LOCATIONS.find((loc) => loc.zila === editingLocation.zilla);
      setThanas(location?.thanas || []);
    } else {
      form.reset({
        addressName: "",
        zilla: "",
        thana: "",
        fullAddress: "",
      });
      setThanas([]);
    }
  }, [open, editingLocation, form]);

  /* ---------------- Load Thanas when zilla changes ---------------- */
  useEffect(() => {
    if (!open || !selectedZilla) {
      setThanas([]);
      return;
    }

    const location = BD_LOCATIONS.find((loc) => loc.zila === selectedZilla);
    setThanas(location?.thanas || []);
  }, [selectedZilla, open]);

    return () => clearTimeout(timer);
  }, [districtId, open, form, districts]);

  /* ---------------- Submit ---------------- */
  const onSubmit = (values: LocationFormValues) => {
    
    // Find district name
    const district = districts.find(d => d.id === values.districtId);
    
    const locationData: Omit<SavedLocation, 'id' | 'isSelected'> = {
      name: values.name,
      districtId: values.districtId,
      districtName: district?.district || values.districtName,
      thana: values.thana,
      address: values.address,
      type: values.type,
    };
    
    onSave(locationData);
    onOpenChange(false);
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
    form.setValue("zilla", value);
    form.setValue("thana", "");
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

            {/* Zilla */}
            <FormField
              control={form.control}
              name="zilla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zilla *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleZillaChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Zilla" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BD_LOCATIONS.map((loc) => (
                        <SelectItem key={loc.zila} value={loc.zila}>
                          {loc.zila}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thana */}
            <FormField
              control={form.control}
              name="thana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thana *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedZilla}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            !selectedZilla
                              ? "Select Zilla first"
                              : "Select Thana"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {thanas.map((thana) => (
                        <SelectItem key={thana} value={thana}>
                          {thana}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
