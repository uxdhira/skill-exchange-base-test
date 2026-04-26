"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import CreateBookingDialogBox from "@/components/blocks/booking/CreateBookingBox";
import { Button } from "@/components/ui/button";
import BookingCard from "@/components/ui/card/BookingCard";
import EmptyState from "@/components/ui/skeleton/EmptyState";
import LoadingSkeleton from "@/components/ui/skeleton/LoadingSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/auth";
import { useBookings } from "@/hooks/bookings";

function normalizeMode(mode?: string | null) {
  if (mode === "in_person") return "inperson";
  return mode === "online" || mode === "hybrid" || mode === "inperson"
    ? mode
    : "online";
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

export default function MyBookingsPage() {
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const profileDocumentId = user?.profile?.documentId || "";

  const { data: bookings = [], isLoading, error } = useBookings();
  console.log(bookings);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sentBookings = bookings.filter(
    (booking) => booking.requester?.documentId === profileDocumentId,
  );
  const receivedBookings = bookings.filter(
    (booking) => booking.provider?.documentId === profileDocumentId,
  );

  if (userLoading || isLoading) {
    return <LoadingSkeleton />;
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
              variant={"booking"}
            />
          ) : (
            sentBookings.map((booking) => (
              <BookingCard
                key={booking.documentId || booking.id}
                booking={booking}
                perspective="sent"
                profileDocumentId={profileDocumentId}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedBookings.length === 0 ? (
            <EmptyState
              title="No received bookings yet"
              description="When someone requests one of your skills, it will show up here."
              variant={"booking"}
            />
          ) : (
            receivedBookings.map((booking) => (
              <BookingCard
                key={booking.documentId || booking.id}
                booking={booking}
                perspective="received"
                profileDocumentId={profileDocumentId}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <CreateBookingDialogBox
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
    </div>
  );
}
