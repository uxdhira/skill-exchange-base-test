import { fetchFromStrapi } from "@/lib/backend/strapi";
import { NextResponse } from "next/server";

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface CategoriesResponse {
  data: Category[];
}

export async function GET() {
  try {
    const response = await fetchFromStrapi<CategoriesResponse>("/api/categories");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ data: [] });
  }
}