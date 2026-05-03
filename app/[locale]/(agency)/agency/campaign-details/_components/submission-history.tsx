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
import { FaGlobe, FaRegImages, FaUserEdit } from "react-icons/fa";
import { BarChart3 } from "lucide-react";
import type {
  AgencyMilestoneSubmissionItem,
  MilestoneTargetTitle,
} from "@/types/agency/campaign/milestone-submission.types";

interface SubmissionHistoryProps {
  submissions: AgencyMilestoneSubmissionItem[];
  targetTitle?: MilestoneTargetTitle | null;
}


function getExternalHref(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return "#";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?|#|$)/i.test(url);
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
      {imageFailed && !isImageUrl(attachment) ? (
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

function formatSubmissionStatus(status: string) {
  if (!status) return "In Review";

  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusClassName(status: string) {
  const normalized = status?.toLowerCase();

  if (normalized === "approved" || normalized === "completed") {
    return "bg-light-green";
  }

  if (normalized === "declined" || normalized === "rejected") {
    return "bg-red-500";
  }

  return "bg-orange";
}

function getTargetMetricValue(
  submission: AgencyMilestoneSubmissionItem,
  targetTitle?: MilestoneTargetTitle | null
) {
  if (!targetTitle) return null;

  if (targetTitle === "Reach") return submission.achievedReach ?? 0;
  if (targetTitle === "Views") return submission.achievedViews ?? 0;
  if (targetTitle === "Likes") return submission.achievedLikes ?? 0;
  if (targetTitle === "Comments") return submission.achievedComments ?? 0;
  return submission.achievedFollows ?? 0;
}

function getAchievedMetric(
  submission: AgencyMilestoneSubmissionItem,
  targetTitle?: MilestoneTargetTitle | null
) {
  if (targetTitle) {
    return {
      label: targetTitle,
      value: getTargetMetricValue(submission, targetTitle),
    };
  }

  if (submission.achievedReach != null) {
    return {
      label: "Reach",
      value: submission.achievedReach,
    };
  }

  if (submission.achievedViews != null) {
    return {
      label: "Views",
      value: submission.achievedViews,
    };
  }

  if (submission.achievedLikes != null) {
    return {
      label: "Likes",
      value: submission.achievedLikes,
    };
  }

  if (submission.achievedComments != null) {
    return {
      label: "Comments",
      value: submission.achievedComments,
    };
  }

  if (submission.achievedFollows != null) {
    return {
      label: "Follows",
      value: submission.achievedFollows,
    };
  }

  return null;
}

const SubmissionHistory = ({ submissions, targetTitle }: SubmissionHistoryProps) => {
  if (!submissions?.length) return null;

  return (
    <div className="mt-8 space-y-4">
      {submissions.map((submission, index) => {
        const metric = getAchievedMetric(submission, targetTitle);
        const attachments = submission.submissionAttachments ?? [];
        const liveLinks = submission.submissionLiveLinks ?? [];

        return (
          <div key={submission.id} className="rounded-lg border px-4">
            <Accordion
              type="single"
              collapsible
              defaultValue={
                index === 0 ? `submission-${submission.id}` : undefined
              }
            >
              <AccordionItem value={`submission-${submission.id}`}>
                <AccordionTrigger className="cursor-pointer hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex items-center gap-4">
                      <p className="text-xl">Submission {submissions.length - index}</p>
                      <Badge className={getStatusClassName(submission.status)}>
                        {formatSubmissionStatus(submission.status)}
                      </Badge>
                    </div>

                    <p className="text-sm font-semibold text-Primary">
                      ৳{submission.requestedAmount}
                    </p>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-lg">
                        <FaUserEdit size={18} />
                        Description / Update (Optional)
                      </p>

                      <div className="px-1">
                        <Textarea
                          value={submission.submissionDescription ?? ""}
                          placeholder="Description of the proof will be visible here"
                          disabled
                        />
                      </div>
                    </div>

                    <Card>
                      <CardContent className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-6">
                        <div className="col-span-2 space-y-8">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm font-medium">
                              <FaGlobe size={16} />
                              Platform / Live Link
                            </p>

                            <div className="space-y-1">
                              {liveLinks.length ? (
                                liveLinks.map((link, linkIndex) => (
                                  <a
                                    key={`${link}-${linkIndex}`}
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

                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm font-medium">
                              <BarChart3 size={16} />
                              Performance Metrics
                            </p>

                            {metric ? (
                              <>
                                <p className="text-xs text-gray-500">{metric.label}</p>
                                <p className="text-xl font-semibold">{metric.value}</p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-400">
                                No performance data
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-4 space-y-2">
                          <p className="flex items-center gap-2 text-sm font-medium">
                            <FaRegImages size={16} />
                            Attach Proof (Screenshots, Videos)
                          </p>

                          <div className="flex flex-wrap gap-4">
                            {attachments.length ? (
                              attachments.map((attachment, attachmentIndex) => (
                                <AttachmentPreviewLink
                                  key={`${attachment}-${attachmentIndex}`}
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