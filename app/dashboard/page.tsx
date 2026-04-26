"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSkeleton from "@/components/ui/skeleton/LoadingSkeleton";
import { useCurrentUser } from "@/hooks/auth";
import { useBookings } from "@/hooks/bookings";
import { useCurrentProfile } from "@/hooks/profile";
import { useOwnerSkills } from "@/hooks/skill";
import { formatDateTime } from "@/lib/utility";
import { Award, Calendar, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

/**
 * This is the main dashboard home page.
 * It gives the user a quick summary of skills, bookings, and reviews.
 */
export default function DashboardHomePage() {
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const {
    data: skillsData,
    isLoading: skillsLoading,
    error: skillsError,
  } = useOwnerSkills(user?.profile?.documentId || "");
  const { data: bookings = [], isLoading, error } = useBookings();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useCurrentProfile(user?.profile?.documentId);
  // Only show skills posted by the logged-in user.
  const mySkills = skillsData?.data || [];
  // Show bookings where the user is either the sender or the receiver.
  const myBookings = bookings.filter(
    (booking) =>
      booking.requester?.documentId === user?.profile?.documentId ||
      booking.provider?.documentId === user?.profile?.documentId,
  );

  if (userLoading || skillsLoading) {
    return <LoadingSkeleton />;
  }

  if (userError || skillsError) {
    return (
      <div className="space-y-6 w-full">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.profile?.firstName}
        </h1>
        <p className="text-gray-600">
          {"Here's what's happening with your skill exchanges"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Skills Offered
            </CardTitle>
            <Award className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mySkills.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Bookings
            </CardTitle>
            <Calendar className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myBookings &&
                myBookings.filter((b) => b.bookingStatus !== "rejected").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rating
            </CardTitle>
            <Star className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.averageRating}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reviews
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.totalReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myBookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    booking.bookingStatus === "accepted"
                      ? "bg-green-500"
                      : booking.bookingStatus === "pending"
                        ? "bg-yellow-500"
                        : booking.bookingStatus === "rejected"
                          ? "bg-red-500"
                          : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {booking.requester?.documentId ===
                        user?.profile?.documentId
                          ? `Booking request sent for "${booking.requestedSkill?.title}"`
                          : `Received booking request for "${booking.providedSkill?.title}"`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.message}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.bookingStatus === "accepted"
                          ? "bg-green-100 text-green-700"
                          : booking.bookingStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.bookingStatus === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDateTime(booking.createdAt, "short")}
                  </p>
                </div>
              </div>
            ))}
            {myBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No recent activity</p>
                <Link href="/dashboard/browse">
                  <Button variant="link" className="mt-2">
                    Browse skills to get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* My Skills Quick View */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Skills</CardTitle>
          <Link href="/dashboard/submit-skill">
            <Button variant="default" size="sm">
              Add New Skill
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{skill.title}</h4>
                  <p className="text-sm text-gray-600">{skill.category.name}</p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="border border-1 border-slate-400"
                >
                  <Link href={`/dashboard/skill-details/${skill.documentId}`}>
                    View
                  </Link>
                </Button>
              </div>
            ))}
            {mySkills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>You have not added any skills yet</p>
                <Link href="/dashboard/submit-skill">
                  <Button variant="link" className="mt-2">
                    Add your first skill
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
