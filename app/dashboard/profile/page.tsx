"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/auth";
import { useCurrentProfile, useUpdateProfile } from "@/hooks/profile";
import { useOwnerSkills } from "@/hooks/skill";
import type { AvailabilitySlot } from "@/types";
import { Edit, Edit2, Mail, MapPin, Save, Star, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// `use client` is required because this page uses local state and edit actions.

/**
 * This page shows the user's profile and allows simple editing in demo mode.
 */

type Slot = AvailabilitySlot;

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}

function toTimeInputValue(time: string) {
  return time.slice(0, 5);
}

function toApiTimeValue(time: string) {
  return `${time}:00.000`;
}

function buildAvailabilityForm(slots?: Slot[] | null) {
  return DAYS.map((_, dayOfWeek) => {
    const slot = slots?.find((item) => item.dayOfWeek === dayOfWeek);

    return {
      id: slot?.id,
      dayOfWeek,
      enabled: !!slot,
      startTime: slot ? toTimeInputValue(slot.startTime) : "09:00",
      endTime: slot ? toTimeInputValue(slot.endTime) : "17:00",
    };
  });
}

function WeeklySchedule({ data }: { data: Slot[] }) {
  const map = new Map<number, Slot>();

  data.forEach((item) => {
    map.set(item.dayOfWeek, item);
  });

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Weekly Availability</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {DAYS.map((day, index) => {
          const slot = map.get(index);

          return (
            <div
              key={day}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="font-medium">{day}</span>

              {slot ? (
                <span className="text-sm text-muted-foreground">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground italic">
                  Unavailable
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
export default function MyProfile() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { data: user, isLoading, error } = useCurrentUser();
  const profileDocumentId = user?.profile?.documentId || "";
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useCurrentProfile(profileDocumentId);
  const updateProfile = useUpdateProfile();
  const ownerId = profileDocumentId;
  const { data: skillsData } = useOwnerSkills(ownerId);
  // `useState` is used for local UI state like edit mode and form values.
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
  });
  const [availabilityForm, setAvailabilityForm] = useState(() =>
    buildAvailabilityForm(),
  );

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    "User";
  const reviewCount = profile?.totalReviews ?? 0;
  const rating = profile?.rating ?? 0;
  const skillsOffered = skillsData?.data?.length ?? 0;
  const exchangesCompleted = profile?.exchangeCompleted ?? 0;
  const displayEmail = user?.email || "";
  const displayLocation = profile?.location || "";
  const displayBio = profile?.bio || "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Save the form and leave edit mode.
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!profileDocumentId) return;

  //   const [firstName, ...rest] = formData.name.trim().split(" ");
  //   const lastName = rest.join(" ");
  //   const availability = availabilityForm
  //     .filter((slot) => slot.enabled)
  //     .map((slot) => ({
  //       id: slot.id,
  //       dayOfWeek: slot.dayOfWeek,
  //       startTime: toApiTimeValue(slot.startTime),
  //       endTime: toApiTimeValue(slot.endTime),
  //     }));

  //   try {
  //     await updateProfile.mutateAsync({
  //       documentId: profileDocumentId,
  //       data: {
  //         firstName: firstName || "",
  //         lastName,
  //         bio: formData.bio,
  //         location: formData.location,
  //         availability,
  //       },
  //     });
  //     setIsEditing(false);
  //     toast("Profile updated successfully", { position: "top-center" });
  //   } catch {
  //     toast("Failed to update profile", { position: "top-center" });
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDocumentId) return;

    const [firstName, ...rest] = formData.name.trim().split(" ");
    const lastName = rest.join(" ");

    const availability = availabilityForm
      .filter((slot) => slot.enabled)
      .map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: toApiTimeValue(slot.startTime),
        endTime: toApiTimeValue(slot.endTime),
      }));

    try {
      const multipart = new FormData();

      // ✅ ALWAYS stringify
      multipart.append(
        "data",
        JSON.stringify({
          firstName: firstName || "",
          lastName,
          bio: formData.bio,
          location: formData.location,
          availability,
        }),
      );

      // ✅ file (optional)
      if (selectedImage) {
        multipart.append("files.avatar", selectedImage);
      }

      await updateProfile.mutateAsync({
        documentId: profileDocumentId,
        formData: multipart,
      });

      setIsEditing(false);
      toast("Profile updated successfully", { position: "top-center" });
    } catch (err) {
      console.error(err);
      toast("Failed to update profile", { position: "top-center" });
    }
  };
  // Update one field in the profile form.
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const startEditing = () => {
    setFormData({
      name: fullName,
      email: displayEmail,
      location: displayLocation,
      bio: displayBio,
    });
    setAvailabilityForm(buildAvailabilityForm(profile.availability));
    setIsEditing(true);
  };

  const handleAvailabilityToggle = (dayOfWeek: number, enabled: boolean) => {
    setAvailabilityForm((current) =>
      current.map((slot) =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, enabled } : slot,
      ),
    );
  };

  const handleAvailabilityTimeChange = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setAvailabilityForm((current) =>
      current.map((slot) =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  if (isLoading || profileLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            Loading profile...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || profileError || !user || !profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Card>
          <CardContent className="py-12 text-center text-red-600">
            Failed to load profile.
          </CardContent>
        </Card>
      </div>
    );
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("Please select an image file (PNG, JPG, JPEG)", {
          position: "top-center",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast("File size must be less than 10MB", { position: "top-center" });
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && (
          <Button onClick={startEditing}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              {/* Avatar */}
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={imagePreview || profile?.avatar?.url}
                  alt="Profile avatar"
                />
                <AvatarFallback className="text-lg font-semibold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>

              {/* Upload overlay */}
              {isEditing && (
                <label className="absolute inset-0 cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                </label>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
              <div className="flex items-center gap-1 text-lg">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
                <span className="text-gray-500">({reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Weekly Availability</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable the days you are available and set your preferred
                    time window.
                  </p>
                </div>

                <div className="space-y-3">
                  {availabilityForm.map((slot) => (
                    <div
                      key={slot.dayOfWeek}
                      className="rounded-lg border p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">
                          {DAYS[slot.dayOfWeek]}
                        </span>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={slot.enabled}
                            onChange={(e) =>
                              handleAvailabilityToggle(
                                slot.dayOfWeek,
                                e.target.checked,
                              )
                            }
                          />
                          Available
                        </label>
                      </div>

                      {slot.enabled && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`start-${slot.dayOfWeek}`}>
                              Start time
                            </Label>
                            <Input
                              id={`start-${slot.dayOfWeek}`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                handleAvailabilityTimeChange(
                                  slot.dayOfWeek,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`end-${slot.dayOfWeek}`}>
                              End time
                            </Label>
                            <Input
                              id={`end-${slot.dayOfWeek}`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                handleAvailabilityTimeChange(
                                  slot.dayOfWeek,
                                  "endTime",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{displayEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{displayLocation}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Bio</p>
                <p className="text-gray-700">{displayBio}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {profile.availability && <WeeklySchedule data={profile.availability} />}
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {skillsOffered}
              </p>
              <p className="text-sm text-gray-600 mt-1">Skills Offered</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {exchangesCompleted}
              </p>
              <p className="text-sm text-gray-600 mt-1">Exchanges Completed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {reviewCount}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
