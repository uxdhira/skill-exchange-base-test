"use client";

import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoriesResponse {
  data: Category[];
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  const response = await fetch("/api/categories");

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();

  return { data: result.data, meta: result.meta };
}

export function useCategories() {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });
}
