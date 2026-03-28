"use client";

import * as React from "react";
import { ImageIcon, Link2, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const hasMoreAttachments = safeAttachments.length > 3;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? safeAttachments.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === safeAttachments.length - 1 ? 0 : prev + 1,
    );
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>
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
                  className="block break-all text-sm text-[#2E5B1F] underline underline-offset-2 hover:text-[#1F4014]"
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
                    onClick={() => openLightbox(index)}
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

          {hasMoreAttachments && (
            <button
              onClick={() => openLightbox(0)}
              className="mt-4 text-sm text-[#2E5B1F] underline underline-offset-2 hover:text-[#1F4014]"
            >
              +{safeAttachments.length - 3} more image(s)
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none rounded-none sm:rounded-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {safeAttachments.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
            <img
              src={safeAttachments[currentImageIndex]}
              alt={`Attachment ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {safeAttachments.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {safeAttachments.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

type AttachmentPreviewProps = {
  src: string;
  alt: string;
  onClick: () => void;
};

function AttachmentPreview({ src, alt, onClick }: AttachmentPreviewProps) {
  const [failed, setFailed] = React.useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-[140px] items-center justify-center rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA] px-3 text-center text-xs text-black/40 sm:h-[150px] lg:h-[160px]">
        Image unavailable
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="relative h-[140px] overflow-hidden rounded-[8px] border border-dashed border-[#D8D8D8] bg-[#FAFAFA] cursor-pointer hover:opacity-90 transition-opacity group sm:h-[150px] lg:h-[160px]"
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
    </button>
  );
}
