"use client";

import Image from "next/image";
import { ImageIcon, Link2 } from "lucide-react";

type Props = {
  links: string[];
  attachments: string[];
};

export default function SubmissionAttachmentsGrid({
  links,
  attachments,
}: Props) {
  const visibleAttachments = attachments.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-black">
          <Link2 className="h-4 w-4" />
          <span>Platform Link</span>
        </div>

        <div className="mt-4 space-y-3">
          {links.length ? (
            links.map((link, index) => (
              <a
                key={`${link}-${index}`}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="block break-all text-sm text-[#2E5B1F] underline underline-offset-2"
              >
                {link}
              </a>
            ))
          ) : (
            <p className="text-sm text-black/50">No live link</p>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-black">
          <ImageIcon className="h-4 w-4" />
          <span>Attached Proof</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {visibleAttachments.length
            ? visibleAttachments.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative h-[140px] overflow-hidden rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA] sm:h-[150px] lg:h-[160px]"
                >
                  <Image
                    src={src}
                    alt={`Attachment ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 160px"
                  />
                </div>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[140px] rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA] sm:h-[150px] lg:h-[160px]"
                />
              ))}
        </div>
      </div>
    </div>
  );
}
