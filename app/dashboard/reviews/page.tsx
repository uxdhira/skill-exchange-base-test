"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

/**
 * This page shows review cards and a simple rating summary.
 */
export default function MyReviews() {
  // Static review data used for the current prototype.
  const reviews = [
    {
      id: 1,
      skill: "Web Development",
      reviewer: "Sarah Ahmed",
      rating: 5,
      comment: "Very professional and helpful!",
      date: "Jan 12, 2026",
    },
    {
      id: 2,
      skill: "Graphic Design",
      reviewer: "Ali Khan",
      rating: 4,
      comment: "Good experience overall.",
      date: "Jan 5, 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold">My Reviews</h1>
        <p className="text-muted-foreground">
          See what others say about your skills
        </p>
      </div>

      {/* Reviews List */}
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle className="text-lg">{review.skill}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review by {review.reviewer}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Star Rating */}
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

              <p className="text-gray-700">{review.comment}</p>

              <p className="text-sm text-muted-foreground">{review.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating Summary (Static for Prototype) */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Rating</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-4xl font-bold text-blue-600">4.8</div>

          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">Based on 24 reviews</p>
        </CardContent>
      </Card>
    </div>
  );
}
