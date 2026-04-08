"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/data/mockData";
import { Edit2, Mail, MapPin, Save, Star, User } from "lucide-react";
import { useState } from "react";

// `use client` is required because this page uses local state and edit actions.

/**
 * This page shows the user's profile and allows simple editing in demo mode.
 */
export default function MyProfile() {
  // `useState` is used for local UI state like edit mode and form values.
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    location: currentUser.location,
    bio: "Passionate about learning and sharing knowledge. Always excited to connect with new people and exchange skills!",
  });

  // Save the form and leave edit mode.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // In real app, this would update the database
    alert("Profile updated successfully! (This is a demo)");
  };

  // Update one field in the profile form.
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-blue-600">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{currentUser.name}</h2>
              <div className="flex items-center gap-1 text-lg">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{currentUser.rating}</span>
                <span className="text-gray-500">
                  ({currentUser.reviewCount} reviews)
                </span>
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

              <div className="flex gap-3 pt-4">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
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
                  <p className="font-medium">{formData.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{formData.location}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Bio</p>
                <p className="text-gray-700">{formData.bio}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">5</p>
              <p className="text-sm text-gray-600 mt-1">Skills Offered</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600 mt-1">Exchanges Completed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {currentUser.reviewCount}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
