"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkillCard from "@/components/ui/skill-card";
import { mockSkills } from "@/data/mockData";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

export default function BrowseSkills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [categories, setCategories] = useState<Category["attributes"][]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.data) {
          setCategories(data.data.map((cat: Category) => cat.attributes));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const filteredSkills = mockSkills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (typeof skill.category === "string"
        ? skill.category === selectedCategory
        : skill.category?.name === selectedCategory);
    const matchesLocation =
      !locationFilter ||
      skill.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRating =
      selectedRating === "all" ||
      skill.userRating >= parseFloat(selectedRating);

    return matchesSearch && matchesCategory && matchesLocation && matchesRating;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setLocationFilter("");
    setSelectedRating("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Skills</h1>
        <p className="text-lg text-muted-foreground text-slate-700 font-semibold">
          Discover skills offered by community members
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Skills</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4.8">4.8+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-gray-600">{filteredSkills.length} skills found</p>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <SkillCard skill={skill} directUrl={`/skill/${skill.id}`} />
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No skills found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}