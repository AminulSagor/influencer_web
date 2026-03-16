import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FaUserEdit } from "react-icons/fa";
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

const formatMetric = (val: number) => {
  if (val >= 1000) return `${Math.round(val / 1000)}K`;
  return val.toString();
};

const SubmissionHistory = ({ submissions }: SubmissionHistoryProps) => {
  if (submissions.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      {submissions.map((sub, index) => {
        const badge = statusBadge[sub.status] || { label: sub.status, className: "bg-gray-400" };
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
                      <CardContent className="grid grid-cols-6 gap-4">
                        <div className="space-y-8 col-span-2">
                          {sub.submissionLiveLinks.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium flex items-center gap-2">
                                <FaUserEdit size={20} />
                                Live Links
                              </p>
                              {sub.submissionLiveLinks.map((link, i) => (
                                <a
                                  key={i}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-light-green text-sm hover:underline block"
                                >
                                  {link}
                                </a>
                              ))}
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <FaUserEdit size={20} />
                              Performance Metrics
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Reach: </span>
                                <span className="font-semibold">{formatMetric(sub.achievedReach)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Views: </span>
                                <span className="font-semibold">{formatMetric(sub.achievedViews)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Likes: </span>
                                <span className="font-semibold">{formatMetric(sub.achievedLikes)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Comments: </span>
                                <span className="font-semibold">{formatMetric(sub.achievedComments)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-4 space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <FaUserEdit size={20} />
                            Proof Attachments
                          </p>
                          <div className="flex gap-4 flex-wrap">
                            {sub.submissionAttachments.length > 0 ? (
                              sub.submissionAttachments.map((attachment, i) => (
                                <a
                                  key={i}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-50 w-50 border border-dashed border-light-green bg-gray-50 rounded-lg flex items-center justify-center text-sm text-light-green hover:bg-light-green/10"
                                >
                                  View Attachment {i + 1}
                                </a>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No attachments</p>
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
