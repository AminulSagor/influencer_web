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
import { z } from "zod";
import { useTranslations } from "next-intl";
import { SavedLocation } from "./delivery-location";

/* ---------------- Schema ---------------- */
const locationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  districtId: z.string().min(1, { message: "Please select a district" }),
  districtName: z.string().min(1, { message: "District name is required" }),
  thana: z.string().min(1, { message: "Please select a thana" }),
  address: z.string().min(10, { message: "Address must be at least 10 characters" }),
  type: z.enum(["House", "Office"], { message: "Please select a type" }),
});

type LocationFormValues = z.infer<typeof locationSchema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingLocation?: SavedLocation | null;
  onSave: (locationData: Omit<SavedLocation, 'id' | 'isSelected'>) => void;
};

// Sample data as fallback
const sampleDistricts = [
  { id: "1", district: "Dhaka" },
  { id: "2", district: "Chittagong" },
  { id: "3", district: "Rajshahi" },
  { id: "4", district: "Khulna" },
  { id: "5", district: "Sylhet" },
];

const sampleThanas: Record<string, string[]> = {
  "1": ["Gulshan", "Banani", "Mirpur", "Uttara", "Dhanmondi"],
  "2": ["Chandgaon", "Kotwali", "Double Mooring", "Pahartali"],
  "3": ["Boalia", "Motihar", "Shah Makhdum"],
  "4": ["Khulna Sadar", "Sonadanga", "Khalishpur"],
  "5": ["Sylhet Sadar", "Osmani Nagar", "Shah Paran"],
};

const AddEditLocationDialog = ({ open, onOpenChange, editingLocation, onSave }: Props) => {
  const t = useTranslations("influencer.campaign-details");

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      districtId: "",
      districtName: "",
      thana: "",
      address: "",
      type: "House",
    },
  });

  const [districts, setDistricts] = useState(sampleDistricts);
  const [thanas, setThanas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const districtId = form.watch("districtId");

  /* ---------------- Initialize form based on editingLocation ---------------- */
  useEffect(() => {
    if (!open) return;

    if (editingLocation) {
      // Editing mode - prefill with existing data
      form.reset({
        name: editingLocation.name,
        districtId: editingLocation.districtId,
        districtName: editingLocation.districtName,
        thana: editingLocation.thana,
        address: editingLocation.address,
        type: editingLocation.type,
      });
      // Load thanas for the selected district
      setTimeout(() => {
        setThanas(sampleThanas[editingLocation.districtId] || []);
      }, 0);
    } else {
      // Adding mode - reset form
      form.reset({
        name: "",
        districtId: "",
        districtName: "",
        thana: "",
        address: "",
        type: "House",
      });
      setThanas([]);
    }
  }, [open, editingLocation, form]);

  /* ---------------- Load Thanas when district changes ---------------- */
  useEffect(() => {
    if (!open || !districtId) {
      setThanas([]);
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const districtThanas = sampleThanas[districtId] || [];
      setThanas(districtThanas);
      setLoading(false);
      
      // Update district name when district changes
      const selectedDistrict = districts.find(d => d.id === districtId);
      if (selectedDistrict) {
        form.setValue("districtName", selectedDistrict.district);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [districtId, open, form, districts]);

  /* ---------------- Submit ---------------- */
  const onSubmit = (values: LocationFormValues) => {
    console.log("Saving location:", values);
    
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

  // Handle district change
  const handleDistrictChange = (value: string) => {
    form.setValue("districtId", value);
    form.setValue("thana", "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md">
        <VisuallyHidden>
          <DialogTitle>{t("Address")}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-4 py-3 border flex items-center gap-2 text-Primary font-semibold">
          <MapPin size={18} />
          {t("Address")}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4 pb-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
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

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Zilla */}
            <FormField
              control={form.control}
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zilla *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleDistrictChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Zilla" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.district}
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
                    disabled={!districtId || loading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue 
                          placeholder={
                            !districtId 
                              ? "Select Zilla first" 
                              : loading 
                              ? "Loading..." 
                              : "Select Thana"
                          } 
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {thanas.map((thana, index) => (
                        <SelectItem key={`${thana}-${index}`} value={thana}>
                          {thana}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
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
              className="w-full bg-light-green text-white hover:bg-light-green/90"
            >
              {editingLocation ? t("Update") : t("Save")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLocationDialog;