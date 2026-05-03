"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  FaComment,
  FaEye,
  FaGlobe,
  FaHeart,
  FaPlay,
  FaRegImages,
  FaUserEdit,
} from "react-icons/fa";
import { MilestoneSubmission } from "@/types/influencer/milestone_types";

interface SubmissionHistoryProps {
  submissions: MilestoneSubmission[];
}

const statusBadge: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-light-green" },
  pending: { label: "Pending", className: "bg-orange" },
  in_review: { label: "In Review", className: "bg-orange" },
  rejected: { label: "Rejected", className: "bg-red-500" },
  declined: { label: "Declined", className: "bg-red-500" },
};

const formatMetric = (val?: number | null) => {
  const numericValue = Number(val ?? 0);
  if (numericValue >= 1000000) return `${Number((numericValue / 1000000).toFixed(1))}M`;
  if (numericValue >= 1000) return `${Number((numericValue / 1000).toFixed(1))}K`;
  return numericValue.toString();
};

function getSubmissionMetrics(submission: MilestoneSubmission) {
  return [
    { label: "Reach", value: submission.achievedReach, icon: FaEye },
    { label: "Views", value: submission.achievedViews, icon: FaPlay },
    { label: "Likes", value: submission.achievedLikes, icon: FaHeart },
    { label: "Comments", value: submission.achievedComments, icon: FaComment },
  ];
}

function getExternalHref(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return "#";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url);
}

function AttachmentPreviewLink({ attachment }: { attachment: string }) {
  const href = getExternalHref(attachment);
  const [imageFailed, setImageFailed] = useState(false);

  if (isVideoUrl(attachment)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100"
      >
        <video
          src={href}
          className="h-[180px] w-[180px] object-cover"
          muted
          preload="metadata"
        />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100"
      aria-label="Open submitted proof"
    >
      {imageFailed ? (
        <FaRegImages className="text-2xl text-gray-400" />
      ) : (
        <img
          src={href}
          alt="Submitted proof preview"
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
    </a>
  );
}

const SubmissionHistory = ({ submissions }: SubmissionHistoryProps) => {
  if (submissions.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      {submissions.map((sub, index) => {
        const badge = statusBadge[sub.status] || { label: sub.status, className: "bg-gray-400" };
        const liveLinks = sub.submissionLiveLinks ?? [];
        const attachments = sub.submissionAttachments ?? [];

        return (
          <div key={sub.id} className="border rounded-lg px-4">
            <Accordion type="single" collapsible>
              <AccordionItem value={`submission-${sub.id}`}>
                <AccordionTrigger className="hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4">
                    <p className="text-xl">Submission {index + 1}</p>
                    <Badge className={badge.className}>{badge.label}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <p className="text-lg flex items-center gap-2">
                        <FaUserEdit size={20} />
                        Description / Update
                      </p>
                      <div className="px-1">
                        <Textarea
                          value={sub.submissionDescription || ""}
                          placeholder="No description provided"
                          disabled
                        />
                      </div>
                    </div>

                    {sub.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-red-600">Rejection Reason:</p>
                        <p className="text-sm text-red-500">{sub.rejectionReason}</p>
                      </div>
                    )}

                    {sub.adminFeedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-600">Admin Feedback:</p>
                        <p className="text-sm text-blue-500">{sub.adminFeedback}</p>
                      </div>
                    )}

                    <Card>
                      <CardContent className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
                        <div className="space-y-8">
                          <div className="space-y-1">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <FaGlobe size={16} />
                              Platform / Live Link
                            </p>
                            <div className="space-y-1">
                              {liveLinks.length > 0 ? (
                                liveLinks.map((link, i) => (
                                  <a
                                    key={`${link}-${i}`}
                                    href={getExternalHref(link)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block break-all text-sm text-Primary hover:underline"
                                  >
                                    {link}
                                  </a>
                                ))
                              ) : (
                                <p className="text-sm text-gray-400">No live link</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-sm font-medium">Performance Metrics</p>
                            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                              {getSubmissionMetrics(sub).map(({ label, value, icon: Icon }) => (
                                <div key={label} className="space-y-2">
                                  <div className="flex items-center gap-2 text-base font-semibold text-black">
                                    <Icon className="h-5 w-5" />
                                    <span>{label}</span>
                                  </div>
                                  <p className="text-4xl font-bold leading-none text-black">
                                    {formatMetric(value)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <FaRegImages size={16} />
                            Proof Attachments
                          </p>
                          <div className="flex flex-wrap gap-4">
                            {attachments.length > 0 ? (
                              attachments.map((attachment, i) => (
                                <AttachmentPreviewLink
                                  key={`${attachment}-${i}`}
                                  attachment={attachment}
                                />
                              ))
                            ) : (
                              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-400">
                                No attachment
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                      <span>Payment: ৳{sub.paidAmount || "0"} ({sub.paymentStatus})</span>
                      <span>
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionHistory;
