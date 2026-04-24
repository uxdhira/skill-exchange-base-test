"use client";

import {
  AlertCircle,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Flag,
  MapPin,
  Monitor,
  RotateCcw,
  SquareArrowOutUpRight,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/auth";
import {
  useBooking,
  useDeleteBooking,
  useUpdateBooking,
} from "@/hooks/bookings";
import { useCreateReport } from "@/hooks/reports";
import { useCreateReview, useReviewsByBooking } from "@/hooks/reviews";

function formatDateTime(value?: string | null) {
  if (!value) return "To be confirmed";

  return new Date(value).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(minutes?: number | null) {
  if (!minutes) return "Duration not set";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} hr ${remaining} min` : `${hours} hr`;
}

function formatMode(mode?: string | null) {
  if (mode === "inperson" || mode === "in_person") return "In person";
  if (mode === "hybrid") return "Hybrid";
  if (mode === "online") return "Online";
  return "To be confirmed";
}

function formatStatus(status) {
  if (status === "completed" || status === "complete") return "Completed";
  if (status === "cancelled") return "Cancelled";
  if (status === "pending") return "Pending";
  if (status === "accepted") return "Accepted";
  if (status === "rejected") return "Rejected";

  return status;
}
function getStatusClasses(status) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "completed":
    case "complete":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "cancelled":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getInitials(name?: string) {
  return (name || "User")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ParticipantCard({
  title,
  role,
  name,
  skillTitle,
  profileImage,
}: {
  title: string;
  role: "Provider" | "Requester";
  name: string;
  skillTitle: string;
  profileImage: any;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 ring-1 ring-slate-200">
          <AvatarImage src={profileImage?.url} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="font-medium text-slate-900">{name}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
          <p className="mt-1 font-medium text-slate-900">{role}</p>
        </div>
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Skill
          </p>
          <p className="mt-1 font-medium text-slate-900">{skillTitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id") || "";

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const profileDocumentId = user?.profile?.documentId || "";
  const { data: booking, isLoading, error } = useBooking(documentId);
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const createReview = useCreateReview();
  const { isLoading: reviewsLoading, data: reviews } =
    useReviewsByBooking(documentId);
  const createReport = useCreateReport();

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [rescheduleData, setRescheduleData] = useState({
    scheduledAt: "",
    reason: "",
  });
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });
  const [accepterMessage, setAccepterMessage] = useState("");

  const perspective = useMemo(() => {
    if (!booking || !profileDocumentId) return null;
    if (booking.provider?.documentId === profileDocumentId) return "provider";
    if (booking.requester?.documentId === profileDocumentId) return "requester";
    return null;
  }, [booking, profileDocumentId]);

  const requestedSkillTitle =
    booking?.requestedSkill?.title || "Requested skill";
  const providedSkillTitle = booking?.providedSkill?.title || "Provided skill";

  const handleStatusUpdate = async (
    bookingStatus:
      | "accepted"
      | "rejected"
      | "completed"
      | "cancelled"
      | "pending",
  ) => {
    if (!booking) return;
    try {
      const messageField = accepterMessage?.trim()
        ? perspective === "requester"
          ? { requesterMessage: accepterMessage }
          : { providerMessage: accepterMessage }
        : {};

      await updateBooking.mutateAsync({
        documentId: booking?.documentId,
        data: {
          bookingStatus,
          ...messageField,
        },
      });
      toast.success(`Booking marked as ${bookingStatus}.`);
    } catch {
      toast.error("Failed to update booking.");
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    try {
      await updateBooking.mutateAsync({
        documentId: booking.documentId || booking.id,
        data: {
          scheduledAt: new Date(rescheduleData.scheduledAt).toISOString(),
          requesterMessage:
            perspective === "requester" && rescheduleData.reason
              ? rescheduleData.reason
              : booking.requesterMessage || "",
          providerMessage:
            perspective === "provider" && rescheduleData.reason
              ? rescheduleData.reason
              : booking.providerMessage || "",
        },
      });
      toast.success("Reschedule request sent.");
      setIsRescheduleOpen(false);
      setRescheduleData({ scheduledAt: "", reason: "" });
    } catch {
      toast.error("Failed to update booking.");
    }
  };

  const handleDelete = async () => {
    if (!booking) return;

    try {
      await deleteBooking.mutateAsync(booking.documentId);
      toast.success("Booking deleted successfully.");
    } catch {
      toast.error("Failed to delete booking.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking || reviewData.rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (!profileDocumentId) {
      toast.error("Unable to identify your profile.");
      return;
    }
    const reviewState = {
      booking: booking.documentId,
      // Always the current user
      fromUser: profileDocumentId,

      // The OTHER user in the booking
      toUser:
        booking.provider?.documentId === profileDocumentId
          ? booking.requester!.documentId
          : booking.provider!.documentId,
      skill:
        perspective === "provider"
          ? booking.providedSkill?.documentId
          : booking.requestedSkill?.documentId,
      rating: reviewData.rating,
      comment: reviewData.comment,
    };

    try {
      await createReview.mutateAsync(reviewState);
      toast.success("Review submitted successfully.");
      setIsReviewOpen(false);
      setReviewData({ rating: 0, comment: "" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review.");
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast.error("Please select a reason.");
      return;
    }

    if (!booking?.documentId) {
      toast.error("Unable to identify the booking.");
      return;
    }

    if (!profileDocumentId) {
      toast.error("Unable to identify your profile.");
      return;
    }

    const reportedUser =
      booking.provider?.documentId === profileDocumentId
        ? booking.requester?.documentId
        : booking.provider?.documentId;

    if (!reportedUser) {
      toast.error("Unable to identify the user to report.");
      return;
    }
    const currentReport = {
      booking: booking.documentId,
      reporter: profileDocumentId,
      reportedUser,
      reason: reportReason,
      cause: reportDetails,
    };
    console.log({ currentReport });

    try {
      await createReport.mutateAsync(currentReport);
      toast.success("Report submitted. We'll review it shortly.");
      setIsReportOpen(false);
      setReportReason("");
      setReportDetails("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit report.");
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/mybookings">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to My Bookings
          </Button>
        </Link>
        <p className="text-slate-600">Loading booking details...</p>
      </div>
    );
  }

  if (userError || error) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/mybookings">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to My Bookings
          </Button>
        </Link>
        <p className="text-red-600">We couldn’t load this booking right now.</p>
      </div>
    );
  }

  if (!documentId || !booking) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/mybookings">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to My Bookings
          </Button>
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <h1 className="text-3xl font-bold">Booking Not Found</h1>
            <p className="mt-2 text-slate-600">
              The booking you are looking for does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!perspective) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/mybookings">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to My Bookings
          </Button>
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <h1 className="text-3xl font-bold">Booking Not Available</h1>
            <p className="mt-2 text-slate-600">
              This booking is not assigned to your current profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const amProvider = perspective === "provider";
  const canDelete =
    booking.bookingStatus === "rejected" ||
    booking.bookingStatus === "cancelled";
  console.log({ booking, reviews });
  return (
    <div className="space-y-6">
      <Link href="/dashboard/mybookings">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to My Bookings
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="border-b bg-slate-50/80 px-6 py-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                      {amProvider
                        ? "You are the provider"
                        : "You are the requester"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        booking.bookingStatus,
                      )}`}
                    >
                      {formatStatus(booking.bookingStatus)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {requestedSkillTitle}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                      {amProvider
                        ? "This booking was created for one of your skills."
                        : "This is a booking you requested from another member."}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm">
                  <p className="text-slate-500">Scheduled</p>
                  <p className="font-medium text-slate-900">
                    {formatDateTime(booking.scheduledAt)}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 px-6 py-6">
              <div className="grid gap-4 xl:grid-cols-2">
                <ParticipantCard
                  title="You"
                  role={amProvider ? "Provider" : "Requester"}
                  name={
                    amProvider
                      ? booking.provider?.firstName || "You"
                      : booking.requester?.firstName || "You"
                  }
                  skillTitle={
                    amProvider ? requestedSkillTitle : providedSkillTitle
                  }
                  profileImage={amProvider && booking.provider?.avatar}
                />
                <ParticipantCard
                  title="Other Person"
                  role={amProvider ? "Requester" : "Provider"}
                  name={
                    amProvider
                      ? booking.requester?.firstName || "Requester"
                      : booking.provider?.firstName || "Provider"
                  }
                  skillTitle={
                    amProvider ? providedSkillTitle : requestedSkillTitle
                  }
                  profileImage={!amProvider && booking.requester?.avatar}
                />
              </div>

              <Separator />

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                  <h2 className="text-lg font-semibold">Skill Exchange</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Requested skill
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {requestedSkillTitle}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Exchange skill
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {providedSkillTitle}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <h2 className="text-lg font-semibold">Session Details</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">When</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {formatDateTime(booking.scheduledAt)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Duration</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {formatDuration(booking.durationMinutes)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <p className="mt-1 font-medium text-slate-900">
                      {booking.location || "To be confirmed"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Monitor className="h-4 w-4" />
                      Mode
                    </div>
                    <p className="mt-1 font-medium text-slate-900">
                      {formatMode(booking.mode)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                    {/* Meeting Link */}
                    {booking.meetingLink &&
                      booking.bookingStatus === "accepted" && (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <SquareArrowOutUpRight className="h-4 w-4" />
                            Meeting
                          </div>

                          <Link
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block font-medium text-blue-600 hover:underline break-all"
                          >
                            Join Meeting
                          </Link>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-slate-500" />
                  <h2 className="text-lg font-semibold">Messages</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-700">
                      {amProvider
                        ? booking.provider?.firstName || "You"
                        : booking.requester?.firstName || "You"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {booking.requesterMessage || "No requester message yet."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-700">
                      {amProvider
                        ? booking.requester?.firstName || "Requester"
                        : booking.provider?.firstName || "Provider"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {booking.providerMessage || "No provider message yet."}
                    </p>
                  </div>
                </div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    Reviews ({reviews?.length || 0})
                  </h2>

                  {reviewsLoading ? (
                    <p className="text-slate-500">Loading reviews...</p>
                  ) : reviews?.length ? (
                    <div className="space-y-4">
                      {reviews.map((review) => {
                        const reviewer = review.fromUser;

                        return (
                          <div
                            key={review.documentId}
                            className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={reviewer?.avatar?.url} />
                                <AvatarFallback>
                                  {`${reviewer?.firstName?.[0] || ""}${
                                    reviewer?.lastName?.[0] || ""
                                  }`}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">
                                    {reviewer?.firstName} {reviewer?.lastName}
                                  </p>

                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= (review.rating || 0)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-slate-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {review.comment && (
                                  <p className="mt-2 text-sm text-slate-600">
                                    {review.comment}
                                  </p>
                                )}

                                <p className="mt-1 text-xs text-slate-400">
                                  {formatDateTime(review.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500">
                      No reviews yet. Be the first to review this skill!
                    </p>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                These actions depend on whether you are the provider or
                requester.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {amProvider && booking.bookingStatus === "pending" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="accepter-message">Message</Label>
                    <textarea
                      id="accepter-message"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={accepterMessage}
                      onChange={(e) => setAccepterMessage(e.target.value)}
                      placeholder="Write your message..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleStatusUpdate("accepted")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accept booking
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusUpdate("rejected")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject booking
                  </Button>
                </>
              )}

              {booking.bookingStatus === "accepted" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsRescheduleOpen(true)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Request reschedule
                </Button>
              )}

              {amProvider && booking.bookingStatus === "accepted" && (
                <Button
                  className="w-full"
                  onClick={() => handleStatusUpdate("completed")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark completed
                </Button>
              )}

              {!amProvider &&
                (booking.bookingStatus === "pending" ||
                  booking.bookingStatus === "accepted") && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusUpdate("cancelled")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel booking
                  </Button>
                )}

              {!amProvider &&
                booking.bookingStatus === "completed" &&
                !reviews?.some(
                  (r) => r.fromUser?.documentId === profileDocumentId,
                ) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsReviewOpen(true)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Write review
                  </Button>
                )}

              {amProvider &&
                booking.bookingStatus === "completed" &&
                !reviews?.some(
                  (r) => r.fromUser?.documentId === profileDocumentId,
                ) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsReviewOpen(true)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Write review
                  </Button>
                )}

              {(booking.bookingStatus === "completed" ||
                booking.bookingStatus === "complete") && (
                <Button
                  variant="outline"
                  className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  onClick={() => setIsReportOpen(true)}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Report issue
                </Button>
              )}

              {booking.bookingStatus === "rejected" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsReasonOpen(true)}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  View rejection reason
                </Button>
              )}

              {booking.requestedSkillDocumentId && (
                <Link
                  href={`/dashboard/skill-details/${booking.requestedSkillDocumentId}`}
                >
                  <Button variant="ghost" className="w-full">
                    View requested skill
                  </Button>
                </Link>
              )}

              {canDelete && (
                <Button
                  variant="ghost"
                  className="w-full text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete booking
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
            <DialogDescription>
              Propose a new date and time for this booking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReschedule}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled-at">New schedule</Label>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={rescheduleData.scheduledAt}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      scheduledAt: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  rows={4}
                  placeholder="Explain why you need to move the session."
                  value={rescheduleData.reason}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      reason: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRescheduleOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience after completing this exchange.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReviewSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewData({ ...reviewData, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-comment">Your review</Label>
                <Textarea
                  id="review-comment"
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  placeholder="Tell others how the session went."
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReviewOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={reviewData.rating === 0}>
                Submit review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
            <DialogDescription>
              Help us understand what went wrong with this booking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason</Label>
              <select
                id="report-reason"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="Harassment or inappropriate behavior">
                  Harassment or inappropriate behavior
                </option>
                <option value="No-show or unreliability">
                  No-show or unreliability
                </option>
                <option value="Inappropriate content">
                  Inappropriate content
                </option>
                <option value="Suspicious activity or scam">
                  Suspicious activity or scam
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-details">Additional details</Label>
              <Textarea
                id="report-details"
                rows={4}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Please describe what happened."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReportSubmit}>
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReasonOpen} onOpenChange={setIsReasonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogDescription>
              Current note attached to the rejected booking.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {booking.providerMessage ||
                booking.requesterMessage ||
                "No rejection note was saved for this booking."}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReasonOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
