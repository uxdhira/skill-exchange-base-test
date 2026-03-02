"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/data/mockData";
import { Search, MapPin, Star } from "lucide-react";
import SkillCard from "@/components/ui/skill-card";
import { useGlobalState } from "@/hooks/useGlobalState";

export default function BrowseSkills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState("");
  const { mockSkillData } = useGlobalState();

  const filteredSkills = mockSkillData.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || skill.category === selectedCategory;
    const matchesLocation =
      !locationFilter ||
      skill.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setLocationFilter("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Skills</h1>
        <p className="text-gray-600">
          Discover skills offered by community members
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
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

            {/* Category */}
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
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
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
          </div>
        </CardContent>
      </Card>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">{filteredSkills.length} skills found</p>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Skill Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            directUrl={`/dashboard/skill-details/${skill.id}`}
          />
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
