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
import { mockBookings, mockSkills } from "@/data/mockData";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Flag,
  MapPin,
  Monitor,
  RotateCcw,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BookingDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const currentUserId = "user-1";

  const booking = mockBookings.find((b) => b.id === id);
  const skill = booking
    ? mockSkills.find((s) => s.id === booking.skillId)
    : null;
  const offeredSkill = booking
    ? mockSkills.find((s) => s.id === booking.offeredSkillId)
    : null;

  const isProvider = booking?.providerId === currentUserId;
  const isRequester = booking?.requesterId === currentUserId;

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });

  if (!booking) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Booking Not Found</h1>
          <p className="text-gray-600">The requested booking does not exist.</p>
        </div>
        <Link href="/dashboard/mybookings">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Bookings
          </Button>
        </Link>
      </div>
    );
  }

  const otherPerson = isProvider
    ? { name: booking.requesterName, role: "Student" }
    : { name: booking.providerName, role: "Teacher" };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "online":
        return "Online";
      case "in_person":
        return "In Person";
      case "hybrid":
        return "Hybrid";
      default:
        return mode;
    }
  };

  const handleAccept = () => {
    toast.success("Booking accepted successfully");
  };

  const handleReject = () => {
    toast.success("Booking rejected");
  };

  const handleCancel = () => {
    toast.success("Booking cancelled successfully");
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
      <Link href="/dashboard/mybookings">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to My Bookings
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">Booking Details</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <CardDescription>
                    Booked on{" "}
                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Skills Exchange
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardDescription className="text-blue-900">
                          {isProvider
                            ? "They want to learn"
                            : "You want to learn"}
                        </CardDescription>
                        <CardTitle className="text-blue-900">
                          {booking.skillTitle}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit bg-white">
                          {skill?.category || "Skill"}
                        </Badge>
                      </CardHeader>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardDescription className="text-green-900">
                          {isProvider ? "You will learn" : "In exchange for"}
                        </CardDescription>
                        <CardTitle className="text-green-900">
                          {booking.offeredSkillTitle}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit bg-white">
                          {offeredSkill?.category || "Skill"}
                        </Badge>
                      </CardHeader>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Schedule</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date
                            ? new Date(booking.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.time || "TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.location || "TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {skill?.duration || "TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Mode</p>
                        <p className="text-sm text-muted-foreground">
                          {skill ? getModeLabel(skill.mode) : "TBD"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {isProvider ? "Student" : "Teacher"} Details
                  </h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/profile.jpg" />
                      <AvatarFallback>
                        {getInitials(otherPerson.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{otherPerson.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {otherPerson.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Teacher/Provider side - received bookings */}
              {isProvider && booking.status === "pending" && (
                <>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleAccept}
                  >
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

              {isProvider && booking.status === "accepted" && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsRescheduleOpen(true)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Request Reschedule
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleComplete}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </>
              )}

              {isProvider && booking.status === "complete" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReportOpen(true)}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-100 border-1 border-red-400"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              )}

              {isProvider && booking.status === "rejected" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsReasonOpen(true)}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  View Reason
                </Button>
              )}

              {/* Learner/Requester side - sent bookings */}
              {!isProvider && booking.status === "pending" && (
                <>
                  <Button
                    className="w-full bg-amber-600 text-white hover:bg-amber-800 hover:text-white hover:border-1 hover:border-slate-300 border border-slate-500 border-1"
                    onClick={handleCancel}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Button>
                </>
              )}

              {!isProvider && booking.status === "accepted" && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsRescheduleOpen(true)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Request Reschedule
                  </Button>
                  <Button
                    className="w-full bg-amber-600 text-white hover:bg-amber-800 hover:text-white hover:border-1 hover:border-slate-300 border border-slate-500 border-1"
                    onClick={handleCancel}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Button>
                </>
              )}

              {!isProvider && booking.status === "complete" && (
                <>
                  <Button
                    className="w-full border-purple-600 border-1 bg-slate-300 text-slate-900 hover:text-purple-700 hover:bg-purple-100 hover:border-slate-600 hover:border-1"
                    onClick={() => setIsReviewOpen(true)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReportOpen(true)}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </>
              )}

              {!isProvider && booking.status === "rejected" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsReasonOpen(true)}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  View Reason
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

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {otherPerson.name}
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
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={reviewData.rating === 0}
              >
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              Help us understand what went wrong with this booking
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Reason</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm">
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
                rows={4}
                placeholder="Please describe what happened..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReasonOpen} onOpenChange={setIsReasonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600">
              The booking was rejected. Here is the reason provided:
            </p>
            <div className="mt-3 p-3 bg-gray-100 rounded-lg">
              <Textarea
                defaultValue="The scheduling didn't work out for me at this time. Let's reconnect later!"
                rows={3}
                readOnly
              />
            </div>
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
