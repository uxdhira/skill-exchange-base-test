"use client"; //By default, components are server components.
// If we need interactivity, we add ‘use client’ to make it a client component.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

// This page uses local demo booking data for now.
const bookings = [
  {
    id: 1,
    skillTitle: "Web Development",
    offeredSkill: "Graphic Design",
    requesterName: "Ali",
    providerName: "You",
    requesterId: 2,
    providerId: 1,
    status: "pending",
    message: "Can we exchange skills next week?",
    createdAt: "Jan 15, 2026",
  },
  {
    id: 2,
    skillTitle: "UI Design",
    offeredSkill: "React Basics",
    requesterName: "You",
    providerName: "Sara",
    requesterId: 1,
    providerId: 3,
    status: "accepted",
    message: "Looking forward to working together.",
    createdAt: "Jan 10, 2026",
  },
];

const currentUserId = 1;

// Return a matching icon based on booking status.
const getIcon = (status: string) => {
  if (status === "accepted")
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (status === "rejected")
    return <XCircle className="w-5 h-5 text-red-600" />;
  if (status === "completed")
    return <CheckCircle className="w-5 h-5 text-blue-600" />;
  return <Clock className="w-5 h-5 text-yellow-600" />;
};

// Return badge colors based on booking status.
const getBadge = (status: string) => {
  if (status === "accepted") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

/**
 * BookingCard shows one booking request.
 * The same card is reused for both sent and received requests.
 */
function BookingCard({
  booking,
  type,
}: {
  booking: (typeof bookings)[0];
  type: "sent" | "received";
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getIcon(booking.status)}
            <CardTitle className="text-lg">{booking.skillTitle}</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            {type === "sent"
              ? `Sent to ${booking.providerName}`
              : `Request from ${booking.requesterName}`}
          </p>
        </div>
        <Badge className={getBadge(booking.status)}>{booking.status}</Badge>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">
            {type === "sent" ? "You offered:" : "They offered:"}
          </span>{" "}
          {booking.offeredSkill}
        </p>
        <p className="text-sm text-gray-600">{booking.message}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" /> {booking.createdAt}
        </div>

        {/* Action buttons */}
        {type === "received" && booking.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => alert("Accepted! (Demo)")}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => alert("Rejected! (Demo)")}
            >
              Decline
            </Button>
          </div>
        )}

        {booking.status === "accepted" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => alert("Message sent! (Demo)")}
          >
            Send Message
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * This page groups bookings into "sent" and "received" tabs.
 */
export default function MyBookings() {
  const sentBookings = bookings.filter((b) => b.requesterId === currentUserId);
  const receivedBookings = bookings.filter(
    (b) => b.providerId === currentUserId,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">My Bookings</h1>
        <p className="text-gray-600">Manage your skill exchange requests</p>
      </div>

      <Tabs defaultValue="sent">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="sent">Sent ({sentBookings.length})</TabsTrigger>
          <TabsTrigger value="received">
            Received ({receivedBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="sent"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        >
          {sentBookings.map((b) => (
            <BookingCard key={b.id} booking={b} type="sent" />
          ))}
        </TabsContent>

        <TabsContent
          value="received"
          className=" mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {receivedBookings.map((b) => (
            <BookingCard key={b.id} booking={b} type="received" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
