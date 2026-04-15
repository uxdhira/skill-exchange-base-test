"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  MapPin,
  MessageSquare,
  RotateCcw,
  Star,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BookingDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });

  const booking = {
    id,
    status: "Accepted",
    requester: {
      name: "John Doe",
      avatar: "",
      id: "201",
    },
    provider: {
      name: "Sarah Johnson",
      avatar: "",
      id: "101",
    },
    requestedSkill: {
      title: "Professional Photography",
      category: "Art & Design",
    },
    offeredSkill: {
      title: "Web Development - React",
      category: "Technology",
    },
    scheduledDate: "2026-04-20",
    scheduledTime: "10:00 AM",
    duration: "2 hours",
    location: "Central Park, New York",
    mode: "Offline",
    message:
      "Hi Sarah! I'm really excited to learn photography from you. I have some basic knowledge but would love to improve my composition and lighting skills.",
    notes:
      "Please bring your camera equipment. We'll start with outdoor natural lighting.",
    createdDate: "2026-04-10",
    isRequester: false,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Accepted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      case "Completed":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAccept = () => {
    toast.success("Booking accepted successfully");
  };

  const handleReject = () => {
    toast.success("Booking rejected");
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reschedule request sent");
    setIsRescheduleOpen(false);
    setRescheduleData({ date: "", time: "", reason: "" });
  };

  const handleComplete = () => {
    toast.success("Booking marked as completed");
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Review submitted successfully");
    setIsReviewOpen(false);
    setReviewData({ rating: 0, comment: "" });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/bookings">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Bookings
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">Booking Details</h2>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Created on{" "}
                    {new Date(booking.createdDate).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Skills Exchange */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Skills Exchange
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardDescription className="text-blue-900">
                          {booking.isRequester
                            ? "You want to learn"
                            : "They want to learn"}
                        </CardDescription>
                        <CardTitle className="text-blue-900">
                          {booking.requestedSkill.title}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit bg-white">
                          {booking.requestedSkill.category}
                        </Badge>
                      </CardHeader>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardDescription className="text-green-900">
                          {booking.isRequester
                            ? "In exchange for"
                            : "You will teach"}
                        </CardDescription>
                        <CardTitle className="text-green-900">
                          {booking.offeredSkill.title}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit bg-white">
                          {booking.offeredSkill.category}
                        </Badge>
                      </CardHeader>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Schedule Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Schedule</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.scheduledDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.scheduledTime} ({booking.duration})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.location} ({booking.mode})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Messages */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Messages</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">
                          Initial Message
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.message}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Additional Notes
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {booking.isRequester ? "Provider" : "Requester"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      booking.isRequester
                        ? booking.provider.avatar
                        : booking.requester.avatar
                    }
                  />
                  <AvatarFallback>
                    {getInitials(
                      booking.isRequester
                        ? booking.provider.name
                        : booking.requester.name,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {booking.isRequester
                      ? booking.provider.name
                      : booking.requester.name}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link
                  href={`/dashboard/provider/${booking.isRequester ? booking.provider.id : booking.requester.id}`}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {booking.status === "Pending" && !booking.isRequester && (
                <>
                  <Button className="w-full" onClick={handleAccept}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Booking
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Booking
                  </Button>
                </>
              )}

              {booking.status === "Accepted" && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsRescheduleOpen(true)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Request Reschedule
                  </Button>
                  <Button className="w-full" onClick={handleComplete}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </>
              )}

              {booking.status === "Completed" && (
                <Button
                  className="w-full"
                  onClick={() => setIsReviewOpen(true)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Leave a Review
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
            <DialogDescription>
              Propose a new date and time for this booking
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReschedule}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reschedule-date">New Date</Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reschedule-time">New Time</Label>
                <Input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reschedule-reason">Reason</Label>
                <Textarea
                  id="reschedule-reason"
                  placeholder="Please explain why you need to reschedule"
                  value={rescheduleData.reason}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      reason: e.target.value,
                    })
                  }
                  rows={3}
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
              <Button type="submit">Send Reschedule Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with{" "}
              {booking.isRequester
                ? booking.provider.name
                : booking.requester.name}
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
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-comment">Your Review</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Share your experience..."
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  rows={4}
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
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
