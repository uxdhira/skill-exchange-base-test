import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("strapi-jwt")?.value;
}

function buildPopulateQuery() {
  return [
    "populate[fromUser][populate][0]=avatar",
    "populate[toUser][populate][0]=avatar",
    "populate[skill][populate][0]=owner",
    "populate[booking][populate][0]=requester",
    "populate[booking][populate][1]=provider",
    "populate[booking][populate][2]=requestedSkill",
    "populate[booking][populate][3]=providedSkill",
  ].join("&");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingDocumentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { bookingDocumentId } = await params;

    const response = await fetch(
      `${STRAPI_URL}/api/reviews?filters[booking][documentId][$eq]=${bookingDocumentId}&${buildPopulateQuery()}&sort[0]=createdAt:desc`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("Error fetching reviews for booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews for booking" },
      { status: 500 },
    );
  }
}