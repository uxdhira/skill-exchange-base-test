"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RequestedSkill {
  id: string;
  title: string;
  category: string;
  description: string;
  preferredSchedule: string;
  location: string;
  priority: string;
  status: "Active" | "Matched" | "Closed";
  matchCount: number;
}

const mockRequestedSkills: RequestedSkill[] = [
  {
    id: "1",
    title: "Web Development - React",
    category: "Technology",
    description: "Looking for someone to teach React fundamentals and hooks",
    preferredSchedule: "Weekends, flexible hours",
    location: "New York, NY",
    priority: "High",
    status: "Active",
    matchCount: 5,
  },
  {
    id: "2",
    title: "Guitar Lessons",
    category: "Music",
    description: "Want to learn acoustic guitar, beginner level",
    preferredSchedule: "Evenings after 6 PM",
    location: "Brooklyn, NY",
    priority: "Medium",
    status: "Matched",
    matchCount: 2,
  },
];

const categories = [
  "Technology",
  "Music",
  "Art & Design",
  "Language",
  "Fitness",
  "Cooking",
  "Business",
  "Other",
];

export default function RequestedSkills() {
  const [skills, setSkills] = useState<RequestedSkill[]>(mockRequestedSkills);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<RequestedSkill | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    preferredSchedule: "",
    location: "",
    priority: "Medium",
  });

  const generateId = () => {
    return crypto
      .getRandomValues(new Uint8Array(5))
      .reduce((acc, x) => acc + x.toString(16).padStart(2, "0"), "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSkill) {
      setSkills(
        skills.map((s) =>
          s.id === editingSkill.id ? { ...s, ...formData } : s,
        ),
      );
      toast.success("Requested skill updated successfully");
    } else {
      const newSkill: RequestedSkill = {
        id: generateId(),
        ...formData,
        status: "Active",
        matchCount: 0,
      };
      setSkills([newSkill, ...skills]);
      toast.success("Skill request submitted successfully");
    }

    handleCloseDialog();
  };

  const handleEdit = (skill: RequestedSkill) => {
    setEditingSkill(skill);
    setFormData({
      title: skill.title,
      category: skill.category,
      description: skill.description,
      preferredSchedule: skill.preferredSchedule,
      location: skill.location,
      priority: skill.priority,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
    toast.success("Requested skill deleted");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSkill(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      preferredSchedule: "",
      location: "",
      priority: "Medium",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-500";
      case "Matched":
        return "bg-green-500";
      case "Closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">Skills I am Looking For</h1>
          <p className="text-gray-600">
            Request skills you want to learn and find providers who can help
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSkill(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Request New Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Edit Skill Request" : "Request a New Skill"}
              </DialogTitle>
              <DialogDescription>
                Describe the skill you want to learn and we will help you find
                the right provider
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Skill Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Web Development - React"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you want to learn and your current level"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    required
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, State or Online"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSkill ? "Save Changes" : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="mb-2">No skill requests yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start requesting skills you want to learn and we will help you
              find providers
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Request Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{skill.title}</CardTitle>
                    <CardDescription>{skill.category}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(skill.status)}>
                      {skill.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {skill.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Schedule:</span>{" "}
                    {skill.preferredSchedule}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {skill.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Priority:</span>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(skill.priority)}
                    >
                      {skill.priority}
                    </Badge>
                  </div>
                  {skill.matchCount > 0 && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Users className="h-4 w-4" />
                      <span>{skill.matchCount} potential matches</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(skill)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {skill.matchCount > 0 && (
                  <Button size="sm" className="flex-1">
                    View Matches
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
