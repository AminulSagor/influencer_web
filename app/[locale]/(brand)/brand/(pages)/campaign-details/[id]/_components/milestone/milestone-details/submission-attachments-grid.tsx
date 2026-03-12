"use client";

import { ImageIcon, Link2 } from "lucide-react";

type Props = {
  links: string[];
  attachments: string[];
};

export default function SubmissionAttachmentsGrid({
  links,
  attachments,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-black">
          <Link2 className="h-4 w-4" />
          <span>Platform 1</span>
        </div>

        <div className="mt-4 space-y-2">
          {links.length ? (
            links.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="block break-all text-sm underline underline-offset-2"
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
          {attachments.length ? (
            attachments.slice(0, 3).map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="aspect-square overflow-hidden rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA]"
              >
                <img
                  src={src}
                  alt={`Attachment ${index + 1}`}
                  className="h-full w-full object-cover"
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