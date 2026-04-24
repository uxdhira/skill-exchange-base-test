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
  ].join("&");
}

async function getReview(documentId: string, token: string) {
  const response = await fetch(
    `${STRAPI_URL}/api/reviews/${documentId}?${buildPopulateQuery()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const result = await response.json();
  return { response, result };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { documentId } = await params;
    const { response, result } = await getReview(documentId, token);

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { documentId } = await params;
    const body = await request.json();
    const { rating, comment } = body?.data || {};

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const { response: existingResponse, result: existingResult } = await getReview(
      documentId,
      token,
    );

    if (!existingResponse.ok) {
      return NextResponse.json(existingResult, {
        status: existingResponse.status,
      });
    }

    const updateResponse = await fetch(
      `${STRAPI_URL}/api/reviews/${documentId}?${buildPopulateQuery()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    const updateResult = await updateResponse.json();

    if (!updateResponse.ok) {
      return NextResponse.json(updateResult, { status: updateResponse.status });
    }

    return NextResponse.json({ data: updateResult.data });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { documentId } = await params;

    const response = await fetch(`${STRAPI_URL}/api/reviews/${documentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const result = await response.json();
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}