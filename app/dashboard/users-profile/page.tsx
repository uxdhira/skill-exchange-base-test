"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockReviews, mockSkills, users } from "@/data/mockData";
import { ArrowLeft, Calendar, Clock, MapPin, Monitor, Star, Tag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function UserProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const backUrl = searchParams.get("back");

  const user = users.find((u) => u.id === userId);
  const userSkills = mockSkills.filter((skill) => skill.userId === userId);
  const userReviews = mockReviews.filter((review) =>
    userSkills.some((skill) => skill.id === review.skillId),
  );

  if (!user) {
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

  const skillsOffered = ["Web Design", "React", "Python"];
  const skillsRequested = ["Photography", "Guitar", "Cooking"];

  return (
    <div className="space-y-6">
      <Link href={backUrl || "/dashboard/browse-skill"}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </Link>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={user.avatar || "/profile.jpg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>

              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined March 2025</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(user.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{user.rating}</span>
                <span className="text-gray-600">
                  ({user.reviewCount} reviews)
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Passionate about sharing knowledge and learning new skills.
                Always eager to connect with fellow learners!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills Offered ({userSkills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-gray-600">No skills offered yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userSkills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/dashboard/skill-details/${skill.id}`}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {skill.image ? (
                    <img
                      src={skill.image}
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
                      <Badge className="bg-blue-100 text-blue-700">{skill.category}</Badge>
                      <Badge className="bg-purple-100 text-purple-700">{skill.skillLevel}</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{skill.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {skill.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="capitalize">{skill.mode.replace("_", " ")}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{skill.duration}</span>
                      <span>·</span>
                      <span>{skill.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews ({userReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userReviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {review.reviewerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{review.reviewerName}</h4>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Skills Offered</span>
              <span className="font-semibold">{userSkills.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reviews</span>
              <span className="font-semibold">{user.reviewCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-semibold">{user.rating} ★</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
