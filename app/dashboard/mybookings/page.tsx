"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock data
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

// Helper functions for icons & colors
const getIcon = (status: string) => {
  if (status === "accepted") return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (status === "rejected") return <XCircle className="w-5 h-5 text-red-600" />;
  if (status === "completed") return <CheckCircle className="w-5 h-5 text-blue-600" />;
  return <Clock className="w-5 h-5 text-yellow-600" />;
};

const getBadge = (status: string) => {
  if (status === "accepted") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

// Reusable Booking Card
function BookingCard({ booking, type }: { booking: typeof bookings[0]; type: "sent" | "received" }) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getIcon(booking.status)}
            <CardTitle className="text-lg">{booking.skillTitle}</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            {type === "sent" ? `Sent to ${booking.providerName}` : `Request from ${booking.requesterName}`}
          </p>
        </div>
        <Badge className={getBadge(booking.status)}>{booking.status}</Badge>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">{type === "sent" ? "You offered:" : "They offered:"}</span>{" "}
          {booking.offeredSkill}
        </p>
        <p className="text-sm text-gray-600">{booking.message}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" /> {booking.createdAt}
        </div>

        {/* Action buttons */}
        {type === "received" && booking.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={() => alert("Accepted! (Demo)")}>
              Accept
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => alert("Rejected! (Demo)")}>
              Decline
            </Button>
          </div>
        )}

        {booking.status === "accepted" && (
          <Button variant="outline" className="w-full" onClick={() => alert("Message sent! (Demo)")}>
            Send Message
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function MyBookings() {
  const sentBookings = bookings.filter((b) => b.requesterId === currentUserId);
  const receivedBookings = bookings.filter((b) => b.providerId === currentUserId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">My Bookings</h1>
        <p className="text-gray-600">Manage your skill exchange requests</p>
      </div>

      <Tabs defaultValue="sent">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="sent">Sent ({sentBookings.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4 mt-4">
          {sentBookings.map((b) => (
            <BookingCard key={b.id} booking={b} type="sent" />
          ))}
        </TabsContent>

        <TabsContent value="received" className="space-y-4 mt-4">
          {receivedBookings.map((b) => (
            <BookingCard key={b.id} booking={b} type="received" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}