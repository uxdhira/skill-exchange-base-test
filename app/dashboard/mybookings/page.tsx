"use client";

import {
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Monitor,
  Plus,
  Search,
  SquareArrowOutUpRight,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/auth";
import {
  useBookings,
  useCreateBooking,
  useDeleteBooking,
  useUpdateBooking,
} from "@/hooks/bookings";
import { useOwnerSkills, useSkills } from "@/hooks/skill";
import { formatDateTime } from "@/lib/utils";
import type { Booking, Skill } from "@/types";

function formatDuration(minutes?: number | null) {
  if (!minutes) return "Duration not set";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!remainingMinutes) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
}

function normalizeMode(mode?: string | null) {
  if (mode === "in_person") return "inperson";
  return mode === "online" || mode === "hybrid" || mode === "inperson"
    ? mode
    : "online";
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

function getStatusClasses(status: Booking["status"]) {
  switch (status) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    case "completed":
    case "complete":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
    case "cancelled":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
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

function getSkillOwnerDocumentId(skill?: Skill | null) {
  return skill?.owner?.documentId || skill?.userId || "";
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

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="mb-4 h-14 w-14 text-slate-300" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 max-w-md text-slate-600">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}

export default function MyBookingsPage() {
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const profileDocumentId = user?.profile?.documentId || "";

  const { data: bookings = [], isLoading, error } = useBookings();
  const { data: ownerSkillsData, isLoading: ownerSkillsLoading } =
    useOwnerSkills(profileDocumentId);
  const { data: allSkillsData, isLoading: allSkillsLoading } = useSkills(1, 9);
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  console.log({ bookings });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequestedSkillId, setSelectedRequestedSkillId] = useState("");
  const [selectedProvidedSkillId, setSelectedProvidedSkillId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<"online" | "inperson" | "hybrid">("online");
  const [requesterMessage, setRequesterMessage] = useState("");

  const ownerSkills = useMemo(
    () => ownerSkillsData?.data ?? [],
    [ownerSkillsData],
  );
  const allSkills = useMemo(() => allSkillsData?.data ?? [], [allSkillsData]);

  const availableRequestedSkills = useMemo(
    () =>
      allSkills.filter((skill) => {
        const ownerId = getSkillOwnerDocumentId(skill);
        const title = skill.title.toLowerCase();
        const matchesSearch = title.includes(searchTerm.trim().toLowerCase());
        const isOwnSkill = ownerId === profileDocumentId;
        return !isOwnSkill && (!!searchTerm.trim() ? matchesSearch : true);
      }),
    [allSkills, profileDocumentId, searchTerm],
  );

  const selectedRequestedSkill =
    allSkills.find((skill) => skill.documentId === selectedRequestedSkillId) ||
    null;
  const selectedProvidedSkill =
    ownerSkills.find((skill) => skill.documentId === selectedProvidedSkillId) ||
    null;

  const sentBookings = bookings.filter(
    (booking) => booking.requester.documentId === profileDocumentId,
  );
  const receivedBookings = bookings.filter(
    (booking) => booking.provider?.documentId === profileDocumentId,
  );

  const resetCreateForm = () => {
    setSearchTerm("");
    setSelectedRequestedSkillId("");
    setSelectedProvidedSkillId("");
    setScheduledAt("");
    setDurationMinutes("60");
    setLocation("");
    setMode("online");
    setRequesterMessage("");
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetCreateForm();
  };

  const handleCreateBooking = async () => {
    if (!profileDocumentId) {
      toast.error("Your profile is required before creating a booking.");
      return;
    }

    if (!selectedRequestedSkill || !selectedRequestedSkill.documentId) {
      toast.error("Please choose the skill you want to learn.");
      return;
    }

    if (!selectedProvidedSkill || !selectedProvidedSkill.documentId) {
      toast.error("Please choose your offered exchange skill.");
      return;
    }

    if (!scheduledAt) {
      toast.error("Please choose a date and time.");
      return;
    }

    const providerDocumentId = getSkillOwnerDocumentId(selectedRequestedSkill);
    if (!providerDocumentId) {
      toast.error("The selected requested skill is missing its provider.");
      return;
    }

    try {
      await createBooking.mutateAsync({
        requestedSkill: selectedRequestedSkill.documentId,
        providedSkill: selectedProvidedSkill.documentId,
        provider: providerDocumentId,
        requester: profileDocumentId,
        bookingStatus: "pending",
        mode,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        location,
        requesterMessage,
        providerMessage: "",
      });

      toast.success("Booking request created successfully.");
      closeCreateModal();
    } catch {
      toast.error("Failed to create booking.");
    }
  };

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

  function BookingCard({
    booking,
    perspective,
  }: {
    booking: Booking;
    perspective: "sent" | "received";
  }) {
    const amProvider = perspective === "received";
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
                  {formatDateTime(booking.scheduledAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1.3fr_0.95fr]">
            <div className="space-y-4">
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
                      <p>{formatDateTime(booking.scheduledAt)}</p>
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
                  {amProvider && booking.status === "pending" && (
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
                    (booking.status === "pending" ||
                      booking.status === "accepted") && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          updateBookingStatus(booking, "cancelled")
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel booking
                      </Button>
                    )}

                  {amProvider && booking.status === "accepted" && (
                    <Button
                      className="w-full"
                      onClick={() => updateBookingStatus(booking, "completed")}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark completed
                    </Button>
                  )}

                  {!amProvider && booking.status === "completed" && (
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

  if (userLoading || isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-slate-600">Loading your bookings...</p>
      </div>
    );
  }

  if (userError || error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-red-600">
          We couldn’t load your bookings right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-slate-600">
            Manage live bookings from Strapi for both requests you sent and
            requests you received for your own skills.
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create skill booking
        </Button>
      </div>

      <Tabs defaultValue="sent" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="sent">Sent ({sentBookings.length})</TabsTrigger>
          <TabsTrigger value="received">
            Received ({receivedBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4">
          {sentBookings.length === 0 ? (
            <EmptyState
              title="No sent bookings yet"
              description="Bookings you request from other members will appear here."
              action={
                <Button
                  className="mt-5"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create your first booking
                </Button>
              }
            />
          ) : (
            sentBookings.map((booking) => (
              <BookingCard
                key={booking.documentId || booking.id}
                booking={booking}
                perspective="sent"
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedBookings.length === 0 ? (
            <EmptyState
              title="No received bookings yet"
              description="When someone requests one of your skills, it will show up here."
            />
          ) : (
            receivedBookings.map((booking) => (
              <BookingCard
                key={booking.documentId || booking.id}
                booking={booking}
                perspective="received"
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Skill Booking</DialogTitle>
            <DialogDescription>
              Search for the skill you want to learn, choose one of your offered
              skills in exchange, and schedule the session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="space-y-3">
              <Label htmlFor="skill-search">Search skill to learn</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="skill-search"
                  className="pl-9"
                  placeholder="Type a skill title like Python, guitar, or photography"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="rounded-xl border border-slate-200">
                <div className="max-h-64 overflow-y-auto">
                  {allSkillsLoading ? (
                    <p className="p-4 text-sm text-slate-600">
                      Loading skills...
                    </p>
                  ) : availableRequestedSkills.length === 0 ? (
                    <p className="p-4 text-sm text-slate-600">
                      No matching skills found.
                    </p>
                  ) : (
                    availableRequestedSkills.map((skill) => {
                      const isSelected =
                        skill.documentId === selectedRequestedSkillId;
                      return (
                        <button
                          key={skill.documentId || skill.id}
                          type="button"
                          className={`flex w-full items-start justify-between border-b px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 ${
                            isSelected ? "bg-slate-50" : ""
                          }`}
                          onClick={() => {
                            setSelectedRequestedSkillId(skill.documentId || "");
                            setMode(normalizeMode(skill.mode));
                            if (!location) {
                              setLocation(skill.location || "");
                            }
                          }}
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {skill.title}
                            </p>
                            <p className="text-sm text-slate-600">
                              By{" "}
                              {[skill.owner?.firstName, skill.owner?.lastName]
                                .filter(Boolean)
                                .join(" ") || "Unknown provider"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatMode(skill.mode)} •{" "}
                              {skill.location || "No location"}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="provided-skill">Your exchange skill</Label>
                <select
                  id="provided-skill"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={selectedProvidedSkillId}
                  onChange={(e) => setSelectedProvidedSkillId(e.target.value)}
                  disabled={ownerSkillsLoading}
                >
                  <option value="">Select your skill</option>
                  {ownerSkills.map((skill) => (
                    <option
                      key={skill.documentId || skill.id}
                      value={skill.documentId || ""}
                    >
                      {skill.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode">Mode</Label>
                <select
                  id="mode"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as "online" | "inperson" | "hybrid")
                  }
                >
                  <option value="online">Online</option>
                  <option value="inperson">In person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled-at">Scheduled at</Label>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Zoom, Google Meet, or a physical address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="request-message">Message to provider</Label>
                <Textarea
                  id="request-message"
                  rows={4}
                  placeholder="Tell them what you want to learn and what you’re offering in exchange."
                  value={requesterMessage}
                  onChange={(e) => setRequesterMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ParticipantCard
                title="You"
                role="Requester"
                name={
                  [user?.profile?.firstName, user?.profile?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                  user?.username ||
                  "You"
                }
                skillTitle={selectedProvidedSkill?.title || "Choose your skill"}
                profileImage={false}
              />
              <ParticipantCard
                title="Other Person"
                role="Provider"
                name={
                  selectedRequestedSkill
                    ? [
                        selectedRequestedSkill.owner?.firstName,
                        selectedRequestedSkill.owner?.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") || "Provider"
                    : "Select a skill first"
                }
                skillTitle={
                  selectedRequestedSkill?.title || "Choose a requested skill"
                }
                profileImage={false}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBooking}
              disabled={
                createBooking.isPending ||
                !selectedRequestedSkillId ||
                !selectedProvidedSkillId
              }
            >
              {createBooking.isPending ? "Creating..." : "Create booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
