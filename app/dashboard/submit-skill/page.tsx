"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useCurrentUser } from "@/hooks/auth";
import { useCategories } from "@/hooks/categories";
import { useSkill } from "@/hooks/skill";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

// `use client` is required because this page uses hooks, form events,
// browser navigation, and interactive inputs.
// This form uses many Shadcn UI components like `Card`, `Button`, `Input`,
// `Label`, `Textarea`, `RadioGroup`, and `Select` for a structured form design.

/**
 * This page is used for both adding a new skill and editing an old one.
 * It checks the URL query to decide which mode to use.
 */
export default function SubmitSkillPage() {
  // `useRouter` is used to go back or redirect after saving.
  const router = useRouter();
  // const { addSkill, editSkill, user, mockSkillData } = useGlobalState();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  // `useSearchParams` reads values from the URL query string.
  // We use it to support edit mode like `?id=...&edit=true`.
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const skillId = searchParams.get("id");

  const { data: skillData, isLoading: skillLoading } = useSkill(skillId || "");
  console.log({ skillData });
  useEffect(() => {
    if (skillData && isEdit) {
      setFormData({
        title: skillData.title || "",
        description: skillData.description || "",
        category: skillData.category || "",
        skillLevel: skillData.skillLevel || "Beginner",
        location: skillData.location || "",
        mode: skillData.mode || "online",
      });
    }
  }, [skillData, isEdit]);

  // `useState` is used for controlled form inputs.
  // We use it so input fields always stay connected to React state.
  // Use old values in edit mode, or blank values for a new skill.
  const [formData, setFormData] = useState(() => ({
    title: "",
    description: "",
    category: "",
    skillLevel: "Beginner",
    location: "",
    mode: "online",
  }));

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const categories = categoriesData?.data || [];
  const [isLoading, setIsLoading] = useState(false);
  console.log({ formData });
  // Create or update a skill when the form is submitted.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedCategory = categories.find(
      (c) => c.slug === formData.category,
    );

    const skillData = {
      title: formData.title,
      description: formData.description,
      category: selectedCategory?.documentId,
      skillLevel: formData.skillLevel.toLowerCase(),
      mode: formData.mode.toLowerCase(),
      currentStatus: "pending",
      owner: user?.profile?.documentId,
    };

    console.log({ skillData, selectedCategory, formData });
    try {
      let response;
      if (isEdit && skillId) {
        response = await fetch(`/api/skills/${skillId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(skillData),
        });
      } else {
        response = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(skillData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save skill");
      }

      const toastMessage = isEdit
        ? "Your skill has been updated successfully!"
        : "Your skill has been created and accepted from our Team. Happy Learning!";
      toast(toastMessage, { position: "top-center" });

      router.push("/dashboard/offered-skills");
    } catch (error) {
      console.error("Error saving skill:", error);
      toast("Failed to save skill. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update one field inside the form state.
  // This supports the controlled form pattern in React.
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
                value={formData.category.slug}
                onValueChange={(value) => handleChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
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
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label
                    htmlFor="beginner"
                    className="font-normal cursor-pointer"
                  >
                    Beginner - Just starting out
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label
                    htmlFor="intermediate"
                    className="font-normal cursor-pointer"
                  >
                    Intermediate - Some experience
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expert" id="expert" />
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

            {/* Mode */}
            <div className="space-y-2">
              <Label>Session Type (Mode)</Label>
              <Select
                value={formData.mode}
                onValueChange={(value) => handleChange("mode", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
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
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Submit Skill"}
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
