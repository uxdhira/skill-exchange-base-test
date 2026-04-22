import { fetchFromStrapi } from "@/lib/backend/strapi";

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

interface CategoriesResponse {
  data: Category[];
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  try {
    const response = await fetchFromStrapi<CategoriesResponse>("/api/categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [] };
  }
}