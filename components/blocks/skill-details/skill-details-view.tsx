"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skill } from "@/types";
import { ArrowLeft, Clock, Info, MapPin, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";

interface SkillDetailsProps {
  skill: Skill;
  isOwner?: boolean;
  backUrl?: string;
  showSidebar?: boolean;
}

export default function SkillDetailsView({
  skill,
  isOwner,
  backUrl,
  showSidebar = true,
}: SkillDetailsProps) {
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingType, setBookingType] = useState<
    "Online" | "In-Person" | "Hybrid"
  >("Online");
  const [formData, setFormData] = useState({ preferredSchedule: "" });

  const categoryName =
    typeof skill.category === "string" ? skill.category : skill.category?.name || "Uncategorized";

  const owner = skill.owner;
  const providerName =
    [owner?.firstName, owner?.lastName].filter(Boolean).join(" ").trim() ||
    owner?.user?.username ||
    skill.userName ||
    "Unknown";

  const providerLocation = owner?.location || skill.location || "Online";
  const providerRating = skill.userRating || 0;
  const providerReviewCount = owner?.totalReviews || 0;
  const providerAvatar =
    owner?.avatar && typeof owner.avatar === "object" && "url" in owner.avatar
      ? owner.avatar.url
      : typeof owner?.avatar === "string"
        ? owner.avatar
        : "/profile.jpg";

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

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }
    toast.success("Booking request sent successfully!");
    setShowBookingModal(false);
    setSelectedDate("");
    setSelectedTime("");
  };

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
                  {providerRating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {skill.duration || "TBD"}
                </span>
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
                      {skill.mode.replace("inperson", "in person").replace("_", " ")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Duration</p>
                    <p className="font-medium">{skill.duration || "TBD"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Location</p>
                    <p className="font-medium">{skill.location || "Online"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Availability</p>
                    <p className="font-medium">
                      {skill.availability || "Weekday evenings"}
                    </p>
                  </div>
                </div>
              </div>

              {isOwner && (
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
                <Avatar className="h-16 w-16">
                  <AvatarImage src={providerAvatar} alt={providerName} />
                  <AvatarFallback>{providerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{providerName}</h3>
                  <div className="flex items-center gap-1 text-sm mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{providerRating}</span>
                    <span className="text-gray-500">
                      ({providerReviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{providerLocation}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {providerBio}
              </p>

              {!isOwner && (
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

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Request Booking</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Preferred Schedule *</Label>
                <Input
                  id="schedule"
                  placeholder="e.g., Weekends, flexible hours"
                  value={formData.preferredSchedule}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredSchedule: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setBookingType("Online")}
                    variant={bookingType === "Online" ? "default" : "outline"}
                    className={
                      bookingType === "Online"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    Online
                  </Button>
                  <Button
                    onClick={() => setBookingType("In-Person")}
                    variant={
                      bookingType === "In-Person" ? "default" : "outline"
                    }
                    className={
                      bookingType === "In-Person"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    In-Person
                  </Button>
                  <Button
                    onClick={() => setBookingType("Hybrid")}
                    variant={bookingType === "Hybrid" ? "default" : "outline"}
                    className={
                      bookingType === "Hybrid"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    Hybrid
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowBookingModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Send Request
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
