import { fetchFromStrapi, StrapiResponse } from "@/lib/backend/strapi";
import { NextRequest, NextResponse } from "next/server";
import type { Skill } from "../../../skills/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> },
) {
  try {
    const { ownerId } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";

    const response = await fetchFromStrapi<StrapiResponse<Skill[]>>(
      `/api/skills?filters[owner][documentId][$eq]=${ownerId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return NextResponse.json(
      {
        data: [],
        meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
      },
      { status: 200 },
    );
  }
}
