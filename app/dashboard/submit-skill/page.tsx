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
import { useCreateSkill, useSkill, useUpdateSkill } from "@/hooks/skill";
import { ArrowLeft, Upload } from "lucide-react";
import Image from "next/image";
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();

  const isMutating = createSkill.isPending || updateSkill.isPending;

  // Update one field inside the form state.
  // This supports the controlled form pattern in React.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Guard: auth + owner
      const ownerId = user?.profile?.documentId;
      if (!ownerId) {
        toast("Please login to create a skill", { position: "top-center" });
        return;
      }

      // 2. Resolve category properly
      const categorySlug =
        typeof formData.category === "string"
          ? formData.category
          : formData.category?.slug;

      const selectedCategory = categories.find((c) => c.slug === categorySlug);

      if (!selectedCategory?.documentId) {
        throw new Error("Invalid category selected");
      }

      // 3. Build multipart payload (STRICT Strapi format)
      const multipart = new FormData();
      // Bundle all non-file data into a SINGLE stringified JSON object under the "data" key

      // Bundle data into one string
      const dataPayload = {
        title: formData.title,
        description: formData.description,
        skillLevel: formData.skillLevel.toLowerCase(),
        mode: formData.mode.toLowerCase(),
        currentStatus: "pending",
        location: formData.location,
        category: selectedCategory.documentId, // Use documentId string
        owner: user.profile.documentId, // Use documentId string
      };

      multipart.append("data", JSON.stringify(dataPayload));

      // Pass multipart to your mutateAsync...

      // Append the file separately under the "files.<fieldName>" key
      if (selectedImage) {
        multipart.append("files.image", selectedImage);
      }

      // 6. Mutation (React Query)
      if (isEdit && skillId) {
        await updateSkill.mutateAsync({
          id: skillId,
          formData: multipart,
          ownerId,
        });
      } else {
        await createSkill.mutateAsync({
          formData: multipart,
          ownerId,
        });
      }

      // 7. UX feedback
      toast(
        isEdit
          ? "Skill updated successfully"
          : "Skill created and sent for review",
        { position: "top-center" },
      );

      // 8. Redirect
      router.push("/dashboard/offered-skills");
    } catch (error: any) {
      console.error("Error saving skill:", error);

      toast(error?.message || "Failed to save skill. Please try again.", {
        position: "top-center",
      });
    }
  };
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

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
  useEffect(() => {
    if (skillData && isEdit) {
      setFormData({
        title: skillData.title || "",
        description: skillData.description || "",
        category: skillData.category || "",
        skillLevel: skillData.skillLevel || "Beginner",
        location: skillData.location || "",
        mode:
          skillData.mode === "inperson"
            ? "in_person"
            : (skillData.mode ?? "online"),
      });
      if (skillData.image && skillData.image?.url) {
        setImagePreview(skillData.image.url);
      }
    }
  }, [skillData, isEdit]);
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
                  <SelectItem value="inperson">In Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Images/Samples */}
            <div className="space-y-2">
              <Label>Upload Images / Samples (Optional)</Label>
              {!imagePreview ? (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </label>
              ) : (
                <div className="relative border-2 border-gray-300 rounded-lg p-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={"500"}
                    height={50}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isLoading}
              >
                {isMutating
                  ? "Saving..."
                  : isEdit
                    ? "Update Skill"
                    : "Submit Skill"}
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
