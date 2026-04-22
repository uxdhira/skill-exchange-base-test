import {
  deleteToStrapi,
  fetchFromStrapi,
  putToStrapi,
  StrapiResponse,
} from "@/lib/backend/strapi";
import { NextRequest, NextResponse } from "next/server";
import { Skill } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const response = await fetchFromStrapi<StrapiResponse<Skill>>(
      `/api/skills/${id}?populate=*`,
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching skill:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
