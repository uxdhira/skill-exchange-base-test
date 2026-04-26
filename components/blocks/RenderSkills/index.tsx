"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SkillCard from "@/components/ui/card/SkillCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSkeleton from "@/components/ui/skeleton/LoadingSkeleton";
import { useCategories } from "@/hooks/categories";
import { useDebounce } from "@/hooks/custom/useDebounce";
import { useSkills } from "@/hooks/skill";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const RenderSkills = ({ urlPrefix }: { urlPrefix: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-driven state (single source of truth)
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("location") || "",
  );
  const [sort, setSort] = useState(
    searchParams.get("sort") || "createdAt:desc",
  );
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const pageSize = 9;

  const debouncedSearch = useDebounce(searchQuery);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (locationFilter) params.set("location", locationFilter);
    if (sort) params.set("sort", sort);
    params.set("page", page.toString());

    router.replace(`?${params.toString()}`);
  }, [debouncedSearch, selectedCategory, locationFilter, sort, page]);

  // Fetch
  const { data, isLoading, isFetching } = useSkills({
    page,
    pageSize,
    search: debouncedSearch,
    category: selectedCategory,
    location: locationFilter,
    sort,
  });

  const skills = data?.data || [];
  const pagination = data?.meta?.pagination;

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, locationFilter, sort]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setLocationFilter("");
    setSort("createdAt:desc");
    setPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 pt-6">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest</SelectItem>
              <SelectItem value="createdAt:asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Results count */}
      <p>{pagination?.total || 0} skills</p>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
          : skills.map((skill) => (
              <SkillCard
                key={skill.documentId}
                skill={skill}
                directUrl={`/${urlPrefix}/${skill.documentId}`}
              />
            ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center gap-3">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>

          <span>
            {pagination.page} / {pagination.pageCount}
          </span>

          <Button
            disabled={page === pagination.pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {isFetching && <p className="text-sm text-gray-500">Updating...</p>}
    </div>
  );
};

export default RenderSkills;
