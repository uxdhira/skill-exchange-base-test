"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSkeleton from "@/components/ui/skeleton/LoadingSkeleton";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useCurrentUser } from "@/hooks/auth";
import { useReviewsBySkill, useUserReviewsStats } from "@/hooks/reviews";
import { formatDateTime, getRatingStats, getReviewerName } from "@/lib/utility";
import { Skill } from "@/types";
import { ArrowLeft, Info, MapPin, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../ui/button";
import CreateBookingDialogBox from "../booking/CreateBookingBox";

interface SkillDetailsProps {
  skill: Skill;
  isOwner?: boolean;
  backUrl?: string;
  showSidebar?: boolean;
  showReviews?: boolean;
}

export default function SkillDetailsView({
  skill,
  isOwner,
  backUrl,
  showSidebar = true,
  showReviews = true,
}: SkillDetailsProps) {
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const owner = skill.owner;

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const { data: reviewsData = [], isLoading: reviewsLoading } =
    useUserReviewsStats(owner?.documentId);
  const averageRating = Number(reviewsData?.averageRating || 0);
  const totalReviews = reviewsData?.reviews?.length;
  const skillDocumentId = skill.documentId || skill.id;
  const { data: reviews } = useReviewsBySkill(skillDocumentId);

  const categoryName =
    typeof skill.category === "string"
      ? skill.category
      : skill.category?.name || "Uncategorized";

  const providerName =
    [owner?.firstName, owner?.lastName].filter(Boolean).join(" ").trim() ||
    owner?.user?.username ||
    skill.userName ||
    "Unknown";

  const providerLocation = owner?.location || skill.location || "Online";

  const image = skill.image as
    | string
    | {
        url?: string;
        formats?: {
          medium?: { url?: string };
          small?: { url?: string };
          thumbnail?: { url?: string };
        };
      }
    | undefined;

  const imageUrl =
    typeof image === "string"
      ? image
      : image?.formats?.medium?.url ||
        image?.formats?.small?.url ||
        image?.formats?.thumbnail?.url ||
        image?.url;

  const providerBio = "Passionate skill provider eager to share knowledge!";

  if (!skill) return <p className="p-6">Skill not found</p>;

  const review = !reviewsLoading && getRatingStats(reviews);
  const isCurrentOwner = user?.profile?.documentId === skill.owner?.documentId;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Button
        variant={"ghost"}
        onClick={() => (backUrl ? router.push(backUrl) : router.back())}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div
        className={
          showSidebar
            ? "grid grid-cols-1 lg:grid-cols-3 gap-6"
            : "grid grid-cols-1 gap-6"
        }
      >
        <div className={showSidebar ? "lg:col-span-2" : ""}>
          <Card className="p-0 overflow-hidden rounded-2xl">
            <div className="h-60 bg-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={skill.title}
                  width={440}
                  height={400}
                  className="w-full h-full object-cover rounded-t-2xl"
                  unoptimized
                />
              ) : (
                categoryName
              )}
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {categoryName}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700">
                  {skill.skillLevel}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold">{skill.title}</h1>

              <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                <span>by {providerName}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {skill.location || "Online"}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {(review?.average as number) || 0} ({review?.total})
                </span>
                {/* <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {skill.duration || "TBD"}
                </span> */}
              </div>

              <div>
                <h3 className="font-bold text-lg">Description</h3>
                <p className="text-slate-600">{skill.description}</p>
              </div>

              <hr />

              <div>
                <h3 className="font-bold text-lg">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                  <div className="space-y-1">
                    <p className="text-slate-500">Skill Level</p>
                    <p className="font-medium">{skill.skillLevel}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Category</p>
                    <p className="font-medium">{categoryName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Mode</p>
                    <p className="font-medium capitalize">
                      {skill.mode
                        .replace("inperson", "in person")
                        .replace("_", " ")}
                    </p>
                  </div>
                  {/* <div className="space-y-1">
                    <p className="text-slate-500">Duration</p>
                    <p className="font-medium">{skill.duration || "TBD"}</p>
                  </div> */}
                  <div className="space-y-1">
                    <p className="text-slate-500">Location</p>
                    <p className="font-medium">{skill.location || "Online"}</p>
                  </div>
                  {/* <div className="space-y-1">
                    <p className="text-slate-500">Availability</p>
                    <p className="font-medium">
                      {skill.availability || "Weekday evenings"}
                    </p>
                  </div> */}
                </div>
              </div>

              {isCurrentOwner && (
                <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <p className="text-sm text-blue-700">
                    This is your skill listing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showSidebar && (
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Skill Provider</h2>

              <div className="flex items-start gap-3 mb-4">
                <UserAvatar
                  firstName={owner?.firstName}
                  lastName={owner?.lastName}
                  avatar={owner?.avatar}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{providerName}</h3>
                  <div className="flex items-center gap-1 text-sm mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{averageRating}</span>
                    <span className="text-gray-500">
                      ({totalReviews} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{providerLocation}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {providerBio}
              </p>

              {!isCurrentOwner && (
                <>
                  <Button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Request Booking
                  </Button>

                  <Link
                    href={`/dashboard/users-profile?id=${owner?.documentId || skill.userId}`}
                    className="w-full mt-2 px-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="h-5 w-5" />
                    View Profile
                  </Link>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
      {/* Reviews */}
      {showReviews && (
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
                        firstName={owner?.firstName}
                        lastName={owner?.lastName}
                        avatar={owner?.avatar}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {getReviewerName(review)}
                          </p>
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
      )}
      <CreateBookingDialogBox
        showCreateModal={showBookingModal}
        setShowCreateModal={setShowBookingModal}
      />
    </div>
  );
}
