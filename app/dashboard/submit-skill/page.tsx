"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CATEGORIES } from "@/data/mockData";
import { Upload, ArrowLeft } from "lucide-react";
import { useGlobalState } from "@/hooks/useGlobalState";
import { Skill } from "@/types";
import { toast } from "sonner";

export default function SubmitSkillPage() {
  const router = useRouter(); // Next.js router
  const { addSkill, user, mockSkillData } = useGlobalState();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const skillId = searchParams.get("id");

  const skillToEdit = mockSkillData.find((s) => s.id === skillId);

  const [formData, setFormData] = useState(() => ({
    title: skillToEdit?.title || "",
    description: skillToEdit?.description || "",
    category: skillToEdit?.category || "",
    skillLevel: skillToEdit?.skillLevel || "Beginner",
    location: skillToEdit?.location || "",
    availability: skillToEdit?.availability || "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // alert("Skill submitted successfully! (This is a demo)");
    const newSkill: Skill = {
      id: crypto.randomUUID(), // better than Math.random
      title: formData.title,
      description: formData.description,
      category: formData.category,
      skillLevel: formData.skillLevel,
      location: formData.location,
      availability: formData.availability,
      userId: "user-1", // Assuming current user ID is "user-1"
      status: "accepted",
      userName: `${user?.name}`,
      createdAt: new Date().toISOString(),
      userRating: 4.8,
    };
    addSkill(newSkill);

    const toastMessage = isEdit
      ? "Your skill has been updated successfully!"
      : "Your skill has been created and accepted from our Team. Happy Learning!";
    toast(toastMessage, { position: "top-center" });

    router.push("/dashboard/skills");
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEdit ? "Edit Your Skill" : "Add New Skill"}
          </CardTitle>
          <CardDescription>
            Share your expertise with the community and find someone to exchange
            skills with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Skill Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Web Design Basics, Spanish Tutoring"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Choose a clear, descriptive title
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what you'll teach, who it's for, and what students will learn..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                required
              />
              <p className="text-sm text-gray-500">
                Provide detailed information about your skill
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <Label>Skill Level *</Label>
              <RadioGroup
                value={formData.skillLevel}
                onValueChange={(value) => handleChange("skillLevel", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Beginner" id="beginner" />
                  <Label
                    htmlFor="beginner"
                    className="font-normal cursor-pointer"
                  >
                    Beginner - Just starting out
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label
                    htmlFor="intermediate"
                    className="font-normal cursor-pointer"
                  >
                    Intermediate - Some experience
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Expert" id="expert" />
                  <Label
                    htmlFor="expert"
                    className="font-normal cursor-pointer"
                  >
                    Expert - Advanced level
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="City, State or 'Online'"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Where will you offer this skill?
              </p>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label htmlFor="availability">
                Availability / Time Slots (Optional)
              </Label>
              <Input
                id="availability"
                placeholder="e.g., Weekday evenings, Weekend mornings"
                value={formData.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
              />
            </div>

            {/* Upload Images/Samples */}
            <div className="space-y-2">
              <Label>Upload Images / Samples (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" size="lg" className="flex-1">
                Submit Skill
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
