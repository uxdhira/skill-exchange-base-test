import {
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Monitor,
  SquareArrowOutUpRight,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ParticipantCard from "@/components/ui/card/ParticipantCard";
import { useDeleteBooking, useUpdateBooking } from "@/hooks/bookings";
import {
  formatDateTime,
  formatDuration,
  formatMode,
  formatStatus,
  getStatusClasses,
} from "@/lib/utility";
import type { Booking } from "@/types";
import { toast } from "sonner";

function BookingCard({
  booking,
  perspective: xxx,
  profileDocumentId,
}: {
  booking: Booking;
  perspective: "sent" | "received";
  profileDocumentId: string;
}) {
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const participants = useMemo(() => {
    if (!booking || !profileDocumentId) return null;

    const isProvider = booking.provider?.documentId === profileDocumentId;

    return {
      you: isProvider ? booking.provider : booking.requester,
      other: isProvider ? booking.requester : booking.provider,

      youRole: isProvider ? "provider" : "requester",
      otherRole: isProvider ? "requester" : "provider",
      amProvider: isProvider,
    };
  }, [booking, profileDocumentId]);
  const amProvider = participants?.amProvider;

  const requestedSkillTitle =
    booking.requestedSkill?.title || "Requested skill";
  const providedSkillTitle =
    booking.providedSkill?.title ||
    booking.requestedSkill?.title ||
    "Provided skill";
  const modeLabel = formatMode(booking.mode || booking.requestedSkill?.mode);
  const canDelete =
    booking.bookingStatus === "rejected" ||
    booking.bookingStatus === "cancelled";
  const updateBookingStatus = async (
    booking: Booking,
    bookingStatus: "accepted" | "rejected" | "completed" | "cancelled",
  ) => {
    try {
      await updateBooking.mutateAsync({
        documentId: booking.documentId || booking.id,
        data: { bookingStatus },
      });
      toast.success(`Booking marked as ${bookingStatus}.`);
    } catch {
      toast.error("Failed to update booking.");
    }
  };

  const handleDeleteBooking = async (booking: Booking) => {
    try {
      await deleteBooking.mutateAsync(booking.documentId || booking.id);
      toast.success("Booking deleted successfully.");
    } catch {
      toast.error("Failed to delete booking.");
    }
  };
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardContent className="p-0">
        <div className="border-b bg-slate-50/80 px-6 py-4">
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
              <h3 className="text-xl font-semibold text-slate-900">
                {requestedSkillTitle}
              </h3>
              <p className="text-sm text-slate-600">
                {amProvider
                  ? "Someone requested one of your skills."
                  : "You requested another member’s skill in exchange for one of yours."}
              </p>
            </div>

            <div className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm">
              <p className="text-slate-500">Scheduled</p>
              <p className="font-medium text-slate-900">
                {formatDateTime(booking.scheduledAt, "short")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1.3fr_0.95fr]">
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <ParticipantCard
                title="You"
                role={participants?.youRole}
                name={participants?.you?.firstName || "You"}
                skillTitle={
                  participants?.youRole === "provider"
                    ? providedSkillTitle
                    : requestedSkillTitle
                }
                profileImage={participants?.you?.avatar}
              />

              <ParticipantCard
                title="Other Party"
                role={participants?.otherRole}
                name={participants?.other?.firstName || "User"}
                skillTitle={
                  participants?.otherRole === "provider"
                    ? providedSkillTitle
                    : requestedSkillTitle
                }
                profileImage={participants?.other?.avatar}
              />
            </div>
            {/* <div className="grid gap-4 xl:grid-cols-2">
                <ParticipantCard
                  title={amProvider ? "Provider" : "Requester"}
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
                  title={amProvider ? "Requester" : "Provider"}
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
              </div> */}

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <ArrowRightLeft className="h-4 w-4" />
                Skill exchange
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Requested skill
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {requestedSkillTitle}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Exchange skill
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {providedSkillTitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MessageSquare className="h-4 w-4" />
                Message
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {booking.requesterMessage ||
                  booking.providerMessage ||
                  "No message was included."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-700">
                Session details
              </p>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">When</p>
                    <p>{formatDateTime(booking.scheduledAt, "short")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Duration</p>
                    <p>{formatDuration(booking.durationMinutes)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Location</p>
                    <p>{booking.location || "To be confirmed"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Mode</p>
                    <p>{modeLabel}</p>
                  </div>
                </div>
                {booking?.meetingLink &&
                  booking.bookingStatus === "accepted" && (
                    <div className="flex items-start gap-3">
                      <SquareArrowOutUpRight className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">Meeting</p>

                        <Link
                          href={booking?.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="  inline-block font-medium text-blue-600 hover:underline break-all"
                        >
                          Join Meeting
                        </Link>
                      </div>{" "}
                    </div>
                  )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-700">Actions</p>
              <div className="mt-3 space-y-2">
                {amProvider && booking.bookingStatus === "pending" && (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => updateBookingStatus(booking, "accepted")}
                    >
                      Accept booking
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => updateBookingStatus(booking, "rejected")}
                    >
                      Reject booking
                    </Button>
                  </>
                )}

                {!amProvider &&
                  (booking.bookingStatus === "pending" ||
                    booking.bookingStatus === "accepted") && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => updateBookingStatus(booking, "cancelled")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel booking
                    </Button>
                  )}

                {amProvider && booking.bookingStatus === "accepted" && (
                  <Button
                    className="w-full"
                    onClick={() => updateBookingStatus(booking, "completed")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark completed
                  </Button>
                )}

                {!amProvider && booking.bookingStatus === "completed" && (
                  <Button variant="outline" className="w-full">
                    <Star className="mr-2 h-4 w-4" />
                    Leave review
                  </Button>
                )}

                <Link
                  href={`/dashboard/bookings-details?id=${booking.documentId || booking.id}`}
                >
                  <Button variant="outline" className="w-full">
                    View booking details
                  </Button>
                </Link>

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
                    onClick={() => handleDeleteBooking(booking)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete booking
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingCard;
