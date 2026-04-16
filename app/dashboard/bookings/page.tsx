"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockBookings } from "@/data/mockData";
import {
  Calendar,
  CheckCircle,
  Clock,
  Flag,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const currentUserId = "user-1";

const bookings = mockBookings.map((b) => ({
  ...b,
  id: parseInt(b.id.replace("booking-", "")),
}));

const getIcon = (status: string) => {
  if (status === "accepted")
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (status === "rejected")
    return <XCircle className="w-5 h-5 text-red-600" />;
  if (status === "complete")
    return <CheckCircle className="w-5 h-5 text-blue-600" />;
  return <Clock className="w-5 h-5 text-yellow-600" />;
};

const getBadge = (status: string) => {
  if (status === "accepted") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "complete") return "bg-blue-100 text-blue-700";
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
};

function BookingCard({
  booking,
  type,
}: {
  booking: (typeof bookings)[0];
  type: "sent" | "received";
}) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const handleReviewSubmit = () => {
    const reviewData = {
      skillId: booking.id,
      skillOfferedBy: booking.providerName,
      skillAcceptedBy: booking.requesterName,
      review: reviewText,
      rating: rating,
    };
    console.log("Review submitted:", reviewData);
    toast.success("Review submitted successfully!");
    setIsReviewOpen(false);
    setRating(0);
    setReviewText("");
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setRating(0);
    setReviewText("");
  };

  const handleReportSubmit = () => {
    const reportData = {
      bookingId: booking.id,
      reportedUser:
        type === "sent" ? booking.providerName : booking.requesterName,
      reporterUser:
        type === "sent" ? booking.requesterName : booking.providerName,
      reason: reportReason,
      details: reportDetails,
    };
    console.log("Report submitted:", reportData);
    toast.error("Report submitted. We'll review it shortly.");
    setIsReportOpen(false);
    setReportReason("");
    setReportDetails("");
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
    setReportReason("");
    setReportDetails("");
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getIcon(booking.status)}
            <Link
              href={`/dashboard/bookings-details?id=${booking.id}`}
              className="text-lg hover:text-blue-600 hover:underline"
            >
              {booking.skillTitle}
            </Link>
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
          {booking.offeredSkillTitle}
        </p>
        <p className="text-sm text-gray-600">{booking.message}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" /> {booking.createdAt}
        </div>

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

        {booking.status === "complete" && type === "sent" && (
          <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
            <DialogTrigger asChild>
              <Button className="w-full border-purple-600 border-1 bg-slate-300 text-slate-900 hover:text-purple-700 hover:bg-purple-100 hover:border-slate-600 hover:border-1">
                <Star className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
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
                  <Input value={booking.skillTitle} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Offered by</Label>
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <Avatar>
                      <AvatarImage src="/profile.jpg" />
                      <AvatarFallback>
                        {booking.providerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{booking.providerName}</span>
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
                          className={`w-8 h-8 transition-colors ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Click to rate
                    </p>
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
                <Button onClick={handleReviewSubmit} disabled={rating === 0}>
                  Submit Review
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {booking.status === "complete" && (
          <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReportOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-100 w-full border-1 border-red-400"
              >
                <Flag className="mr-2 h-4 w-4  " />
                Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Report User</DialogTitle>
                <DialogDescription>
                  Help us understand what went wrong
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="reportDetails">Additional Details</Label>
                  <Textarea
                    id="reportDetails"
                    placeholder="Please describe what happened..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseReport}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReportSubmit}
                  disabled={!reportReason}
                >
                  Submit Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

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
