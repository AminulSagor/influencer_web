"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronUp, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteOwnAccount } from "@/service/auth/delete-own-account";
import { removeToken } from "@/utils/cookies_util";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type DeleteAccountDangerZoneProps = {
  fullName?: string | null;
  isLoading?: boolean;
};

const DeleteAccountDangerZone = ({
  fullName,
  isLoading = false,
}: DeleteAccountDangerZoneProps) => {
  const router = useRouter();
  const params = useParams<{ locale?: string | string[] }>();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const expectedName = useMemo(() => fullName?.trim() ?? "", [fullName]);
  const isNameMatched = Boolean(expectedName) && confirmName.trim() === expectedName;
  const locale = Array.isArray(params?.locale)
    ? params?.locale[0]
    : params?.locale || "en";

  const closeDialog = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      setConfirmName("");
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isNameMatched || isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await deleteOwnAccount();

      notifySuccess(response.message);
      removeToken();
      router.replace(`/${locale}/login`);
      router.refresh();
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "Failed to delete account",
      );
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-base font-semibold text-red-600">Danger Zone</h2>
          <ChevronUp
            className={`h-5 w-5 text-slate-900 transition-transform ${
              isExpanded ? "" : "rotate-180"
            }`}
          />
        </button>

        {isExpanded ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm leading-5 text-red-600">
              Deleting your account is permanent and cannot be undone.
            </p>
            <button
              type="button"
              disabled={isLoading || !expectedName}
              onClick={() => setIsOpen(true)}
              className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              Delete Account
            </button>
          </div>
        ) : null}
      </section>

      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-[340px] rounded-xl border border-red-100 p-5 sm:max-w-[340px] [&>button]:hidden">
          <DialogHeader className="space-y-0">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-red-600">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-600 text-white">
                <Trash2 className="h-5 w-5" />
              </span>
              Delete Account
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm leading-5 text-red-600">
              Type your full name exactly to confirm account deletion.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <label htmlFor="delete-account-full-name" className="text-sm font-medium text-red-600">
              Full Name
            </label>
            <input
              id="delete-account-full-name"
              value={confirmName}
              onChange={(event) => setConfirmName(event.target.value)}
              placeholder={expectedName || "Full name"}
              disabled={isDeleting || !expectedName}
              className="h-10 w-full rounded-lg border border-red-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => closeDialog(false)}
              className="h-10 rounded-lg border border-red-200 bg-white text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isNameMatched || isDeleting}
              onClick={handleDeleteAccount}
              className="h-10 rounded-lg bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteAccountDangerZone;
