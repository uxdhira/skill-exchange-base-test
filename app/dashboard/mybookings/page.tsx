"use client";

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
import { mockBookings, mockSkills } from "@/data/mockData";
import { Booking } from "@/types";
import { Calendar, Clock, Flag, MapPin, Monitor, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const currentUserId = "user-1";

  const userBookings = mockBookings.filter(
    (booking) =>
      booking.requesterId === currentUserId ||
      booking.providerId === currentUserId,
  );

  const sentBookings = userBookings.filter(
    (b) => b.requesterId === currentUserId,
  );
  const receivedBookings = userBookings.filter(
    (b) => b.providerId === currentUserId,
  );

  const handleCancelBooking = (bookingId: string) => {
    toast.success("Booking cancelled successfully");
  };

  const handleAcceptBooking = (bookingId: string) => {
    toast.success("Booking accepted successfully!");
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    toast.success("Review submitted successfully!");
    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(0);
    setReviewText("");
  };

  const handleSubmitReport = () => {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    toast.error("Report submitted. We'll review it shortly.");
    setShowReportModal(false);
    setSelectedBooking(null);
    setReportReason("");
    setReportDetails("");
  };

  const handleCloseReview = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(0);
    setReviewText("");
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
    setSelectedBooking(null);
    setReportReason("");
    setReportDetails("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "complete":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  function BookingCard({ booking }: { booking: Booking }) {
    const isProvider = booking.providerId === currentUserId;
    const skill = mockSkills.find((s) => s.id === booking.skillId);
    const otherPerson = isProvider
      ? { name: booking.requesterName }
      : { name: booking.providerName };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">
                      {booking.skillTitle}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isProvider && (
                      <span className="px-2 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded">
                        Student
                      </span>
                    )}
                    {isProvider && (
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded">
                        Teacher
                      </span>
                    )}
                  </div>
                  {!isProvider && (
                    <p className="text-sm text-gray-700 mt-1">
                      Learning in exchange of{" "}
                      <span className="font-semibold text-purple-700">
                        {booking.offeredSkillTitle}
                      </span>
                    </p>
                  )}
                  {isProvider && (
                    <p className="text-sm text-gray-700 mt-1">
                      Teaching{" "}
                      <span className="font-semibold text-purple-700">
                        {booking.skillTitle}
                      </span>{" "}
                      in exchange of{" "}
                      <span className="font-semibold text-purple-700">
                        {booking.offeredSkillTitle}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/profile.jpg" />
                    <AvatarFallback>
                      {otherPerson.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      {isProvider ? "My Student" : "My Teacher"}
                    </p>
                    <p className="font-medium">{otherPerson.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>
                      {booking.date
                        ? new Date(booking.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{booking.time || "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{booking.location || "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Monitor className="w-5 h-5 text-gray-400" />
                    <span className="capitalize">
                      {skill?.mode ? skill.mode.replace("_", " ") : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{skill?.duration || "TBD"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:w-48">
              {booking.status === "pending" && isProvider && (
                <>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAcceptBooking(booking.id)}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-amber-600 text-white hover:bg-amber-800 hover:text-white hover:border-1 hover:border-slate-300 border border-slate-500 border-1"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {booking.status === "pending" && !isProvider && (
                <>
                  <Link
                    href={`/dashboard/users-profile?id=${booking.providerId}`}
                  >
                    <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full bg-amber-600 text-white hover:bg-amber-800 hover:text-white hover:border-1 hover:border-slate-300 border border-slate-500 border-1"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {booking.status === "accepted" && (
                <>
                  <Link
                    href={
                      isProvider
                        ? `/dashboard/profile?id=${booking.requesterId}`
                        : `/dashboard/profile?id=${booking.providerId}`
                    }
                  >
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    className="w-full bg-amber-600 text-white hover:bg-amber-800 hover:text-white hover:border-1 hover:border-slate-300 border border-slate-500 border-1"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {booking.status === "complete" && !isProvider && (
                <Button
                  className="w-full border-purple-600 border-1 bg-slate-300 text-slate-900 hover:text-purple-700 hover:bg-purple-100 hover:border-slate-600 hover:border-1"
                  onClick={() => {
                    setSelectedBooking(booking.id);
                    setShowReviewModal(true);
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Write a Review
                </Button>
              )}

              {booking.status === "complete" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedBooking(booking.id);
                    setShowReportModal(true);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 border-1 border-red-400"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              )}

              <Link href={`/dashboard/bookings-details?id=${booking.id}`}>
                <Button variant="outline" className="w-full">
                  View Booking Details
                </Button>
              </Link>

              <Link href={`/dashboard/skill-details/${booking.skillId}`}>
                <Button variant="outline" className="w-full">
                  View Skill
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">My Bookings</h1>
        <p className="text-gray-600">Manage your skill exchange bookings</p>
      </div>

      <Tabs defaultValue="sent">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="sent">Sent ({sentBookings.length})</TabsTrigger>
          <TabsTrigger value="received">
            Received ({receivedBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4 mt-4">
          {sentBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No sent bookings</h3>
                <p className="text-gray-600 text-center mb-4">
                  Bookings you sent will appear here
                </p>
                <Link href="/dashboard/browse-skill">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Browse Skills
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4 mt-4">
          {receivedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No received bookings
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Bookings you receive will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {receivedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience about this skill exchange
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Skill</Label>
              <Input
                value={
                  selectedBooking
                    ? mockBookings.find((b) => b.id === selectedBooking)
                        ?.skillTitle || ""
                    : ""
                }
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Offered by</Label>
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <Avatar>
                  <AvatarImage src="/profile.jpg" />
                  <AvatarFallback>
                    {selectedBooking
                      ? mockBookings
                          .find((b) => b.id === selectedBooking)
                          ?.providerName.charAt(0) || ""
                      : ""}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {selectedBooking
                    ? mockBookings.find((b) => b.id === selectedBooking)
                        ?.providerName || ""
                    : ""}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                    />
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <p className="text-xs text-muted-foreground">Click to rate</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseReview}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSubmitReview}
              disabled={rating === 0}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              Help us understand what went wrong
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Reason</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="harassment">
                  Harassment or inappropriate behavior
                </option>
                <option value="no-show">No-show or unreliability</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="scam">Suspicious activity or scam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label>Additional Details</Label>
              <Textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={4}
                placeholder="Please describe what happened..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseReport}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmitReport}
              disabled={!reportReason}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
