"use client";

import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";

type LogoutConfirmButtonProps = {
  children: ReactNode;
  loadingChildren?: ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function LogoutConfirmButton({
  children,
  loadingChildren,
  className,
  disabled,
}: LogoutConfirmButtonProps) {
  const { logout, loading } = useLogout();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={disabled || loading}
          className={className}
        >
          {loading ? loadingChildren ?? "Logging out..." : children}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xl sm:max-w-md">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-2xl font-semibold text-red-600">
            Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2 text-sm text-[#2D5016]/80">
            Are you sure you want to log out from your account?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <p className="text-sm text-[#2D5016]/70">
          You will need to sign in again to continue using BrandGuru.
        </p>

        <AlertDialogFooter className="gap-3 pt-2 sm:justify-end">
          <AlertDialogCancel className="mt-0 border-[#7A9B57] text-[#2D5016] hover:bg-[#F1F6DE]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              void logout();
            }}
            className={cn(
              "bg-red-600 text-white hover:bg-red-700",
              loading && "cursor-not-allowed opacity-70"
            )}
          >
            {loading ? "Logging out..." : "Yes, Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
