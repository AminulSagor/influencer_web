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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-black">
          <Link2 className="h-4 w-4" />
          <span>Platform Link</span>
        </div>

        <div className="mt-4 space-y-2">
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

      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-black">
          <ImageIcon className="h-4 w-4" />
          <span>Attached Proof</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {visibleAttachments.length ? (
            visibleAttachments.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-square overflow-hidden rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA]"
              >
                <Image
                  src={src}
                  alt={`Attachment ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 180px"
                />
              </div>
            ))
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA]"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}