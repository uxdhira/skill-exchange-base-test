"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/auth";
import { useUserReviewsStats } from "@/hooks/reviews";
import { formatDateTime } from "@/lib/utility";
import { Star } from "lucide-react";

export default function MyReviews() {
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const profileDocumentId = user?.profile?.documentId || "";

  const {
    data: reviewsData = [],
    isLoading,
    error,
  } = useUserReviewsStats(profileDocumentId);

  const reviews = reviewsData?.reviews ?? [];

  const averageRating = Number(reviewsData?.averageRating || 0);

  const totalReviews = reviews?.length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
        <p className="text-gray-600">
          See what others are saying about your skills
        </p>
      </div>

      {reviews?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              Complete skill exchanges to receive reviews
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {reviews?.map((review) => (
            <Card key={review.id} className="gap-2">
              <CardHeader className="py-0 space-y-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {review.skill?.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Review by{" "}
                      {review.fromUser?.firstName +
                        " " +
                        review.fromUser?.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="m-0">
                <p className="text-gray-700 ">{review.comment}</p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(review.createdAt, "short")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-8">
            {/* LEFT SIDE */}
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600">
                {averageRating.toFixed(1)}
              </div>

              {/* STARS (based on average rating) */}
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-2">
                {totalReviews} reviews
              </p>
            </div>

            {/* RIGHT SIDE - DISTRIBUTION */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(
                  (r: any) => r.rating === stars,
                ).length;

                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-8">{stars} ★</span>

                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
