"use client";

import * as React from "react";
import { ImageIcon, Link2 } from "lucide-react";

type Props = {
  links?: string[] | null;
  attachments?: string[] | null;
};

export default function SubmissionAttachmentsGrid({
  links = [],
  attachments = [],
}: Props) {
  const safeLinks = Array.isArray(links) ? links : [];
  const safeAttachments = Array.isArray(attachments) ? attachments : [];

  const visibleAttachments = safeAttachments.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-black">
          <Link2 className="h-4 w-4" />
          <span>Platform Link</span>
        </div>

        <div className="mt-4 space-y-3">
          {safeLinks.length ? (
            safeLinks.map((link, index) => (
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
                <AttachmentPreview
                  key={`${src}-${index}`}
                  src={src}
                  alt={`Attachment ${index + 1}`}
                />
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-[140px] items-center justify-center rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA] text-xs text-black/40 sm:h-[150px] lg:h-[160px]"
                >
                  No image
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

type AttachmentPreviewProps = {
  src: string;
  alt: string;
};

function AttachmentPreview({ src, alt }: AttachmentPreviewProps) {
  const [failed, setFailed] = React.useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-[140px] items-center justify-center rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA] px-3 text-center text-xs text-black/40 sm:h-[150px] lg:h-[160px]">
        Image unavailable
      </div>
    );
  }

  return (
    <div className="relative h-[140px] overflow-hidden rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA] sm:h-[150px] lg:h-[160px]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
