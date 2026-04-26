import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export function RatingSummary({ reviews, totalReviews, averageRating }: any) {
  return (
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

            {/* STARS */}
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

            <p className="text-sm text-gray-600 mt-2">{totalReviews} reviews</p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;

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
  );
}
