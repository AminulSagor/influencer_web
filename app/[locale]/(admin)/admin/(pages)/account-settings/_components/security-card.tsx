"use client";

import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/service/admin/settings/update-password";
import { FormErrors, SecurityFormData, securitySchema } from "@/schemas/admin/settings_schema";


const SecurityCard = () => {
  const [formData, setFormData] = useState<SecurityFormData>({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange =
    (field: keyof SecurityFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = securitySchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SecurityFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setIsUpdating(true);
      setErrors({});

      const res = await updatePassword({
        email: parsed.data.email.trim(),
        oldPassword: parsed.data.oldPassword.trim(),
        newPassword: parsed.data.newPassword.trim(),
      });

      toast.success(res?.message || "Password updated successfully");

      setFormData({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (typeof message === "string") {
          if (message.toLowerCase().includes("incorrect old password")) {
            toast.error("Incorrect old password");
            return;
          }

          if (
            message
              .toLowerCase()
              .includes("provided email does not match your account")
          ) {
            toast.error("Email does not match your account");
            return;
          }

          toast.error(message);
          return;
        }
      }
      toast.error("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Change Your Password</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="Enter your email"
                disabled={isUpdating}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleChange("oldPassword")}
                  placeholder="Enter old password"
                  disabled={isUpdating}
                />
                {errors.oldPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.oldPassword}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange("newPassword")}
                  placeholder="Enter new password"
                  disabled={isUpdating}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Confirm new password"
                  disabled={isUpdating}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button type="submit" variant="lightGreen" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;