"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser, mockSkills, mockBookings } from "@/data/mockData";
import { Award, Calendar, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardHomePage() {
  const mySkills = mockSkills.filter(
    (skill) => skill.userId === currentUser.id,
  );
  const myBookings = mockBookings.filter(
    (booking) =>
      booking.requesterId === currentUser.id ||
      booking.providerId === currentUser.id,
  );

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser.name.split(" ")[0]}!
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
              {myBookings.filter((b) => b.status !== "rejected").length}
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
            <div className="text-2xl font-bold">{currentUser.rating}</div>
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
            <div className="text-2xl font-bold">{currentUser.reviewCount}</div>
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
                    booking.status === "accepted"
                      ? "bg-green-500"
                      : booking.status === "pending"
                        ? "bg-yellow-500"
                        : booking.status === "rejected"
                          ? "bg-red-500"
                          : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {booking.requesterId === currentUser.id
                          ? `Booking request sent for "${booking.skillTitle}"`
                          : `Received booking request for "${booking.skillTitle}"`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.message}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {booking.createdAt}
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
            <Button variant="outline" size="sm">
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
                  <p className="text-sm text-gray-600">{skill.category}</p>
                </div>
                <Link href={`/dashboard/skills/${skill.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
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
