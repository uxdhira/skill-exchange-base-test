import {
  deleteToStrapi,
  fetchFromStrapi,
  postToStrapi,
  putToStrapi,
  StrapiResponse,
} from "@/lib/backend/strapi";
import { NextRequest, NextResponse } from "next/server";

export interface Skill {
  id: number;
  attributes: {
    title: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SkillsResponse {
  data: Skill[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";

    const response = await fetchFromStrapi<SkillsResponse>(
      `/api/skills?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } },
      { status: 200 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await postToStrapi<StrapiResponse<Skill>>(
      "/api/skills",
      body,
    );
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const response = await putToStrapi<StrapiResponse<Skill>>(
      `/api/skills/${id}`,
      body,
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 },
      );
    }

    await deleteToStrapi(`/api/skills/${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 },
    );
  }
}
