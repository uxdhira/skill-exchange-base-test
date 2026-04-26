"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/profile/StatsCard";
import LoadingSkeleton from "@/components/ui/skeleton/LoadingSkeleton";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { mockReviews, mockSkills, users } from "@/data/mockData";
import { useCurrentProfile } from "@/hooks/profile";
import { useUserReviewsStats } from "@/hooks/reviews";
import { useOwnerSkills } from "@/hooks/skill";
import { formatDateTime, getReviewerName } from "@/lib/utility";
import { ArrowLeft, Calendar, MapPin, Star, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const backUrl = searchParams.get("back");
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useCurrentProfile(userId);
  const { data: skillsData } = useOwnerSkills(userId);
  const { data: reviewsData = [], isLoading: reviewsLoading } =
    useUserReviewsStats(userId);
  const router = useRouter();
  const reviews = reviewsData?.reviews ?? [];

  const averageRating = Number(reviewsData?.averageRating || 0);

  const totalReviews = reviews?.length;
  const user = users.find((u) => u.id === "user-4");
  const userSkills = mockSkills.filter((skill) => skill.userId === "user-4");
  const userReviews = mockReviews.filter((review) =>
    userSkills.some((skill) => skill.id === review.skillId),
  );

  if (!profile && !profileLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">User not found</h1>
          <p className="text-gray-600">
            The user you are looking for does not exist.
          </p>
        </div>
        <Link href="/dashboard/browse-skill">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  const skills = skillsData?.data;
  const skillsOffered = skills?.length ?? 0;
  const exchangesCompleted = profile?.exchangeCompleted ?? 0;
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <UserAvatar
              firstName={profile?.firstName}
              lastName={profile?.lastName}
              avatar={profile?.avatar}
              size="lg"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-2">
                {profile
                  ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() ||
                    "User"
                  : "User"}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {profile?.createdAt
                      ? formatDateTime(profile.createdAt, "short")
                      : ""}
                  </span>{" "}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{averageRating}</span>
                <span className="text-gray-600">({totalReviews} reviews)</span>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {/* Passionate about sharing knowledge and learning new skills.
                Always eager to connect with fellow learners! */}
                {profile?.bio}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills Offered ({skills?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {skills?.length === 0 ? (
            <p className="text-gray-600">No skills offered yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {skills?.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/dashboard/skill-details/${skill.documentId}`}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {skill.image ? (
                    <img
                      src={skill.image?.url}
                      alt={skill.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Tag className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-700">
                        {skill.category?.name}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700">
                        {skill.skillLevel}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{skill.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {skill.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="capitalize">{skill.mode}</span>
                      <span>·</span>
                      {/* <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {skill?.duration}
                      </span>
                      <span>·</span> */}
                      <span>{skill.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <StatsCard
        stats={[
          {
            label: "Skills Offered",
            value: skillsOffered,
            color: "blue",
          },
          {
            label: "Exchanges Completed",
            value: exchangesCompleted,
            color: "green",
          },
          {
            label: "Total Reviews",
            value: totalReviews,
            color: "purple",
          },
          {
            label: "Overall Rating",
            value: averageRating, // replace with actual rating
            color: "purple",
          },
        ]}
      />
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Reviews ({reviews?.length || 0})
          </h2>

          {reviewsLoading ? (
            <>
              <LoadingSkeleton />
            </>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.documentId || review.id}
                  className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <UserAvatar
                      firstName={profile?.firstName}
                      lastName={profile?.lastName}
                      avatar={profile?.avatar}
                      size="md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{getReviewerName(review)}</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (review.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm text-slate-600">
                          {review.comment}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(review.createdAt, "short")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">
              No reviews yet. Be the first to review this skill!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
